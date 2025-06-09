import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import rateLimit from '@/lib/rate-limit'

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000,
})

export async function GET(request: Request) {
  try {
    // Apply rate limiting
    const ip =
      request.headers.get('x-forwarded-for') || request.connection?.remoteAddress || '127.0.0.1'
    const res = NextResponse.next()
    const isRateLimited = await limiter.check(res, 30, ip) // Allow 30 requests per IP per minute for packages

    if (!isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    const packages = await prisma.package.findMany({
      orderBy: {
        price: 'asc', // Or any other order you prefer
      },
    })

    if (!packages || packages.length === 0) {
      return NextResponse.json({ message: 'No packages found.' }, { status: 404 })
    }

    // TODO: Sanitize output data if necessary (e.g., ensure no sensitive internal data is exposed)
    // For now, assuming Package model does not contain sensitive data

    const response = NextResponse.json(packages, { status: 200 })
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    return response
  } catch (error) {
    console.error('Failed to fetch packages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
