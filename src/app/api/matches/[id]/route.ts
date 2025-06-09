import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const matchId = parseInt(params.id)
    if (isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID.' }, { status: 400 })
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json({ message: 'Match not found.' }, { status: 404 })
    }

    return NextResponse.json(match, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch match details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
