'use client'

import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CancelPage() {
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled')

  useEffect(() => {
    if (cancelled) {
      console.log('Payment was cancelled by the user.')
      // Optionally, send a log to your backend for analytics
    }
  }, [cancelled])

  return (
    <div className="container mx-auto px-4 py-12 text-center min-h-[500px] flex flex-col justify-center items-center">
      <div className="text-center text-red-600 dark:text-red-400">
        <XCircle className="h-24 w-24 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-lg mb-8">
          It looks like your payment was cancelled or did not complete successfully.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
            <Link href="/vip/subscribe">Try Subscribing Again</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#1a56db] text-[#1a56db] hover:bg-[#1a56db]/10"
          >
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
