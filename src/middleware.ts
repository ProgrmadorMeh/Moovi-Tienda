import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession();
  
  const { pathname } = req.nextUrl;

  // Redirigir si no está autenticado y trata de acceder a rutas protegidas
  if (!session && (pathname.startsWith('/mi-cuenta') || pathname.startsWith('/mis-compras') || pathname.startsWith('/checkout'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Redirigir si está autenticado y trata de acceder a login/register
  if (session && (pathname === '/login' || pathname === '/register')) {
     return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}
 
export const config = {
  matcher: [
    '/login',
    '/register',
    '/mi-cuenta/:path*',
    '/mis-compras/:path*',
    '/checkout',
  ],
}
