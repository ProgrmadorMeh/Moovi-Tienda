
import { supabase } from '../../supabaseClient';

/**
 * Cierra la sesión del usuario actual.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: `Error al cerrar sesión: ${error.message}`,
      };
    }

    return {
      success: true,
      message: 'Sesión cerrada correctamente.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Error inesperado: ${err.message}`,
    };
  }
}

    