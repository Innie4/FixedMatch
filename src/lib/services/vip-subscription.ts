import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'

export interface VIPSubscription {
  id: number
  userId: number
  packageId: number
  startDate: Date
  endDate: Date
  status: 'active' | 'expired' | 'grace_period'
  lastNotificationDate?: Date
}

export class VIPSubscriptionService {
  private static GRACE_PERIOD_DAYS = 2
  private static NOTIFICATION_DAYS = [7, 1]

  static async checkExpiringSubscriptions() {
    const today = new Date()
    
    // Find subscriptions expiring in the next 7 days
    const expiringSubscriptions = await prisma.vipSubscription.findMany({
      where: {
        status: 'active',
        endDate: {
          lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        },
        lastNotificationDate: {
          lt: new Date(today.setHours(0, 0, 0, 0))
        }
      },
      include: {
        user: true,
        package: true
      }
    })

    // Send notifications for expiring subscriptions
    for (const subscription of expiringSubscriptions) {
      const daysUntilExpiry = Math.ceil(
        (subscription.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (this.NOTIFICATION_DAYS.includes(daysUntilExpiry)) {
        await this.sendExpirationNotification(subscription, daysUntilExpiry)
        await prisma.vipSubscription.update({
          where: { id: subscription.id },
          data: { lastNotificationDate: today }
        })
      }
    }
  }

  static async checkExpiredSubscriptions() {
    const today = new Date()
    const gracePeriodDate = new Date(
      today.getTime() - this.GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000
    )

    // Find expired subscriptions
    const expiredSubscriptions = await prisma.vipSubscription.findMany({
      where: {
        status: { in: ['active', 'grace_period'] },
        endDate: { lte: today }
      },
      include: {
        user: true
      }
    })

    // Handle expired subscriptions
    for (const subscription of expiredSubscriptions) {
      if (subscription.endDate > gracePeriodDate) {
        // Move to grace period
        await this.updateSubscriptionStatus(subscription.id, 'grace_period')
      } else {
        // Fully expired - revoke access
        await this.revokeAccess(subscription)
      }
    }
  }

  private static async updateSubscriptionStatus(
    subscriptionId: number,
    status: VIPSubscription['status']
  ) {
    await prisma.vipSubscription.update({
      where: { id: subscriptionId },
      data: { status }
    })

    // Log the status change
    await prisma.vipAccessLog.create({
      data: {
        subscriptionId,
        action: `status_changed_to_${status}`,
        timestamp: new Date()
      }
    })
  }

  private static async revokeAccess(subscription: VIPSubscription & { user: any }) {
    // Update subscription status
    await this.updateSubscriptionStatus(subscription.id, 'expired')

    // Remove VIP role from user
    await prisma.user.update({
      where: { id: subscription.userId },
      data: {
        roles: {
          disconnect: { name: 'vip' }
        }
      }
    })

    // Send expiration notification
    await this.sendAccessRevokedNotification(subscription)
  }

  private static async sendExpirationNotification(
    subscription: VIPSubscription & { user: any; package: any },
    daysRemaining: number
  ) {
    const renewalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/vip/renew?package=${subscription.packageId}`

    const { subject, html } = emailTemplates.subscriptionExpiring(
      subscription.user.name,
      subscription.package.name,
      daysRemaining,
      subscription.endDate.toLocaleDateString(),
      renewalUrl
    )

    await sendEmail({ to: subscription.user.email, subject, html })
  }

  private static async sendAccessRevokedNotification(subscription: VIPSubscription & { user: any }) {
    const renewalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/vip/renew`

    const { subject, html } = emailTemplates.subscriptionExpired(
      subscription.user.name,
      renewalUrl
    )

    await sendEmail({ to: subscription.user.email, subject, html })
  }
}