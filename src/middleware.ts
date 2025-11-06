import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl;
  
  // Redirigir si no está autenticado y trata de acceder a rutas protegidas
  if (!data.session && (pathname.startsWith('/mi-cuenta') || pathname.startsWith('/mis-compras') || pathname.startsWith('/checkout'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Redirigir si está autenticado y trata de acceder a login/register
  if (data.session && (pathname === '/login' || pathname === '/register')) {
     return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/login',
    '/register',
    '/mi-cuenta/:path*',
    '/mis-compras/:path*',
    '/checkout',
  ],
}
