'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Users,
  BarChart2,
  DollarSign,
  Settings,
  BellRing,
  Package,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()

  // In a real application, you'd check user roles/permissions here
  const isAdmin = session?.user?.email === 'admin@example.com' // Placeholder check

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">Loading admin dashboard...</p>
      </div>
    )
  }

  if (status === 'unauthenticated' || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h2>
          <p className="text-gray-700 dark:text-gray-300">
            You do not have permission to access the admin dashboard.
          </p>
          <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25,000+</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+10% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,000+</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue (Monthly)</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$150,000</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="w-full justify-start">
                <BarChart2 className="mr-2 h-4 w-4" /> Manage Predictions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" /> Manage VIP Packages
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" /> Manage Team Members
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="w-full justify-start">
                <BellRing className="mr-2 h-4 w-4" /> Send Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" /> General Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
