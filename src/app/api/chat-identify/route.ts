// src/app/api/chat-identify/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const CHATBASE_SECRET = process.env.NEXT_PUBLIC_CHATBASE_SECRET!;

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { session } } = await supabase.auth.getSession();

    // Si no hay sesión, devolvemos un error. El chatbot funcionará en modo anónimo.
    if (!session) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const user = session.user;
    
    // Preparamos el payload del token con los datos del usuario.
    const payload = {
      user_id: user.id,
      email: user.email,
      // Puedes añadir más atributos personalizados aquí si los necesitas
      // Por ejemplo: name: user.user_metadata.name
    };

    // Firmamos el token con la clave secreta y una expiración de 1 hora.
    const token = jwt.sign(payload, CHATBASE_SECRET, { expiresIn: '1h' });

    // Devolvemos el token al cliente.
    return NextResponse.json({ token });

  } catch (error: any) {
    console.error('Error generating chat identification token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
