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
    const isRateLimited = await limiter.check(res, 10, ip) // Allow 10 requests per IP per minute

    if (!isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    const recentWins = await prisma.vIPPrediction.findMany({
      where: {
        status: 'won',
        isArchived: false,
      },
      orderBy: {
        matchTime: 'desc',
      },
      take: 5,
      include: {
        category: true,
      },
    })

    if (!recentWins || recentWins.length === 0) {
      return NextResponse.json({ message: 'No recent VIP wins found.' }, { status: 404 })
    }

    const response = NextResponse.json(recentWins, { status: 200 })
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    return response
  } catch (error) {
    console.error('Failed to fetch recent wins:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
