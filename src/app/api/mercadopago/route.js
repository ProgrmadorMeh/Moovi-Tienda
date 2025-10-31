// No se necesita dotenv en producción con Next.js, las variables se cargan automáticamente
const accessToken = process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN;

export async function POST(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verificar si el token de acceso está disponible
  if (!accessToken) {
    console.error('Error: La variable de entorno NEXT_PUBLIC_MP_ACCESS_TOKEN no está configurada.');
    return new Response(
      JSON.stringify({ success: false, message: 'Error de configuración del servidor: el token de pago no está disponible.' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
  console.log('NEXT_PUBLIC_MP_ACCESS_TOKEN cargado correctamente.');

  try {
    const { carrito, email } = await req.json();
    const items = carrito.map((item) => ({
      title: item.nombre,
      quantity: Number(item.cantidad) || 1,   // asegurar que es número
      unit_price: Number(item.precio) || 0,   // asegurar que es número
      currency_id: 'ARS',
    }));
    console.log("Items para Mercado Pago:", items);
    
    // Usamos URLs relativas para mayor portabilidad
    const baseUrl = req.headers.get('origin') || 'https://moovitech.com';

    const preference = {
      items,
      payer: { email },
      back_urls: {
        success: `${baseUrl}/compra-exitosa`,
        failure: `${baseUrl}/pago-fallido`,
        pending: `${baseUrl}/pago-fallido`,
      },
      auto_return: "approved",
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Error desde la API de Mercado Pago:', data);
        return new Response(
            JSON.stringify({ success: false, message: 'Error desde Mercado Pago', error: data }),
            { headers: { 'Content-Type': 'application/json' }, status: response.status }
        );
    }

    // Si todo va bien, devolvemos el init_point.
    return new Response(
      JSON.stringify({
        success: true,
        init_point: data.init_point,
        id: data.id,
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err) {
    console.error('Error interno del servidor:', err);
    return new Response(
      JSON.stringify({ success: false, message: err.message || 'Ocurrió un error interno en el servidor.' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}