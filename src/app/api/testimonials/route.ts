import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to 10 most recent testimonials
    })

    if (!testimonials || testimonials.length === 0) {
      return NextResponse.json({ message: 'No testimonials found.' }, { status: 404 })
    }

    return NextResponse.json(testimonials, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
