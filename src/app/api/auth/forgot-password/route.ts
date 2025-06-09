import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { z } from 'zod'
import rateLimit from '@/lib/rate-limit'

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000, // 60 seconds
})

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
})

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.connection?.remoteAddress || '127.0.0.1'
    const res = NextResponse.next()
    const isRateLimited = await limiter.check(res, 5, ip) // Allow 5 requests per IP per minute for password reset requests

    if (!isRateLimited) {
      return NextResponse.json({ message: 'Too many requests, please try again later.' }, { status: 429 })
    }

    const { email } = forgotPasswordSchema.parse(await request.json())

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // For security reasons, don't reveal if the email doesn't exist
      return NextResponse.json({ message: 'If an account with that email exists, we\'ve sent a password reset link.' }, { status: 200 })
    }

    // Generate a reset token (e.g., a secure random string)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const passwordResetToken = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 3600000), // Token expires in 1 hour
      },
    })

    // TODO: Send email with reset link
    const resetLink = `${request.headers.get('origin')}/auth/reset-password?token=${resetToken}`
    console.log(`Password reset link for ${email}: ${resetLink}`)
    // In a real application, you'd use an email service (e.g., Nodemailer, SendGrid) here.

    const response = NextResponse.json({ message: 'If an account with that email exists, we\'ve sent a password reset link.' }, { status: 200 })
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 400 })
    } else {
      console.error('Error sending password reset email:', error)
      return NextResponse.json({ error: 'Failed to send password reset email.' }, { status: 500 })
    }
  }
} 