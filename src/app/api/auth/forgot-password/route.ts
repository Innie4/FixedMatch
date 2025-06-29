import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { z } from 'zod'
import rateLimit from '@/lib/rate-limit'
import { sendEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'

const { check } = rateLimit({
  uniqueTokenPerInterval: 500, // Max 500 requests per minute per IP
  interval: 60 * 1000, // 60 seconds
})

// Define a schema for forgot password request using Zod
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
})

// Define a schema for reset password request using Zod
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
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
    const { email } = forgotPasswordSchema.parse(await request.json())

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json(
        { message: 'If an account exists with this email, you will receive a password reset link.' },
        { status: 200 }
      )
    }

    // Generate reset token and expiry (2 hours from now)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt
      }
    })

    // Generate reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

    // Send reset email
    await sendEmail({
      to: email,
      template: 'passwordReset',
      data: {
        name: user.name || 'User',
        resetLink,
      },
    })

    return NextResponse.json(
      { message: 'If an account exists with this email, you will receive a password reset link.' },
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
      console.error('Forgot password error:', error)
      return NextResponse.json(
        { message: 'Internal server error.' },
        { status: 500 }
      )
    }
  }
}

export async function PUT(request: Request) {
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
    const { token, password } = resetPasswordSchema.parse(await request.json())

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(), // Token must not be expired
        },
      },
      include: {
        user: true,
      },
    })

    if (!resetToken) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token.' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user's password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        passwordHash: hashedPassword,
      },
    })

    // Delete all reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId }
    })

    return NextResponse.json(
      { message: 'Password has been reset successfully.' },
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
      console.error('Reset password error:', error)
      return NextResponse.json(
        { message: 'Internal server error.' },
        { status: 500 }
      )
    }
  }
} 