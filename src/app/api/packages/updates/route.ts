import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const headersList = headers()
  const response = new NextResponse(
    new ReadableStream({
      start(controller) {
        // Send initial connection message
        controller.enqueue('data: connected\n\n')

        // Set up SSE connection
        const encoder = new TextEncoder()
        const sendMessage = (data: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        }

        // Subscribe to package updates
        const subscription = prisma.$subscribe.package({
          create: true,
          update: true,
          delete: true,
        })

        subscription.on('data', (data: any) => {
          sendMessage({
            type: data.type,
            data: data.payload,
          })
        })
      },
      cancel() {
        // Unsubscribe from Prisma when the client disconnects
        prisma.$disconnect()
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    }
  )

  return response
}

export async function POST(req: Request) {
  const data: any = await req.json();
  // ... existing code ...
} 