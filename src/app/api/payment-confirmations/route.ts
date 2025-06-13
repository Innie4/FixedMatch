import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { uploadToS3 } from '@/lib/s3'
import rateLimit from '@/lib/rate-limit'

// Define a schema for payment confirmation data using Zod
const paymentConfirmationSchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID is required.').trim(),
  packageName: z.string().min(1, 'Package name is required.').trim(),
  packageDuration: z.string().min(1, 'Package duration is required.').trim(),
  amount: z.preprocess(
    (val) => Number(val), // Convert to number first
    z.number().positive('Amount must be a positive number.')
  ),
  // file is handled separately as it's formData
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Rate limiting
    const identifier = req.ip || 'anonymous'
    const { check } = rateLimit({ interval: 60000, uniqueTokenPerInterval: 5 })
    const { isRateLimited } = check(5, identifier)

    if (isRateLimited) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const packageId = formData.get('packageId') as string
    const paymentMethod = formData.get('paymentMethod') as string
    const amount = formData.get('amount') as string

    if (!file || !packageId || !paymentMethod || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Upload file to S3
    const fileBuffer = await file.arrayBuffer()
    const fileName = `payment-confirmations/${session.user.id}/${Date.now()}-${file.name}`
    const fileUrl = await uploadToS3(fileBuffer, fileName, file.type)

    // Create payment confirmation record
    const paymentConfirmation = await prisma.paymentConfirmation.create({
      data: {
        userId: session.user.id,
        packageId,
        amount: parseFloat(amount),
        paymentMethod,
        status: 'PENDING',
        imageUrl: fileUrl,
      },
      include: {
        user: true,
        package: true,
      },
    })

    // Send confirmation email
    await sendEmail({
      to: session.user.email!,
      template: 'paymentConfirmation',
      data: {
        name: session.user.name!,
        amount: parseFloat(amount),
        package: paymentConfirmation.package.name,
      },
    })

    return NextResponse.json(
      { 
        message: 'Payment confirmation submitted successfully',
        paymentConfirmation,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Payment confirmation error:', error)
    
    if (error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where = {
      userId: session.user.id,
      ...(status && { status }),
    }

    const [confirmations, total] = await Promise.all([
      prisma.paymentConfirmation.findMany({
        where,
        include: {
          package: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.paymentConfirmation.count({ where }),
    ])

    return NextResponse.json({
      confirmations,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error('Error fetching payment confirmations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment confirmations' },
      { status: 500 }
    )
  }
}
