import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const predictionId = parseInt(params.id)
    if (isNaN(predictionId)) {
      return NextResponse.json({ error: 'Invalid prediction ID.' }, { status: 400 })
    }

    const prediction = await prisma.prediction.findUnique({
      where: { id: predictionId },
    })

    if (!prediction) {
      return NextResponse.json({ message: 'Prediction not found.' }, { status: 404 })
    }

    return NextResponse.json(prediction, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch prediction details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
