'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function SubscribePage() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/packages')
        if (!response.ok) {
          throw new Error('Failed to fetch packages')
        }
        const data = await response.json()
        setPackages(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  const handleSubscribe = async (pkg: any) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId: pkg.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session.')
      }

      const { url } = await response.json()
      window.location.href = url // Redirect to Stripe Checkout
    } catch (err: any) {
      console.error('Subscription error:', err)
      alert(`Error subscribing: ${err.message}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your VIP Plan
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Unlock exclusive football predictions, advanced analysis, and premium features by
          subscribing to one of our VIP plans.
        </p>
      </div>

      {loading && <p className="text-center">Loading packages...</p>}
      {error && <p className="text-center text-red-500">Error loading packages: {error}</p>}

      {!loading && !error && packages.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No packages available at the moment. Please check back later.
        </p>
      )}

      {!loading && !error && packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {packages.map((pkg: any) => (
            <Card
              key={pkg.id}
              className={`${pkg.color} ${pkg.popular ? 'border-2 border-[#1a56db]' : ''} text-white dark:text-gray-900`}
            >
              <CardHeader className="text-center pb-0">
                {pkg.popular && (
                  <Badge className="bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-semibold rounded-full mb-2 mx-auto">
                    Most Popular
                  </Badge>
                )}
                <CardTitle
                  className={`text-3xl font-bold ${pkg.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}
                >
                  {pkg.name}
                </CardTitle>
                <p
                  className={`mt-2 ${pkg.popular ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <span className="text-4xl font-bold">${pkg.price}</span> / {pkg.duration}
                </p>
              </CardHeader>
              <CardContent className="py-6 px-4">
                <ul className="space-y-3">
                  {pkg.features.map((feature: any, index: any) => (
                    <li key={index} className="flex items-center justify-center gap-2">
                      <Check
                        className={`h-5 w-5 ${pkg.popular ? 'text-green-300' : 'text-green-500'}`}
                      />
                      <span
                        className={`${pkg.popular ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-4">
                <Button
                  onClick={() => handleSubscribe(pkg)}
                  className={`w-full ${pkg.popular ? 'bg-white text-[#1a56db] hover:bg-gray-100' : 'bg-[#1a56db] text-white hover:bg-[#1e40af]'}`}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
