import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

const checkoutSchema = z.object({
  packageId: z.number(),
  duration: z.enum(['twoWeeks', 'oneMonth', 'threeMonths', 'sixMonths']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)

    // Get package details
    const pkg = await prisma.package.findUnique({
      where: { id: validatedData.packageId }
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    const duration = pkg.durations[validatedData.duration]
    if (!duration.enabled) {
      return NextResponse.json(
        { error: 'Selected duration is not available' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pkg.name,
              description: `${pkg.description} - ${validatedData.duration} subscription`
            },
            unit_amount: Math.round(duration.price * 100) // Convert to cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: validatedData.successUrl,
      cancel_url: validatedData.cancelUrl,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id.toString(),
        packageId: pkg.id.toString(),
        duration: validatedData.duration
      }
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to create checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 