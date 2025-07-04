import { NextResponse } from 'next/server'

interface LiveMatch {
    id: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    league: string
    matchTime: string
    status: string
    elapsed: number
}

// Mock data for live scores
const mockLiveMatches: LiveMatch[] = [
    {
        id: '1',
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        homeScore: 2,
        awayScore: 1,
        league: 'Premier League',
        matchTime: new Date().toISOString(),
        status: 'LIVE',
        elapsed: 67
    },
    {
        id: '2',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        homeScore: 0,
        awayScore: 0,
        league: 'Premier League',
        matchTime: new Date().toISOString(),
        status: 'LIVE',
        elapsed: 23
    },
    {
        id: '3',
        homeTeam: 'Barcelona',
        awayTeam: 'Real Madrid',
        homeScore: 1,
        awayScore: 2,
        league: 'La Liga',
        matchTime: new Date().toISOString(),
        status: 'HT',
        elapsed: 45
    },
    {
        id: '4',
        homeTeam: 'Bayern Munich',
        awayTeam: 'Borussia Dortmund',
        homeScore: 3,
        awayScore: 0,
        league: 'Bundesliga',
        matchTime: new Date().toISOString(),
        status: 'LIVE',
        elapsed: 78
    },
    {
        id: '5',
        homeTeam: 'PSG',
        awayTeam: 'Marseille',
        homeScore: 2,
        awayScore: 2,
        league: 'Ligue 1',
        matchTime: new Date().toISOString(),
        status: 'LIVE',
        elapsed: 89
    },
    {
        id: '6',
        homeTeam: 'AC Milan',
        awayTeam: 'Inter Milan',
        homeScore: 0,
        awayScore: 1,
        league: 'Serie A',
        matchTime: new Date().toISOString(),
        status: 'LIVE',
        elapsed: 34
    }
]

export async function GET() {
    console.log('🔍 [LIVE-SCORES] GET /api/live-scores - Fetching live scores')

    try {
        // Simulate some network delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Randomly update some scores to simulate live updates
        const updatedMatches = mockLiveMatches.map(match => {
            if (match.status === 'LIVE' && Math.random() > 0.7) {
                // 30% chance to update score
                if (Math.random() > 0.5) {
                    match.homeScore += 1
                } else {
                    match.awayScore += 1
                }
                match.elapsed = Math.min(90, match.elapsed + Math.floor(Math.random() * 5))
            }
            return match
        })

        console.log('✅ [LIVE-SCORES] Successfully fetched live scores:', updatedMatches.length, 'matches')

        return NextResponse.json(updatedMatches)
    } catch (error) {
        console.error('❌ [LIVE-SCORES] Error fetching live scores:', error)
        return NextResponse.json(
            { error: 'Failed to fetch live scores' },
            { status: 500 }
        )
    }
} 