import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Check if trying to access VIP content
  if (request.nextUrl.pathname.startsWith('/vip/')) {
    if (!token) {
      // Not logged in - redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check if user has active VIP subscription
    if (!token.subscriptionStatus || token.subscriptionStatus === 'expired' || 
        (token.subscriptionExpiry && new Date(token.subscriptionExpiry) < new Date())) {
      // No active subscription - redirect to upgrade page
      return NextResponse.redirect(new URL('/vip/upgrade', request.url))
    }

    // Add subscription info to headers for use in pages
    const response = NextResponse.next()
    if (token.subscriptionStatus) {
      response.headers.set('x-subscription-status', token.subscriptionStatus)
    }
    if (token.subscriptionExpiry) {
      response.headers.set('x-subscription-expiry', new Date(token.subscriptionExpiry).toISOString())
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/vip/:path*',
    '/api/vip/:path*'
  ]
}