import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public routes that don't require authentication
    const publicRoutes = ['/auth/login', '/auth/signup', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email']
    if (publicRoutes.includes(path)) {
      if (token && path !== '/auth/verify-email') {
        // If user is already logged in, redirect to dashboard (except for verify-email page)
        return NextResponse.redirect(new URL('/user/dashboard', req.url))
      }
      return NextResponse.next()
    }

    // Admin routes
    if (path.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        // If user is not an admin, redirect to dashboard
        return NextResponse.redirect(new URL('/user/dashboard', req.url))
      }
      return NextResponse.next()
    }

    // VIP routes
    if (path.startsWith('/vip')) {
      const hasActiveSubscription = token?.subscriptionStatus === 'active'
      if (!hasActiveSubscription) {
        // If user doesn't have an active subscription, redirect to pricing
        return NextResponse.redirect(new URL('/subscription', req.url))
      }
      return NextResponse.next()
    }

    // Email verification check for protected routes
    if (!token?.isEmailVerified && !path.startsWith('/auth/verify-email')) {
      return NextResponse.redirect(new URL('/auth/verify-email', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes even without token
        const publicRoutes = ['/auth/login', '/auth/signup', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email']
        if (publicRoutes.includes(req.nextUrl.pathname)) {
          return true
        }
        // For all other routes, require authentication
        return !!token
      },
    },
  }
)

// Specify which routes should be protected by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
