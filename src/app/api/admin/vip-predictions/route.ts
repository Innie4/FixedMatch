import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
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
}

export async function POST(request: Request) {
  const data = await request.json()

  const prediction = await prisma.vIPPrediction.create({
    data: {
      ...data,
      createdBy: 1, // Replace with actual admin ID from session
    },
    include: {
      category: true,
    },
  })

  return NextResponse.json(prediction)
}

export async function PUT(request: Request) {
  const data = await request.json()
  const { id, ...updateData } = data

  const prediction = await prisma.vIPPrediction.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
    },
  })

  return NextResponse.json(prediction)
}

export async function PATCH(request: Request) {
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
}
