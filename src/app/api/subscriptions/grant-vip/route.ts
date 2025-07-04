import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    console.log('🔍 [GRANT-VIP] POST /api/subscriptions/grant-vip - Granting VIP access')

    try {
        const body = await request.json()
        const { userId, packageId, duration } = body

        console.log('📝 [GRANT-VIP] Request body:', { userId, packageId, duration })

        if (!userId || !packageId || !duration) {
            console.error('❌ [GRANT-VIP] Missing required fields')
            return NextResponse.json(
                { error: 'Missing required fields: userId, packageId, duration' },
                { status: 400 }
            )
        }

        // Calculate expiration date
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + duration)

        // Check if user already has an active subscription for this package
        const existingSubscription = await prisma.vIPSubscription.findFirst({
            where: {
                userId: userId,
                packageId: packageId,
                status: 'active'
            }
        })

        let subscription
        if (existingSubscription) {
            // Update existing subscription
            subscription = await prisma.vIPSubscription.update({
                where: { id: existingSubscription.id },
                data: {
                    startDate: startDate,
                    endDate: endDate,
                    status: 'active',
                    updatedAt: new Date()
                }
            })
        } else {
            // Create new subscription
            subscription = await prisma.vIPSubscription.create({
                data: {
                    userId: userId,
                    packageId: packageId,
                    startDate: startDate,
                    endDate: endDate,
                    status: 'active'
                }
            })
        }

        // Get updated user info
        const updatedUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscriptions: {
                    where: { status: 'active' },
                    include: { package: true }
                }
            }
        })

        console.log('✅ [GRANT-VIP] Successfully granted VIP access to user:', userId)

        return NextResponse.json({
            success: true,
            message: 'VIP access granted successfully',
            subscription: subscription,
            user: {
                id: updatedUser?.id,
                email: updatedUser?.email,
                activeSubscriptions: updatedUser?.subscriptions || []
            }
        })

    } catch (error) {
        console.error('❌ [GRANT-VIP] Error granting VIP access:', error)
        return NextResponse.json(
            { error: 'Failed to grant VIP access' },
            { status: 500 }
        )
    }
} 