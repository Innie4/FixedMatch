import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for VIP prediction
const predictionSchema = z.object({
  homeTeam: z.string().min(1, 'Home team is required'),
  awayTeam: z.string().min(1, 'Away team is required'),
  league: z.string().min(1, 'League is required'),
  matchTime: z.string().transform(str => new Date(str)),
  prediction: z.string().min(1, 'Prediction is required'),
  categoryId: z.number(),
  status: z.enum(['pending', 'won', 'lost', 'cancelled']).default('pending'),
  isArchived: z.boolean().default(false),
  result: z.string().optional(),
  odds: z.number().optional(),
  analysis: z.string().optional(),
  confidence: z.number().optional(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const archived = searchParams.get('archived') === 'true'

    const predictions = await prisma.vIPPrediction.findMany({
      where: {
        AND: [
          category ? { category: { slug: category } } : {},
          status ? { status } : {},
          search
            ? {
                OR: [
                  { homeTeam: { contains: search, mode: 'insensitive' } },
                  { awayTeam: { contains: search, mode: 'insensitive' } },
                  { league: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          startDate ? { matchTime: { gte: new Date(startDate) } } : {},
          endDate ? { matchTime: { lte: new Date(endDate) } } : {},
          { isArchived: archived },
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        matchTime: 'desc',
      },
    })

    return NextResponse.json(predictions)
  } catch (error) {
    console.error('Failed to fetch VIP predictions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = predictionSchema.parse(body)

    const prediction = await prisma.vIPPrediction.create({
      data: {
        ...validatedData,
        createdBy: parseInt(session.user.id),
        odds: (validatedData as any).odds ?? 0,
        analysis: (validatedData as any).analysis ?? '',
        confidence: (validatedData as any).confidence ?? 0,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(prediction, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to create VIP prediction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body
    const validatedData = predictionSchema.parse(updateData)

    const prediction = await prisma.vIPPrediction.update({
      where: { id },
      data: validatedData,
      include: {
        category: true,
      },
    })

    return NextResponse.json(prediction)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to update VIP prediction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { id, status, result } = data

    const currentPrediction = await prisma.vIPPrediction.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!currentPrediction) {
      return NextResponse.json({ error: 'Prediction not found' }, { status: 404 })
    }

    const prediction = await prisma.vIPPrediction.update({
      where: { id },
      data: {
        status,
        result,
        ...(status === 'won' || status === 'lost'
          ? {
              category: {
                update: {
                  totalPicks: { increment: 1 },
                  successRate: {
                    set:
                      status === 'won'
                        ? (currentPrediction.category.successRate *
                            currentPrediction.category.totalPicks +
                            100) /
                          (currentPrediction.category.totalPicks + 1)
                        : (currentPrediction.category.successRate *
                            currentPrediction.category.totalPicks) /
                          (currentPrediction.category.totalPicks + 1),
                  },
                },
              },
            }
          : {}),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(prediction)
  } catch (error) {
    console.error('Failed to update VIP prediction status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
