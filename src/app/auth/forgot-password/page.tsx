"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AuthFormWrapper from "@/components/auth/auth-form-wrapper"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      // Validate email
      if (!email) {
        throw new Error("Please enter your email address")
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, let's simulate a successful password reset request
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthFormWrapper title="Reset your password" subtitle="Enter your email to receive a password reset link">
      {success ? (
        <div className="text-center">
          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 p-4 rounded-lg mb-6">
            <p>Password reset link sent!</p>
            <p className="text-sm mt-2">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
              instructions to reset your password.
            </p>
          </div>
          <Button asChild className="bg-[#1a56db] hover:bg-[#1e40af]">
            <Link href="/auth/login">Return to login</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Email address"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#1a56db] hover:bg-[#1e40af]" disabled={isLoading}>
            {isLoading ? "Sending reset link..." : "Send reset link"}
          </Button>

          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-[#1a56db] hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      )}
    </AuthFormWrapper>
  )
}
