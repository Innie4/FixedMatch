import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import rateLimit from '@/lib/rate-limit'

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000, // 60 seconds
})

export async function GET(request: Request) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const isRateLimited = await limiter.check(20, ip) // Only 2 arguments

    if (!isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Adjust as needed
    })

    if (!testimonials || testimonials.length === 0) {
      return NextResponse.json({ message: 'No testimonials found.' }, { status: 404 })
    }

    return NextResponse.json(testimonials, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
