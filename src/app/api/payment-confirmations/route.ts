import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { z } from 'zod'

// Define a schema for payment confirmation data using Zod
const paymentConfirmationSchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID is required.').trim(),
  packageName: z.string().min(1, 'Package name is required.').trim(),
  packageDuration: z.string().min(1, 'Package duration is required.').trim(),
  amount: z.preprocess(
    (val) => Number(val), // Convert to number first
    z.number().positive('Amount must be a positive number.')
  ),
  // file is handled separately as it's formData
})

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('screenshot') as File

    // Parse and validate non-file fields using Zod
    const { transactionId, packageName, packageDuration, amount } = paymentConfirmationSchema.parse(
      Object.fromEntries(formData.entries())
    )

    // Validate file presence
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Screenshot file is required.' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, WEBP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 2MB.' },
        { status: 400 }
      )
    }

    // TODO: Upload file to cloud storage (e.g., AWS S3)
    // const uploadResult = await uploadToCloudStorage(file)

    // TODO: Save payment confirmation to database
    // const paymentConfirmation = await prisma.paymentConfirmation.create({
    //   data: {
    //     userId: token.sub,
    //     transactionId,
    //     packageName,
    //     packageDuration,
    //     amount: amount,
    //     screenshotUrl: "placeholder_url", // Use uploadResult.url here
    //     status: 'pending'
    //   }
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'Payment confirmation submitted successfully.',
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      )
    } else {
      console.error('Failed to submit payment confirmation:', error)
      return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 })
    }
  }
}
