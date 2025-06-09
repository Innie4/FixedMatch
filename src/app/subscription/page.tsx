'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle2, Crown, Calendar, Info, Clock, Download } from 'lucide-react'
import { useEffect, useState } from 'react'

interface VIPSubscription {
  id: number
  packageName: string
  startDate: string
  endDate: string
  status: string
  price: number
  duration: string
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const [activeSubscription, setActiveSubscription] = useState<VIPSubscription | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  const [loadingSubscription, setLoadingSubscription] = useState(true)
  const [errorSubscription, setErrorSubscription] = useState<string | null>(null)

  // Simulate fetching user's subscription and payment history
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (session?.user?.id) {
        try {
          setLoadingSubscription(true)
          // For demonstration, use mock data. In a real app, fetch from `/api/user/subscription`
          // and `/api/user/payment-history`.
          await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call delay

          // Mock active subscription
          const mockSubscription = {
            id: 123,
            packageName: 'Premium Monthly',
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            status: 'active',
            price: 29.99,
            duration: 'Monthly',
          }

          // Mock payment history
          const mockPaymentHistory = [
            {
              id: 'pay_001',
              date: '2024-06-01',
              amount: 29.99,
              plan: 'Premium Monthly',
              status: 'paid',
              invoiceUrl: '#',
            },
            {
              id: 'pay_002',
              date: '2024-05-01',
              amount: 29.99,
              plan: 'Premium Monthly',
              status: 'paid',
              invoiceUrl: '#',
            },
          ]

          setActiveSubscription(mockSubscription)
          setPaymentHistory(mockPaymentHistory)
        } catch (e) {
          setErrorSubscription('Failed to load subscription data.')
          console.error('Fetching subscription error:', e)
        } finally {
          setLoadingSubscription(false)
        }
      } else if (status === 'unauthenticated') {
        setLoadingSubscription(false) // No user, so no subscription to load
      }
    }

    fetchSubscriptionData()
  }, [session, status])

  if (status === 'loading' || loadingSubscription) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">Loading subscription details...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Please log in to view your subscriptions.
          </p>
          <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
            <Link href="/auth/login">Log In</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (errorSubscription) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-600 dark:text-red-400">
        <p>{errorSubscription}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          My Subscription
        </h1>

        {!activeSubscription ? (
          <Card className="bg-white dark:bg-gray-800 text-center p-8">
            <Crown className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <CardTitle className="text-2xl font-bold mb-2">No Active Subscription</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 mb-6">
              It looks like you don't have an active VIP subscription. Upgrade now to get access to
              premium predictions!
            </CardDescription>
            <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
              <Link href="/vip">View VIP Plans</Link>
            </Button>
          </Card>
        ) : (
          <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-[#1a56db]" />
                {activeSubscription.packageName} - VIP Member
              </CardTitle>
              <CardDescription>Your current premium subscription details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Calendar className="h-5 w-5 text-[#1a56db]" />
                <p>
                  <span className="font-semibold">Start Date:</span>{' '}
                  {new Date(activeSubscription.startDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Clock className="h-5 w-5 text-[#1a56db]" />
                <p>
                  <span className="font-semibold">End Date:</span>{' '}
                  {new Date(activeSubscription.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Info className="h-5 w-5 text-[#1a56db]" />
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <span className="capitalize font-medium text-green-600 dark:text-green-400">
                    {activeSubscription.status}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="h-5 w-5 text-[#1a56db]" />
                <p>
                  <span className="font-semibold">Price:</span> $
                  {activeSubscription.price.toFixed(2)} / {activeSubscription.duration}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button className="bg-[#1a56db] hover:bg-[#1e40af]">Renew Subscription</Button>
              <Button variant="outline">Change Plan</Button>
              <Button variant="destructive" className="sm:ml-auto">
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>
        )}

        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 mt-8">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentHistory.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-400 py-4">
                No payment history available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Plan
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {payment.plan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={payment.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1a56db] hover:text-[#1e40af]"
                          >
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" /> Invoice
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
