import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export interface VIPAccess {
  isActive: boolean
  expiryDate: Date | null
  package: string | null
  features: string[]
}

export async function checkVIPAccess(userId: string): Promise<VIPAccess> {
  try {
    const subscription = await prisma.vipSubscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        expiryDate: {
          gt: new Date(),
        },
      },
      include: {
        package: true,
      },
    })

    if (!subscription) {
      return {
        isActive: false,
        expiryDate: null,
        package: null,
        features: [],
      }
    }

    return {
      isActive: true,
      expiryDate: subscription.expiryDate,
      package: subscription.package.name,
      features: subscription.package.features,
    }
  } catch (error) {
    console.error('Error checking VIP access:', error)
    throw new Error('Failed to check VIP access')
  }
}

export async function requireVIPAccess() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Authentication required')
  }

  const vipAccess = await checkVIPAccess(session.user.id)

  if (!vipAccess.isActive) {
    throw new Error('VIP access required')
  }

  return vipAccess
}

export async function logVIPAccess(userId: string, action: string, details?: any) {
  try {
    await prisma.vipAccessLog.create({
      data: {
        userId,
        action,
        details: details ? JSON.stringify(details) : null,
      },
    })
  } catch (error) {
    console.error('Error logging VIP access:', error)
  }
}

export async function activateVIPAccess(
  userId: string,
  packageId: string,
  duration: number
): Promise<VIPAccess> {
  try {
    const startDate = new Date()
    const expiryDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000)

    const subscription = await prisma.vipSubscription.create({
      data: {
        userId,
        packageId,
        status: 'ACTIVE',
        startDate,
        expiryDate,
      },
      include: {
        package: true,
      },
    })

    await logVIPAccess(userId, 'ACTIVATED', {
      packageId,
      startDate,
      expiryDate,
    })

    return {
      isActive: true,
      expiryDate: subscription.expiryDate,
      package: subscription.package.name,
      features: subscription.package.features,
    }
  } catch (error) {
    console.error('Error activating VIP access:', error)
    throw new Error('Failed to activate VIP access')
  }
}

export async function deactivateVIPAccess(userId: string): Promise<void> {
  try {
    await prisma.vipSubscription.updateMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      data: {
        status: 'INACTIVE',
      },
    })

    await logVIPAccess(userId, 'DEACTIVATED')
  } catch (error) {
    console.error('Error deactivating VIP access:', error)
    throw new Error('Failed to deactivate VIP access')
  }
}
