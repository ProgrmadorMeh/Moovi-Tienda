import { supabase } from '../../supabaseClient.js';

/**
 * Crea una nueva cuenta en supabase.
 * @param {Object} data_user - Los datos del nuevo usuario.
 * @returns {Promise<{ success: boolean, message: string, data: any[] | null  }>}
 */
export async function singUp(email, password, options = {}){
  if (!email?.trim() || !password?.trim()) {
    return {
      success: false,
      message: 'Email y contraseña son obligatorios.',
      data: null,
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          ...options.data,
        }
      }
    });
  
    if (error) {
      return {
        success: false,
        message: `Error al crear el usuario: ${error.message}`,
        data: null,
      };
    }
    
    // Si el registro es exitoso pero requiere confirmación por email, `data.user` estará allí pero `data.session` será null.
    // Si la confirmación está desactivada, tanto `user` como `session` estarán presentes.
    if(data.user) {
        return {
          success: true,
          message: 'Cuenta creada. Por favor, revisa tu email para la confirmación.',
          data: data.user,
        };
    }

    return { // Caso inesperado
        success: false,
        message: "No se pudo crear el usuario, respuesta inesperada de la API.",
        data: null
    }

  } catch (err) {
    return {
      success: false,
      message: `Error inesperado: ${err.message}`,
      data: null,
    };
  }
}
