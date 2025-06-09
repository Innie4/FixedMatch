'use client'

import type React from 'react'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset status and message
    setStatus('loading')
    setMessage('')

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Thank you for subscribing to our newsletter!')
        setEmail('') // Clear email on success
      } else {
        setStatus('error')
        // Prioritize specific error messages from the backend
        setMessage(data.message || data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('An unexpected error occurred. Please try again later.')
      console.error('Newsletter signup API error:', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-[#1a56db] text-white inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
        <Mail className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Stay Updated with the Latest Predictions
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Get the latest predictions, match analysis, and exclusive offers delivered to your inbox
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1a56db] focus:border-transparent"
              disabled={status === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[#1a56db] hover:bg-[#1e40af] text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-70"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {status === 'success' && (
          <div className="mt-3 flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-3 flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">{message}</span>
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        By subscribing, you agree to our Privacy Policy and Terms of Service. We respect your
        privacy and will never share your information.
      </p>
    </div>
  )
}
