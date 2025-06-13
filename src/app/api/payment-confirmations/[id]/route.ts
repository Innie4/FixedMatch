import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { activateVIPAccess, deactivateVIPAccess } from '@/lib/vip-access'

// PATCH /api/payment-confirmations/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const confirmationId = parseInt(params.id, 10)
    const { status, adminComment } = await request.json()

    if (isNaN(confirmationId)) {
      return NextResponse.json({ success: false, error: 'Invalid confirmation ID' }, { status: 400 })
    }

    if (!['approved', 'declined'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 })
    }

    const confirmation = await prisma.paymentConfirmation.findUnique({
      where: { id: confirmationId },
      include: { user: true, package: true },
    })

    if (!confirmation) {
      return NextResponse.json({ success: false, error: 'Confirmation not found' }, { status: 404 })
    }

    const updatedConfirmation = await prisma.paymentConfirmation.update({
      where: { id: confirmationId },
      data: {
        status,
        adminComment,
        reviewedAt: new Date(),
        // reviewedBy: session.user.id, // Uncomment when session is available
      },
    })

    if (status === 'approved') {
      if (confirmation.user && confirmation.package) {
        await activateVIPAccess(confirmation.user.id, confirmation.package.duration, confirmation.package.id)
        await sendEmail({
          to: confirmation.user.email,
          template: 'paymentConfirmation',
          data: {
            amount: confirmation.amount,
            paymentMethod: confirmation.paymentMethod,
            packageName: confirmation.package.name,
            packageDuration: confirmation.package.duration,
          },
        })
      }
    } else if (status === 'declined') {
      if (confirmation.user) {
        await deactivateVIPAccess(confirmation.user.id)
        await sendEmail({
          to: confirmation.user.email,
          template: 'paymentDeclined', // Assuming you have a 'paymentDeclined' template
          data: {
            amount: confirmation.amount,
            paymentMethod: confirmation.paymentMethod,
            reason: adminComment || 'Your payment confirmation could not be verified.',
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Payment confirmation ${status} successfully`,
      data: updatedConfirmation,
    })
  } catch (error) {
    console.error('Error updating payment confirmation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update payment confirmation status' },
      { status: 500 }
    )
  }
}
