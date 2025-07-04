import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const matchSchema = z.object({
    id: z.number(),
    homeTeam: z.string(),
    homeTeamLogo: z.string().optional(),
    awayTeam: z.string(),
    awayTeamLogo: z.string().optional(),
    league: z.string(),
    leagueLogo: z.string().optional(),
    matchTime: z.string(),
    stadium: z.string().optional(),
})

// Schema for creating/updating matches
const createMatchSchema = z.object({
    homeTeam: z.string().min(1, 'Home team is required'),
    homeTeamLogo: z.string().optional(),
    awayTeam: z.string().min(1, 'Away team is required'),
    awayTeamLogo: z.string().optional(),
    league: z.string().min(1, 'League is required'),
    leagueLogo: z.string().optional(),
    matchTime: z.string().datetime('Invalid date format'),
    stadium: z.string().optional(),
})

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const league = searchParams.get('league') || 'all'

        let whereClause: any = {}

        // Filter by league if specified
        if (league !== 'all') {
            whereClause.league = {
                contains: league,
                mode: 'insensitive' // Case-insensitive search
            }
        }

        // Only show future matches
        whereClause.matchTime = {
            gte: new Date()
        }

        const matches = await prisma.match.findMany({
            where: whereClause,
            orderBy: {
                matchTime: 'asc'
            },
            take: 20 // Limit to 20 matches
        })

        if (!matches || matches.length === 0) {
            return NextResponse.json({ message: 'No upcoming matches found.' }, { status: 404 })
        }

        // Transform the data to match the expected format
        const transformedMatches = matches.map(match => ({
            id: match.id,
            homeTeam: match.homeTeam,
            homeTeamLogo: match.homeTeamLogo || '/placeholder-team.png',
            awayTeam: match.awayTeam,
            awayTeamLogo: match.awayTeamLogo || '/placeholder-team.png',
            league: match.league,
            leagueLogo: match.leagueLogo || '/placeholder.svg',
            matchTime: match.matchTime.toISOString(),
            stadium: match.stadium
        }))

        return NextResponse.json(transformedMatches)
    } catch (error: any) {
        console.error('Failed to fetch upcoming matches:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedData = createMatchSchema.parse(body)

        // Convert string date to Date object
        const matchData = {
            ...validatedData,
            matchTime: new Date(validatedData.matchTime)
        }

        const newMatch = await prisma.match.create({
            data: matchData
        })

        return NextResponse.json(newMatch, { status: 201 })
    } catch (error: any) {
        console.error('Failed to create match:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 })
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 