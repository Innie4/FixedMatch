import { NextResponse } from 'next/server'
import rateLimit from '@/lib/rate-limit'
import { z } from 'zod'

// Rate limiter setup: 30 requests per minute per IP
const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000,
})

// Zod schema for validating the date query parameter
const dateQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date must be in format YYYY-MM-DD',
    }),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const matchId = id
    // Get IP address for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
      (request as any).connection?.remoteAddress ||
      '127.0.0.1'

    const isAllowed = await limiter.check(30, ip)
    if (!isAllowed) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate the query string
    const { searchParams } = new URL(request.url)
    const query = dateQuerySchema.parse({
      date: searchParams.get('date'),
    })

    // Build and send the external API request
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${encodeURIComponent(
        query.date
      )}`,
      {
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API returned status ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data || data.results === 0 || !data.response?.length) {
      return NextResponse.json(
        { message: `No fixtures found for date ${query.date}` },
        { status: 404 }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

