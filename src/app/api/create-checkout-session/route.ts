import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
})

const checkoutSessionSchema = z.object({
  packageId: z.number().int().positive('Package ID must be a positive integer.'),
  duration: z.enum(['twoWeeks', 'oneMonth', 'threeMonths', 'sixMonths']),
})

export async function POST(req: Request) {
  try {
    const { packageId, duration } = checkoutSessionSchema.parse(await req.json())

    const pkg = await prisma.package.findUnique({ where: { id: packageId } })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    // Get price from durations field
    const durations = pkg.durations as any
    const durationConfig = durations[duration]

    if (!durationConfig || !durationConfig.enabled) {
      return NextResponse.json({ error: 'Selected duration is not available' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pkg.name,
              description: `${pkg.description || 'VIP Subscription'} - ${duration}`,
            },
            unit_amount: Math.round(durationConfig.price * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/vip/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/vip/subscribe?cancelled=true`,
      metadata: { packageId: pkg.id, packageName: pkg.name, duration },
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 400 })
    } else {
      console.error('Error creating checkout session:', error)
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }
  }
}
