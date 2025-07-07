'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(
          data.message || "If an account with that email exists, we've sent a password reset link."
        )
      } else {
        setError(data.error || 'Failed to send password reset email. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <Image
            src="/main-logo.jpg"
            alt="PredictSafe Logo"
            width={128}
            height={128}
            className="mx-auto mb-3 rounded-full shadow"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#1a56db] focus:outline-none focus:ring-[#1a56db] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Button
              type="submit"
              className="relative flex w-full justify-center rounded-md border border-transparent bg-[#1a56db] py-2 px-4 text-sm font-medium text-white hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </div>
          {message && (
            <p className="mt-2 text-center text-sm text-green-600 dark:text-green-400">{message}</p>
          )}
          {error && (
            <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </form>
        <div className="text-center text-sm">
          <Link href="/auth/login" className="font-medium text-[#1a56db] hover:text-[#1e40af]">
            Remember your password? Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
