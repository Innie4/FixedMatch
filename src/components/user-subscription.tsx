import { Check, Clock, CreditCard, Shield, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface UserSubscriptionProps {
  subscription: string
}

export default function UserSubscription({ subscription }: UserSubscriptionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[#1a56db]/5 border border-[#1a56db]/20 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#1a56db] p-2 rounded-full">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{subscription}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your subscription renews on Nov 5, 2023
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-[#1a56db] text-[#1a56db]">
              Manage Plan
            </Button>
            <Button className="bg-[#1a56db]">
              <Zap className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subscription period</span>
            <span className="text-gray-900 dark:text-white">23 days left</span>
          </div>
          <Progress value={25} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly</CardTitle>
            <CardDescription>7-day access</CardDescription>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">$9.99</span>
              <span className="text-gray-600 dark:text-gray-400"> / week</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>All VIP predictions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Detailed match analysis</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Email notifications</span>
              </li>
              <li className="flex items-start text-gray-500">
                <Check className="h-4 w-4 text-gray-300 dark:text-gray-600 mr-2 mt-0.5" />
                <span>Performance tracking</span>
              </li>
              <li className="flex items-start text-gray-500">
                <Check className="h-4 w-4 text-gray-300 dark:text-gray-600 mr-2 mt-0.5" />
                <span>24/7 customer support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {subscription === 'Weekly Pass' ? (
              <Button className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Button variant="outline" className="w-full">
                Downgrade
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="border-[#1a56db] shadow-md relative">
          <div className="absolute top-0 right-0 bg-[#1a56db] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            Popular
          </div>
          <CardHeader>
            <CardTitle>Monthly</CardTitle>
            <CardDescription>30-day access</CardDescription>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">$29.99</span>
              <span className="text-gray-600 dark:text-gray-400"> / month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>All VIP predictions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Detailed match analysis</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Email notifications</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Performance tracking</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>24/7 customer support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {subscription === 'VIP Monthly' ? (
              <Button className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Button className="w-full bg-[#1a56db]">
                {subscription === 'Weekly Pass' ? 'Upgrade' : 'Downgrade'}
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quarterly</CardTitle>
            <CardDescription>90-day access</CardDescription>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">$69.99</span>
              <span className="text-gray-600 dark:text-gray-400"> / quarter</span>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded-full inline-block ml-2">
                Save 22%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>All VIP predictions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Detailed match analysis</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Email notifications</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Performance tracking</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>24/7 customer support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Personalized strategy calls</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {subscription === 'Quarterly Pro' ? (
              <Button className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Button className="w-full">Upgrade</Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Payment Information
        </h3>

        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
              <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expires 05/2026</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Change
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Secure Payment Processing</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your payment information is encrypted and secure.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Billing History</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and download previous invoices.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Your subscription will automatically renew. You can cancel anytime from your account
            settings.
          </p>
          <div className="flex gap-3">
            <Button variant="outline">Cancel Subscription</Button>
            <Button variant="outline">Billing History</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
