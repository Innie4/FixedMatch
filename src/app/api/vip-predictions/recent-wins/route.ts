import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET() {
  try {
    const recentWins = await prisma.vIPPrediction.findMany({
      where: {
        status: 'won',
        isArchived: false
      },
      orderBy: {
        matchTime: 'desc'
      },
      take: 5,
      include: {
        category: true
      }
    })

    return NextResponse.json(recentWins)
  } catch (error) {
    console.error('Failed to fetch recent wins:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent wins' },
      { status: 500 }
    )
  }
}