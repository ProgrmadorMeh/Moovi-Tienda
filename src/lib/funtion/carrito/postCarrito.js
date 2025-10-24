import { supabase } from '../../supabaseClient.js';

/**
 * Crea un nuevo pedido en la base de datos a partir de los artículos del carrito.
 * @param {Array} carrito - Un array de objetos, donde cada objeto representa un artículo en el carrito (ej: { id: 'prod-123', quantity: 2 }).
 * @param {Object} datos - Objeto con datos adicionales del pedido, como el tipo de pago.
 * @returns {Promise<{ success: boolean, message: string, data: any | null }>}
 */
export async function postCarrito(carrito = [], datos = {}) {
  if (!carrito || carrito.length === 0) {
    return { success: false, message: 'El carrito está vacío.', data: null };
  }

  // 1. Obtener el usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, message: 'No se pudo obtener el usuario.', data: null };
  }

  try {
    // 2. Obtener los datos FRESCOS de los productos desde la base de datos
    const productoIds = carrito.map(item => item.id);
    const { data: celulares, error: celularesError } = await supabase.from('celulares').select('*').in('id', productoIds);
    const { data: accesorios, error: accesoriosError } = await supabase.from('accesorios').select('*').in('id', productoIds);

    if (celularesError || accesoriosError) {
      throw new Error('Error al verificar los productos en la base de datos.');
    }

    const allProductsFromDB = new Map([...celulares, ...accesorios].map(p => [p.id, p]));

    // 3. Construir los detalles del pedido con la lógica de precios correcta
    const detallePedido = carrito.map(cartItem => {
      const productData = allProductsFromDB.get(cartItem.id);
      if (!productData) {
        throw new Error(`El producto con ID ${cartItem.id} no se encontró.`);
      }
      if (productData.stock < cartItem.quantity) {
        throw new Error(`Stock insuficiente para ${productData.model}.`);
      }

      // --- Lógica de Precios con Descuento Dinámico ---
      let finalSalePrice = productData.salePrice;
      // Si hay descuento, se calcula el precio final que se guardará en el pedido.
      if (productData.discount && productData.discount > 0) {
          finalSalePrice = productData.salePrice * (1 - productData.discount / 100);
      }
      // --- Fin de la lógica ---

      return {
        id_producto: cartItem.id,
        cantidad: cartItem.quantity,
        precio: finalSalePrice, // ✅ Se guarda el precio FINAL con descuento
        total: cartItem.quantity * finalSalePrice, // ✅ Se calcula el total con el precio FINAL
      };
    });

    // 4. Calcular el subtotal (neto) del pedido
    const neto = detallePedido.reduce((acc, item) => acc + item.total, 0);

    // 5. Crear el registro del pedido principal
    const pedido = {
      ...datos,
      id_usuario: user.id,
      fecha: new Date().toISOString(),
      estado_envio: 'Pendiente',
      estado_pago: datos.tipo_pago === 'cuotas' ? 'Pendiente' : 'Pagado',
      costo_envio: 1000, // Costo de envío fijo
      neto: neto,
    };

    const { data: pedidoData, error: pedidoError } = await supabase.from('pedido').insert(pedido).select().single();
    if (pedidoError) throw new Error(`Error al crear el pedido: ${pedidoError.message}`);

    const pedidoId = pedidoData.id;

    // 6. Vincular los detalles al pedido e insertarlos
    const detallesConPedidoId = detallePedido.map(item => ({ ...item, id_pedido: pedidoId }));
    const { error: detallesError } = await supabase.from('detalle_pedido').insert(detallesConPedidoId);
    if (detallesError) throw new Error(`Error al guardar los detalles del pedido: ${detallesError.message}`);

    // 7. Calcular el total final (con intereses si aplica) y actualizar el pedido
    const intereses = pedido.estado_pago === 'Pendiente' ? neto * 0.2 : 0;
    const total = neto + intereses + pedido.costo_envio;

    const { error: updateError } = await supabase.from('pedido').update({ intereses, total }).eq('id', pedidoId);
    if (updateError) throw new Error(`Error al actualizar el total del pedido: ${updateError.message}`);
    
    // 8. Opcional: Actualizar el stock de los productos. Se omite por ahora.

    return {
      success: true,
      message: 'Pedido realizado correctamente.',
      data: { pedidoId, neto, intereses, total },
    };

  } catch (err) {
    return {
      success: false,
      message: `Error en el proceso de compra: ${err.message}`,
      data: null,
    };
  }
}