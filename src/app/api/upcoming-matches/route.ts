import { NextResponse } from 'next/server'
import rateLimit from '@/lib/rate-limit'
import { z } from 'zod'

// Initialize the rate limiter (30 requests per minute per IP)
const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000,
})

// Zod schema for validating the query parameter
const fixturesByDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in format YYYY-MM-DD',
  }),
})

export async function GET(request: Request) {
  try {
    // Apply rate limiting based on IP
    const ip =
      request.headers.get('x-forwarded-for') ||
      (request as any).connection?.remoteAddress ||
      '127.0.0.1'

    const isRateLimited = await limiter.check(30, ip)

    if (!isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate the query parameter
    const { searchParams } = new URL(request.url)
    const queryParams = fixturesByDateSchema.parse({
      date: searchParams.get('date'),
    })

    // Build the external API URL
    const apiUrl = `https://v3.football.api-sports.io/fixtures?date=${encodeURIComponent(
      queryParams.date
    )}`

    // Fetch data from external API
    const apiRes = await fetch(apiUrl, {
      headers: {
        'x-rapidapi-key': '85640505820b3d576f53117144276ffb',
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    })

    if (!apiRes.ok) {
      return NextResponse.json(
        { error: `External API returned status ${apiRes.status}` },
        { status: apiRes.status }
      )
    }

    const data = await apiRes.json()

    // If the API returned no fixtures for that date
    if (!data || data.results === 0 || !data.response || data.response.length === 0) {
      return NextResponse.json(
        { message: `No fixtures found for date ${queryParams.date}` },
        { status: 404 }
      )
    }

    // Return the fixtures data
    const response = NextResponse.json(data, { status: 200 })
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    return response
  } catch (error: any) {
    console.error('Failed to fetch fixtures by date:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
