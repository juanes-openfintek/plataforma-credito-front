import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { MiddlewareFactory } from '../app/interfaces/middleFactory.interface'
import { getToken } from 'next-auth/jwt'
import decryptData from '../app/helpers/decryptData'

/**
 * Middleware that checks if the user has admin role before allowing access to admin pages.
 * @param next - The next middleware in the chain.
 * @returns The middleware function.
 */
export const approverMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname
    if (['/aprobador']?.some((path) => pathname.startsWith(path))) {
      const session: any = await getToken({
        req: request,
        secret: process.env.SECRET,
      })
      const expirationDate = new Date(session?.exp * 1000).getTime()
      if (expirationDate < Date.now()) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      const userData = decryptData(session?.user)
      if (!userData?.roles?.includes('approver')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    return next(request, _next)
  }
}
