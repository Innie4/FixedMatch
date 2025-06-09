'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (sessionId) {
      const verifySession = async () => {
        try {
          const response = await fetch('/api/payment-confirmations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
          })

          const data = await response.json()

          if (response.ok) {
            setStatus('success')
            setMessage(data.message || 'Your VIP subscription is now active!')
            // TODO: Potentially refresh session or redirect user after a delay
          } else {
            setStatus('error')
            setMessage(data.error || 'Failed to activate subscription. Please contact support.')
          }
        } catch (err) {
          setStatus('error')
          setMessage('An unexpected error occurred while verifying your subscription.')
          console.error(err)
        }
      }
      verifySession()
    } else {
      setStatus('error')
      setMessage('No session ID found. Payment status cannot be verified.')
    }
  }, [sessionId])

  return (
    <div className="container mx-auto px-4 py-12 text-center min-h-[500px] flex flex-col justify-center items-center">
      {status === 'loading' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a56db] mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verifying your payment...
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Please do not close this page.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center text-green-600 dark:text-green-400">
          <CheckCircle className="h-24 w-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-lg mb-8">{message}</p>
          <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
            <Link href="/vip/predictions">Go to VIP Predictions</Link>
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center text-red-600 dark:text-red-400">
          <XCircle className="h-24 w-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Payment Failed!</h1>
          <p className="text-lg mb-8">{message}</p>
          <Button
            asChild
            variant="outline"
            className="border-[#1a56db] text-[#1a56db] hover:bg-[#1a56db]/10"
          >
            <Link href="/vip/subscribe">Try Again</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
