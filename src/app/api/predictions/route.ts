import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Zod schema for prediction filters and query parameters
const predictionQueryParamsSchema = z.object({
  filter: z.enum(['all', 'today', 'tomorrow', 'weekend', 'top', 'vip']).optional().default('all'),
  leagues: z
    .string()
    .nullable()
    .optional()
    .transform((s) => s || undefined), // Handle null values
  predictionTypes: z
    .string()
    .nullable()
    .optional()
    .transform((s) => s || undefined), // Handle null values
  confidenceLevels: z
    .string()
    .nullable()
    .optional()
    .transform((s) => s || undefined), // Handle null values
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    console.log('🔍 Predictions API called with params:', {
      filter: searchParams.get('filter'),
      leagues: searchParams.get('leagues'),
      predictionTypes: searchParams.get('predictionTypes'),
      confidenceLevels: searchParams.get('confidenceLevels'),
    })

    const queryParams = predictionQueryParamsSchema.parse({
      filter: searchParams.get('filter') ?? undefined,
      leagues: searchParams.get('leagues') ?? undefined,
      predictionTypes: searchParams.get('predictionTypes') ?? undefined,
      confidenceLevels: searchParams.get('confidenceLevels') ?? undefined,
    })

    console.log('✅ Parsed query params:', queryParams)

    let whereClause: any = {}

    // Apply main filter (e.g., all, today, top, vip)
    switch (queryParams.filter) {
      case 'today':
        // TODO: Implement actual date filtering for "today", "tomorrow", "weekend"
        // For now, this will return all predictions for these filters unless further refined.
        // Example: const today = new Date();
        // today.setHours(0, 0, 0, 0);
        // const tomorrow = new Date(today);
        // tomorrow.setDate(today.getDate() + 1);
        // whereClause.matchTime = { gte: today, lt: tomorrow };
        break
      case 'tomorrow':
        break
      case 'weekend':
        break
      case 'top':
        whereClause.confidence = { gte: 80 } // Assuming confidence is a number field
        break
      case 'vip':
        // Since there's no vipOnly field in Prediction model, 
        // return high-confidence predictions as VIP content
        whereClause.confidence = { gte: 85 }
        break
      case 'all':
      default:
        break
    }

    // Apply league filter
    if (queryParams.leagues) {
      const leagueNames = queryParams.leagues.split(',').map((s) => s.trim())
      if (leagueNames.length > 0) {
        whereClause.league = { in: leagueNames }
      }
    }

    // Apply prediction type filter
    if (queryParams.predictionTypes) {
      const predictionTypes = queryParams.predictionTypes.split(',').map((s) => s.trim())
      if (predictionTypes.length > 0) {
        whereClause.prediction = { in: predictionTypes } // Assuming prediction field stores the type
      }
    }

    // Apply confidence level filter
    if (queryParams.confidenceLevels) {
      const confidenceLevels = queryParams.confidenceLevels.split(',').map((s) => s.trim())
      const confidenceConditions: any[] = []
      confidenceLevels.forEach((level) => {
        if (level === 'high (90%+)') {
          confidenceConditions.push({ confidence: { gte: 90 } })
        } else if (level === 'medium (70-90%)') {
          confidenceConditions.push({ confidence: { gte: 70, lt: 90 } })
        } else if (level === 'low (<70%)') {
          confidenceConditions.push({ confidence: { lt: 70 } })
        }
      })
      if (confidenceConditions.length > 0) {
        whereClause.OR = confidenceConditions // Use OR for multiple confidence level selections
      }
    }

    console.log('🔍 Where clause for query:', whereClause)

    const predictions = await prisma.prediction.findMany({
      where: whereClause,
      orderBy: {
        matchTime: 'asc',
      },
      take: 6, // Or adjust based on how many you want to show on the homepage
    })

    console.log(`📊 Found ${predictions.length} predictions`)

    if (!predictions || predictions.length === 0) {
      return NextResponse.json({ message: 'No predictions found.' }, { status: 404 })
    }

    // Always include logo fields with sensible defaults
    const predictionsWithLogos = predictions.map((p) => ({
      ...p,
      leagueLogo: '/placeholder.svg',
      homeTeamLogo: '/placeholder.svg',
      awayTeamLogo: '/placeholder.svg',
    }))

    const response = NextResponse.json(predictionsWithLogos, { status: 200 })
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    return response
  } catch (error: any) {
    console.error('Failed to fetch predictions:', error)
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    // Provide a more generic error message to the client for security
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
