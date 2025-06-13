import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import rateLimit from '@/lib/rate-limit'

const { check } = rateLimit({
  uniqueTokenPerInterval: 500, // Max 500 requests per minute per IP
  interval: 60 * 1000, // 60 seconds
})

// Define a schema for registration data using Zod
const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  country: z.string().min(1, 'Country is required').trim(),
})

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const ip =
      request.headers.get('x-forwarded-for') || request.connection?.remoteAddress || '127.0.0.1'
    const { isRateLimited } = check(10, ip) // 10 requests per IP per interval (60s)

    if (isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    // Validate and parse the request body using Zod
    const { fullName, email, password } = registerSchema.parse(await request.json())

    // Implement basic CORS here if needed. Next.js handles most cases by default.
    // const headers = new Headers(request.headers);
    // headers.set('Access-Control-Allow-Origin', '*');
    // headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    // headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        passwordHash: hashedPassword,
        isEmailVerified: false,
        emailVerificationToken,
      },
    })

    const verificationLink = `${request.headers.get('origin')}/auth/verify-email?token=${emailVerificationToken}`
    console.log(`Email verification link for ${email}: ${verificationLink}`)

    return NextResponse.json(
      {
        message: 'User registered successfully. Please verify your email.',
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 400 })
    } else {
      console.error('Registration error:', error)
      return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
    }
  }
}
