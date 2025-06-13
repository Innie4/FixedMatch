import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import rateLimit from '@/lib/rate-limit'

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000, // 60 seconds
})

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required.').trim(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long.'),
})

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const ip =
      request.headers.get('x-forwarded-for') || request.connection?.remoteAddress || '127.0.0.1'
    const res = NextResponse.next()
    const isRateLimited = await limiter.check(res, 5, ip) // Allow 5 requests per IP per minute

    if (!isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    const { token, newPassword } = resetPasswordSchema.parse(await request.json())

    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!passwordResetToken || passwordResetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: passwordResetToken.userId },
        data: { passwordHash: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: passwordResetToken.id },
      }),
    ])

    const response = NextResponse.json(
      { message: 'Your password has been reset successfully.' },
      { status: 200 }
    )
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 400 })
    } else {
      console.error('Error resetting password:', error)
      return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 })
    }
  }
}
