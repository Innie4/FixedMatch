import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Handle WebSocket upgrade requests
  if (request.headers.get('upgrade') === 'websocket') {
    return NextResponse.next()
  }

  const token = await getToken({ req: request })

  const response = NextResponse.next()

  // Security Headers
  // Content Security Policy (CSP)
  const csp = `
    default-src 'self';
    img-src 'self' data: res.cloudinary.com;
    script-src 'self' 'unsafe-eval' https://accounts.google.com;
    style-src 'self' 'unsafe-inline';
    font-src 'self';
    connect-src 'self';
  `
    .replace(/\n/g, ' ')
    .trim()

  if (process.env.NODE_ENV === 'production') {
    // Stricter CSP for production
    // Remove 'unsafe-eval' in production for script-src if possible
    // You might need to adjust script-src further based on your Next.js setup and third-party scripts
    response.headers.set(
      'Content-Security-Policy',
      `
      default-src 'self';
      img-src 'self' data: res.cloudinary.com;
      script-src 'self' https://accounts.google.com;
      style-src 'self' 'unsafe-inline';
      font-src 'self';
      connect-src 'self';
    `
        .replace(/\n/g, ' ')
        .trim()
    )
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  } else {
    // More permissive CSP for development
    response.headers.set('Content-Security-Policy', csp)
  }

  // Check if trying to access VIP content
  if (request.nextUrl.pathname.startsWith('/vip/')) {
    if (!token) {
      // Not logged in - redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check if user has active VIP subscription
    if (
      !token.subscriptionStatus ||
      token.subscriptionStatus === 'expired' ||
      (token.subscriptionExpiry && new Date(token.subscriptionExpiry) < new Date())
    ) {
      // No active subscription - redirect to upgrade page
      return NextResponse.redirect(new URL('/vip/upgrade', request.url))
    }

    // Add subscription info to headers for use in pages
    if (token.subscriptionStatus) {
      response.headers.set('x-subscription-status', token.subscriptionStatus)
    }
    if (token.subscriptionExpiry) {
      response.headers.set(
        'x-subscription-expiry',
        new Date(token.subscriptionExpiry).toISOString()
      )
    }
    return response
  }

  return response // Ensure the response with headers is returned for non-VIP paths
}

export const config = {
  matcher: [
    // Add WebSocket endpoint to matcher
    '/api/ws',
    '/vip/:path*',
    '/api/vip/:path*',
  ],
}
