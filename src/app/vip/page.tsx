'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Crown, Star } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useEffect, useState } from 'react'

interface Package {
  id: number
  name: string
  price: number
  duration: string
  description?: string
  features: string[]
  popular: boolean
  color?: string
}

export default function VIPPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Package[] = await response.json()
        setPackages(data)
      } catch (e) {
        setError('Failed to load pricing packages.')
        console.error('Fetching packages error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1a56db] text-white mb-6">
          <Crown className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Unlock Premium Football Predictions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Join our VIP community and get access to exclusive, high-confidence tips, detailed
          analysis, and more.
        </p>

        {loading && (
          <div className="text-center text-gray-600 dark:text-gray-400">Loading packages...</div>
        )}
        {error && <div className="text-center text-red-600 dark:text-red-400">{error}</div>}

        {!loading && !error && packages.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            No VIP packages available at the moment.
          </div>
        )}

        {!loading && !error && packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`flex flex-col ${pkg.popular ? 'border-2 border-[#1a56db]' : ''}`}
              >
                <CardHeader className="text-center pb-4">
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a56db] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {pkg.description}
                  </CardDescription>
                  <p className="text-5xl font-extrabold text-gray-900 dark:text-white mt-4">
                    ${pkg.price.toFixed(2)}
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                      /{pkg.duration.toLowerCase().replace('ly', '') || 'month'}
                    </span>
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-left text-gray-700 dark:text-gray-300">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button asChild className="w-full bg-[#1a56db] hover:bg-[#1e40af]">
                    <Link href={`/vip/subscribe?packageId=${pkg.id}`}>Choose {pkg.name}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700 mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Go VIP?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Star className="h-5 w-5 text-[#1a56db]" />
                Unmatched Accuracy
              </h3>
              <p>
                Our expert analysts and advanced algorithms work tirelessly to provide you with the
                most reliable predictions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Crown className="h-5 w-5 text-[#1a56db]" />
                Exclusive Content
              </h3>
              <p>
                Gain access to VIP-only tips, detailed match analyses, and insights not available to
                regular users.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#1a56db]" />
                24/7 Support
              </h3>
              <p>
                Our dedicated support team is always ready to assist you with any questions or
                issues.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Image src="/FIXEDMatchD.png" alt="Logo" width={20} height={20} className="mr-2" />
                Transparent Performance
              </h3>
              <p>
                We believe in full transparency. Track our past performance and see our impressive
                success rates.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          {/* TODO: Implement an Accordion component for FAQs */}
          <p className="text-gray-700 dark:text-gray-300">[FAQ section to be implemented]</p>
        </div>
      </div>
    </div>
  )
}
