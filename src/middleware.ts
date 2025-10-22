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
  const protectedPaths = ['/usuario', '/admin', '/aprobador', '/desembolsador']
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

    // Validar rol según la ruta
    if (pathname.startsWith('/usuario') && !userData?.roles?.includes('user')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/admin') && !userData?.roles?.includes('admin')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/aprobador') && !userData?.roles?.includes('approver')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/desembolsador') && !userData?.roles?.includes('disburser')) {
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
    '/aprobador/:path*',
    '/desembolsador/:path*',
  ],
}
