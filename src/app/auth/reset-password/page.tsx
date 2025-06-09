'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Image } from 'next/image'
import { useSearchParams } from 'next/navigation'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [loadingToken, setLoadingToken] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('No reset token provided.')
        setLoadingToken(false)
        return
      }
      try {
        // In a real app, you might have an API endpoint to validate the token upfront
        // For now, we'll assume the token is valid for the UI, and actual validation happens on reset API call.
        setIsValidToken(true)
      } catch (err) {
        setError('Invalid or expired reset token.')
        setIsValidToken(false)
      } finally {
        setLoadingToken(false)
      }
    }
    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setIsLoading(false)
      return
    }

    if (!token) {
      setError('No reset token found.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || 'Your password has been reset successfully!')
      } else {
        setError(data.error || 'Failed to reset password. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">Verifying token...</p>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Invalid or Expired Link
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
            <Link href="/auth/forgot-password">Request a new password reset link</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <Link href="/">
            <Image
              src="/FIXEDMatchD.png"
              alt="Legit Soccer Tips Logo"
              width={512}
              height={512}
              className="mx-auto mb-3"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Enter your new password below.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#1a56db] focus:outline-none focus:ring-[#1a56db] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#1a56db] focus:outline-none focus:ring-[#1a56db] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <Button
              type="submit"
              className="relative flex w-full justify-center rounded-md border border-transparent bg-[#1a56db] py-2 px-4 text-sm font-medium text-white hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
          {message && (
            <p className="mt-2 text-center text-sm text-green-600 dark:text-green-400">{message}</p>
          )}
          {error && (
            <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </form>
      </div>
    </div>
  )
}
