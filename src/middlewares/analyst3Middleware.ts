import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function analyst3Middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verificar rol de analyst3
  try {
    // Aquí podrías decodificar el token JWT para verificar el rol
    // Por ahora, asumimos que si hay token es válido
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

