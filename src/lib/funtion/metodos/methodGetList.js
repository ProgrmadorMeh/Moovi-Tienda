import { supabase } from '../../supabaseClient';

/**
 * Obtiene una lista de registros de una tabla específica de Supabase.
 * @param {string} tabla - El nombre de la tabla de la que se quieren obtener los registros.
 * @returns {Promise<{ success: boolean, message: string, data: any[] | null }>}
 */
export async function methodGetList(tabla) {
  if (!tabla) {
    return {
      success: false,
      message: 'Debes proporcionar el nombre de la tabla.',
      data: null,
    };
  }

  try {
    const { data, error } = await supabase.from(tabla).select("*");

    if (error) {
      console.error(`❌ Error al buscar en tabla "${tabla}":`, error);
      return {
        success: false,
        message: `Error al buscar en tabla "${tabla}": ${error.message}`,
        data: null,
      };
    }

    if (!data) {
        return {
            success: true,
            message: `No se encontraron registros en la tabla "${tabla}".`,
            data: [], // Corregido: Devolver array vacío
        };
    }

    return {
      success: true,
      message: `Se encontraron ${data.length} registros en la tabla "${tabla}".`,
      data,
    };

  } catch (error) {
    console.error(`❌ Error inesperado en methodGetList para tabla "${tabla}":`, error);
    return {
      success: false,
      message: `Error inesperado: ${error.message}`,
      data: null,
    };
  }
}

