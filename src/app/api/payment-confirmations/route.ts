import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('screenshot') as File
    const transactionId = formData.get('transactionId')
    const packageName = formData.get('packageName')
    const packageDuration = formData.get('packageDuration')
    const amount = formData.get('amount')

    // Validate required fields
    if (!file || !transactionId || !packageName || !packageDuration || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 2MB' },
        { status: 400 }
      )
    }

    // TODO: Upload file to cloud storage (e.g., AWS S3)
    // const uploadResult = await uploadToCloudStorage(file)

    // TODO: Save payment confirmation to database
    // const paymentConfirmation = await db.paymentConfirmations.create({
    //   data: {
    //     userId: token.sub,
    //     transactionId,
    //     packageName,
    //     packageDuration,
    //     amount: parseFloat(amount as string),
    //     screenshot: uploadResult.url,
    //     status: 'pending'
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: 'Payment confirmation submitted successfully'
    })
  } catch (error) {
    console.error('Failed to submit payment confirmation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit payment confirmation' },
      { status: 500 }
    )
  }
}