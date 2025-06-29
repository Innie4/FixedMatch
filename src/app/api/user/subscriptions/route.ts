import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Define a schema for subscription creation using Zod
const subscriptionSchema = z.object({
  packageId: z.number(),
  duration: z.enum(['twoWeeks', 'oneMonth', 'threeMonths', 'sixMonths']),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscriptions = await prisma.vIPSubscription.findMany({
      where: { userId: parseInt(session.user.id) },
      include: {
        package: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { packageId, duration } = subscriptionSchema.parse(data)

    // Get the package
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    })

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Check if package is active
    if (pkg.status !== 'active') {
      return NextResponse.json(
        { error: 'Package is not currently available' },
        { status: 400 }
      )
    }

    // Check if user has an active subscription
    const activeSubscription = await prisma.vIPSubscription.findFirst({
      where: {
        userId: parseInt(session.user.id),
        status: 'active',
        endDate: {
          gt: new Date(),
        },
      },
    })

    if (activeSubscription) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      )
    }

    // Calculate subscription dates
    const startDate = new Date()
    const endDate = new Date()
    switch (duration) {
      case 'twoWeeks':
        endDate.setDate(endDate.getDate() + 14)
        break
      case 'oneMonth':
        endDate.setMonth(endDate.getMonth() + 1)
        break
      case 'threeMonths':
        endDate.setMonth(endDate.getMonth() + 3)
        break
      case 'sixMonths':
        endDate.setMonth(endDate.getMonth() + 6)
        break
    }

    // Create subscription
    const subscription = await prisma.vIPSubscription.create({
      data: {
        userId: parseInt(session.user.id),
        packageId,
        startDate,
        endDate,
        status: 'active',
      },
      include: {
        package: true,
      },
    })

    // Update package statistics
    await prisma.package.update({
      where: { id: packageId },
      data: {
        subscribers: { increment: 1 },
        revenue: { increment: (pkg.durations as any)[duration].price },
      },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to create subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get('id')

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    const subscription = await prisma.vIPSubscription.findUnique({
      where: { id: parseInt(subscriptionId) },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    if (subscription.userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'Unauthorized to cancel this subscription' },
        { status: 403 }
      )
    }

    // Cancel subscription
    await prisma.vIPSubscription.update({
      where: { id: parseInt(subscriptionId) },
      data: {
        status: 'cancelled',
      },
    })

    return NextResponse.json(
      { message: 'Subscription cancelled successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to cancel subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 