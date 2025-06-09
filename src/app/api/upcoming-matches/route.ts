import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import rateLimit from '@/lib/rate-limit'
import { z } from 'zod'

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000,
})

// Zod schema for query parameters
const upcomingMatchesQueryParamsSchema = z.object({
  league: z
    .string()
    .optional()
    .transform((s) => s?.trim().toLowerCase() || undefined), // Filter by league
})

export async function GET(request: Request) {
  try {
    // Apply rate limiting
    const ip =
      request.headers.get('x-forwarded-for') || request.connection?.remoteAddress || '127.0.0.1'
    const res = NextResponse.next()
    const isRateLimited = await limiter.check(res, 30, ip) // Allow 30 requests per IP per minute

    if (!isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)

    // Parse and sanitize query parameters using Zod
    const queryParams = upcomingMatchesQueryParamsSchema.parse({
      league: searchParams.get('league'),
    })

    let whereClause: any = {
      matchTime: {
        gte: new Date(), // Only fetch matches in the future
      },
    }

    // Apply league filter if present
    if (queryParams.league) {
      whereClause.league = { equals: queryParams.league }
    }

    const upcomingMatches = await prisma.match.findMany({
      where: whereClause,
      orderBy: {
        matchTime: 'asc',
      },
    })

    if (!upcomingMatches || upcomingMatches.length === 0) {
      return NextResponse.json({ message: 'No upcoming matches found.' }, { status: 404 })
    }

    // TODO: Sanitize output data if necessary (e.g., ensure no sensitive internal data is exposed)
    // For now, assuming Match model does not contain sensitive data

    const response = NextResponse.json(upcomingMatches, { status: 200 })
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    return response
  } catch (error: any) {
    console.error('Failed to fetch upcoming matches:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
