import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Zod schema for prediction filters and query parameters
const predictionQueryParamsSchema = z.object({
  filter: z.enum(['all', 'today', 'tomorrow', 'weekend', 'top', 'vip']).optional(),
  leagues: z
    .string()
    .optional()
    .transform(
      (s) =>
        s
          ?.split(',')
          .map((item) => item.trim().toLowerCase())
          .join(',') || undefined
    ), // Comma-separated league names
  predictionTypes: z
    .string()
    .optional()
    .transform(
      (s) =>
        s
          ?.split(',')
          .map((item) => item.trim().toLowerCase())
          .join(',') || undefined
    ), // Comma-separated prediction types
  confidenceLevels: z
    .string()
    .optional()
    .transform(
      (s) =>
        s
          ?.split(',')
          .map((item) => item.trim().toLowerCase())
          .join(',') || undefined
    ), // Comma-separated confidence levels
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and sanitize query parameters using Zod
    const queryParams = predictionQueryParamsSchema.parse({
      filter: searchParams.get('filter'),
      leagues: searchParams.get('leagues'),
      predictionTypes: searchParams.get('predictionTypes'),
      confidenceLevels: searchParams.get('confidenceLevels'),
    })

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
        whereClause.vipOnly = true // Assuming vipOnly is a boolean field
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

    const predictions = await prisma.prediction.findMany({
      where: whereClause,
      orderBy: {
        matchTime: 'asc',
      },
      take: 6, // Or adjust based on how many you want to show on the homepage
    })

    if (!predictions || predictions.length === 0) {
      return NextResponse.json({ message: 'No predictions found.' }, { status: 404 })
    }

    // TODO: Sanitize output data if necessary (e.g., remove sensitive fields before sending to client)
    // For now, assuming Prediction model does not contain sensitive data

    const response = NextResponse.json(predictions, { status: 200 })
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
