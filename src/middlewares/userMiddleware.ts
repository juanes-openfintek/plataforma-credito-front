import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { MiddlewareFactory } from '../app/interfaces/middleFactory.interface'
import { getToken } from 'next-auth/jwt'
import decryptData from '../app/helpers/decryptData'

/**
 * Middleware that checks if the user is authenticated and has the 'user' role.
 * If not, redirects to the login page.
 * @param next - The next middleware in the chain.
 * @returns The middleware function.
 */
export const userMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname
    if (['/usuario']?.some((path) => pathname.startsWith(path))) {
      try {
        const session: any = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET || process.env.SECRET,
        })
        
        console.log('🔍 Session check for /usuario:', session ? 'Session found' : 'No session')
        
        if (!session) {
          console.log('❌ No session found, redirecting to login')
          return NextResponse.redirect(new URL('/login', request.url))
        }
        
        const expirationDate = new Date(session?.exp * 1000).getTime()
        if (expirationDate < Date.now()) {
          console.log('❌ Session expired, redirecting to home')
          return NextResponse.redirect(new URL('/', request.url))
        }
        
        let userData;
        try {
          userData = decryptData(session?.user)
        } catch (decryptError) {
          console.error('❌ Error decrypting user data:', decryptError)
          return NextResponse.redirect(new URL('/login', request.url))
        }
        
        if (!userData || !userData?.roles?.includes('user')) {
          console.log('❌ User does not have user role, redirecting to home')
          return NextResponse.redirect(new URL('/', request.url))
        }
        
        console.log('✅ User authenticated successfully')
      } catch (error) {
        console.error('❌ Error in userMiddleware:', error)
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    return next(request, _next)
  }
}
