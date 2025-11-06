import { createClient } from '@/lib/supabase/client';

/**
 * Inicia sesión de un usuario con email y contraseña.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<{ success: boolean, message: string, data: any | null }>}
 */
export async function loginWithEmail(email, password) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: `Error al iniciar sesión: ${error.message}`,
        data: null,
      };
    }

    return {
      success: true,
      message: "Inicio de sesión exitoso.",
      data: data.user,
    };
  } catch (err) {
    return {
      success: false,
      message: `Error inesperado: ${err.message}`,
      data: null,
    };
  }
}
