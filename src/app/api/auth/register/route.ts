import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import rateLimit from '@/lib/rate-limit'
import { sendEmail } from '@/lib/email'

const { check } = rateLimit({
  uniqueTokenPerInterval: 500, // Max 500 requests per minute per IP
  interval: 60 * 1000, // 60 seconds
})

// Define a schema for registration data using Zod
const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  country: z.string().min(1, 'Country is required').trim(),
})

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { isRateLimited } = check(10, ip) // 10 requests per IP per interval (60s)

    if (isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    // Validate and parse the request body using Zod
    const { fullName, email, password, country } = registerSchema.parse(await request.json())

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 409 }
      )
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
        role: 'customer', // Default role for new users
        country,
      } as any,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
      },
    })

    // Generate verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${emailVerificationToken}`

    // Send verification email
    await sendEmail({
      to: email,
      template: 'welcome',
      data: {
        name: fullName,
        verificationLink,
      },
    })

    return NextResponse.json(
      {
        message: 'User registered successfully. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return NextResponse.json(
        { errors: error.flatten().fieldErrors },
        { status: 400 }
      )
    } else {
      console.error('Registration error:', error)
      return NextResponse.json(
        { message: 'Internal server error.' },
        { status: 500 }
      )
    }
  }
}
