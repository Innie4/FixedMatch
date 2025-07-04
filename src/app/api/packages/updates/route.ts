import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    // Basic validation
    if (!data.id || !data.update) {
      return NextResponse.json(
        { error: 'Missing required fields: id and update' },
        { status: 400 }
      )
    }

    // Update the package
    const updatedPackage = await prisma.package.update({
      where: { id: parseInt(data.id) },
      data: {
        ...data.update,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedPackage, { status: 200 })
  } catch (error) {
    console.error('Failed to update package:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 