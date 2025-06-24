import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { generateToken } from '@/lib/auth'
import rateLimit from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous'
    const { check } = rateLimit({ interval: 60000, uniqueTokenPerInterval: 5 })
    const { isRateLimited } = check(5, ip)

    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json(
        { message: 'If an account exists, you will receive a password reset email' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = generateToken()
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save reset token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Generate reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    // Send reset email
    await sendEmail({
      to: email,
      template: 'passwordReset',
      data: { resetLink },
    })

    return NextResponse.json(
      { message: 'If an account exists, you will receive a password reset email' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error) {
      console.error('Forgot password error:', error.message);
      if (error.message === 'Rate limit exceeded') {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        )
      }
    } else {
      console.error('Forgot password error:', String(error));
    }
    
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
} 