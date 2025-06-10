import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for package data
const packageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  durations: z.object({
    twoWeeks: z.object({
      price: z.number().min(0),
      enabled: z.boolean()
    }),
    oneMonth: z.object({
      price: z.number().min(0),
      enabled: z.boolean()
    }),
    threeMonths: z.object({
      price: z.number().min(0),
      enabled: z.boolean()
    }),
    sixMonths: z.object({
      price: z.number().min(0),
      enabled: z.boolean()
    })
  }),
  countries: z.array(z.string()),
  status: z.enum(['active', 'inactive'])
})

// GET /api/admin/packages
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const packages = await prisma.package.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(packages)
  } catch (error) {
    console.error('Failed to fetch packages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/packages
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = packageSchema.parse(body)

    const package = await prisma.package.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        durations: validatedData.durations,
        countries: validatedData.countries,
        status: validatedData.status
      }
    })

    return NextResponse.json(package, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to create package:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/packages/:id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = packageSchema.parse(body)

    const package = await prisma.package.update({
      where: { id: parseInt(params.id) },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        durations: validatedData.durations,
        countries: validatedData.countries,
        status: validatedData.status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(package)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to update package:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/packages/:id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.package.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Package deleted successfully' })
  } catch (error) {
    console.error('Failed to delete package:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 