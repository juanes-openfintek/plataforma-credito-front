import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import decryptData from './app/helpers/decryptData'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    '/', 
    '/login', 
    '/registro', 
    '/terminos-condiciones', 
    '/politica-de-privacidad-tratamiento-de-datos',
    '/creditToPay',
  ]
  
  // Permitir todas las rutas de API y recursos estáticos
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    publicPaths.some(path => pathname === path)
  ) {
    return NextResponse.next()
  }

  // Solo verificar autenticación para rutas protegidas específicas
  const protectedPaths = ['/usuario', '/admin', '/analista1', '/analista2', '/analista3']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  try {
    const session: any = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verificar expiración
    const expirationDate = new Date(session?.exp * 1000).getTime()
    if (expirationDate < Date.now()) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Desencriptar datos del usuario
    let userData
    try {
      userData = decryptData(session?.user)
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const roles: string[] = userData?.roles || []
    const hasRole = (role: string, legacyFallback?: string[]) => {
      return (
        roles.includes(role) ||
        (legacyFallback || []).some((legacy) => roles.includes(legacy))
      )
    }

    // Validar rol según la ruta
    if (pathname.startsWith('/usuario') && !hasRole('user')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/admin') && !hasRole('admin')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/analista1') && !hasRole('analyst1', ['approver'])) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/analista2') && !hasRole('analyst2', ['approver'])) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/analista3') && !hasRole('analyst3', ['approver', 'disburser'])) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/usuario/:path*',
    '/admin/:path*',
    '/analista1/:path*',
    '/analista2/:path*',
    '/analista3/:path*',
  ],
}
