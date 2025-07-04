import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import rateLimit from '@/lib/rate-limit'

const { check } = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60 * 1000,
})

export async function GET(request: Request) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { isRateLimited } = check(30, ip)

    if (isRateLimited) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    const packages = await prisma.package.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (!packages || packages.length === 0) {
      return NextResponse.json({ message: 'No packages found.' }, { status: 404 })
    }

    // Transform database packages to match frontend Package interface
    const transformedPackages = packages.map((pkg, index) => {
      // Parse durations JSON to get pricing info
      const durations = pkg.durations as any
      const oneMonthPrice = durations?.oneMonth?.price || 29.99
      const twoWeeksPrice = durations?.twoWeeks?.price || 19.99

      // Default features based on package type
      const features = [
        'Premium predictions with 85%+ accuracy',
        'Exclusive VIP analysis and insights',
        'Priority customer support',
        'Early access to new features',
        'Detailed match statistics',
        'Mobile app access'
      ]

      // Add more features for higher tiers
      if (index === 1) {
        features.push('Live match commentary')
        features.push('Advanced betting strategies')
      }
      if (index === 2) {
        features.push('Personal prediction coach')
        features.push('Custom prediction alerts')
        features.push('Exclusive community access')
      }

      return {
        id: pkg.id.toString(),
        name: pkg.name,
        price: oneMonthPrice,
        duration: 'month',
        features: features,
        popular: index === 1, // Make the second package popular
        color: index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
          index === 1 ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
            'bg-gradient-to-br from-gray-500 to-gray-600'
      }
    })

    const response = NextResponse.json(transformedPackages, { status: 200 })
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    return response
  } catch (error) {
    console.error('Failed to fetch packages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
