import { NextResponse } from 'next/server'
import { VIPSubscriptionService } from '@/lib/services/vip-subscription'

export async function GET(request: Request) {
  // Verify cron secret to ensure only authorized calls
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Check expiring subscriptions and send notifications
    await VIPSubscriptionService.checkExpiringSubscriptions()
    
    // Check and handle expired subscriptions
    await VIPSubscriptionService.checkExpiredSubscriptions()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('VIP access check failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}