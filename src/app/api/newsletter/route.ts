import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import rateLimit from '@/lib/rate-limit'

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000, // 60 seconds
})

const newsletterSignupSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
})

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const ip =
      request.headers.get('x-forwarded-for') || request.connection?.remoteAddress || '127.0.0.1'
    const res = NextResponse.next()
    const isRateLimited = await limiter.check(res, 3, ip) // Allow 3 requests per IP per minute for newsletter signup

    if (!isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    const { email } = newsletterSignupSchema.parse(await request.json())

    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({ where: { email } })
    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'You are already subscribed to our newsletter.' },
        { status: 200 }
      )
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email,
      },
    })

    return NextResponse.json(
      { message: 'Successfully subscribed to the newsletter!' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 400 })
    } else {
      console.error('Newsletter subscription error:', error)
      return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
    }
  }
}
