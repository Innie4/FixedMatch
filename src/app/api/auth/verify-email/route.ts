import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required.' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired verification token.' }, { status: 400 })
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null, // Clear the token after successful verification
        },
      }),
    ])

    return NextResponse.json({ message: 'Email verified successfully.' }, { status: 200 })
  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.json({ error: 'Failed to verify email.' }, { status: 500 })
  }
}
