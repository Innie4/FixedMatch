import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (!teamMembers || teamMembers.length === 0) {
      return NextResponse.json({ message: 'No team members found.' }, { status: 404 })
    }

    return NextResponse.json(teamMembers, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch team members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
