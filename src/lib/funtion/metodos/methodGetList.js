import { supabase } from '../../supabaseClient'

export async function methodGetList(tabla, filtros = {}, campos = "*") {
  if (!tabla) {
    return {
      success: false,
      message: 'Debes proporcionar el nombre de la tabla.',
      data: null,
    };
  }

  try {
    const condiciones = Object.entries(filtros)
      .filter(([_, valor]) => valor && valor.toString().trim() !== '')
      .map(([campo, valor]) => `${campo}.ilike.%${valor.toString().trim()}%`)
      .join(',');

    let selectQuery = campos;

    if (tabla === "celulares" || tabla === "accesorios") {
      selectQuery = `
        *,
        marcas(nombre) AS brand_name,
        (salePrice * (1 - discount / 100)) AS finalPrice
      `;
    }

    let query = supabase.from(tabla).select(selectQuery);

    if (condiciones) {
      query = query.or(condiciones);
    }

    const { data, error } = await query;

    if (error) {
      return {
        success: false,
        message: `Error al buscar en tabla "${tabla}": ${error.message}`,
        data: null,
      };
    }

    // Convertir campos a number si aplica
    const parsedData = (data ?? []).map((item) => {
      if (tabla === "celulares" || tabla === "accesorios") {
        return {
          ...item,
          salePrice: item.salePrice !== undefined ? Number(item.salePrice) : item.salePrice,
          discount: item.discount !== undefined ? Number(item.discount) : item.discount,
          finalPrice: item.finalPrice !== undefined ? Number(item.finalPrice) : item.finalPrice,
        };
      }
      return item;
    });

    return {
      success: true,
      message: parsedData.length
        ? `Se encontraron ${parsedData.length} registros en la tabla "${tabla}".`
        : `No se encontraron registros en la tabla "${tabla}" con los filtros proporcionados.`,
      data: parsedData,
    };

  } catch (error) {
    return {
      success: false,
      message: `Error inesperado: ${error.message}`,
      data: null,
    };
  }
}
