import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import rateLimit from '@/lib/rate-limit'

const { check } = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000, // 60 seconds
})

// Define a schema for email verification using Zod
const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { isRateLimited } = check(5, ip) // 5 requests per IP per interval (60s)

    if (isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    // Validate and parse the request body using Zod
    const { token } = verifyEmailSchema.parse(await request.json())

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        isEmailVerified: false,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired verification token.' },
        { status: 400 }
      )
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    })

    return NextResponse.json(
      { message: 'Email verified successfully.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return NextResponse.json(
        { errors: error.flatten().fieldErrors },
        { status: 400 }
      )
    } else {
      console.error('Email verification error:', error)
      return NextResponse.json(
        { message: 'Internal server error.' },
        { status: 500 }
      )
    }
  }
}
