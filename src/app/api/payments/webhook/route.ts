import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Create subscription
        const startDate = new Date()
        let endDate = new Date()

        // Calculate end date based on duration
        switch (session.metadata?.duration) {
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

        // Create subscription record
        await prisma.vIPSubscription.create({
          data: {
            userId: parseInt(session.metadata!.userId),
            packageId: parseInt(session.metadata!.packageId),
            startDate,
            endDate,
            status: 'active'
          }
        })

        // Update package stats
        await prisma.package.update({
          where: { id: parseInt(session.metadata!.packageId) },
          data: {
            subscribers: { increment: 1 },
            revenue: { increment: session.amount_total! / 100 } // Convert from cents
          }
        })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        // Handle subscription cancellation
        // You might want to update the subscription status to 'expired'
        break
      }

      // Add more event handlers as needed
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 