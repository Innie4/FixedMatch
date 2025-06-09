'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AccountPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">Loading account details...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
          <p className="text-gray-700 dark:text-gray-300">Please log in to view your account.</p>
          <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
            <Link href="/auth/login">Log In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">My Account</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-lg text-gray-900 dark:text-white">
                {session?.user?.name || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-lg text-gray-900 dark:text-white">{session?.user?.email}</p>
            </div>
            {/* Add more user details here as needed (e.g., country, subscription status) */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Verified</p>
              <p
                className={`text-lg ${session?.user?.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}
              >
                {session?.user?.isEmailVerified ? 'Yes' : 'No'}
              </p>
            </div>
            {session?.user?.subscriptionStatus && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Subscription Status
                </p>
                <p className="text-lg text-gray-900 dark:text-white capitalize">
                  {session.user.subscriptionStatus}
                </p>
              </div>
            )}
            {session?.user?.subscriptionExpiry && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Subscription Expiry
                </p>
                <p className="text-lg text-gray-900 dark:text-white">
                  {new Date(session.user.subscriptionExpiry).toLocaleDateString()}
                </p>
              </div>
            )}
            <Button className="bg-[#1a56db] hover:bg-[#1e40af]">Edit Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Change Password
            </Button>
            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              variant="destructive"
              className="w-full"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
