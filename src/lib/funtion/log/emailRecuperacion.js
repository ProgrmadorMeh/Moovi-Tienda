import { createClient } from '@/lib/supabase/client';

export async function emailRecuperacion(email) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/recuperar', // cambia esta URL
  });

  if (error) return {
        success: false,
        message: `Error al enviar el email de recuperacion: ${error}`,
        data: null,
      }
  return {
        success: true,
        message: "Correo de verificacion enviado correctamente",
        data: data ?? null,
      }
}
