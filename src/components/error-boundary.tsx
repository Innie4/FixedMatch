'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo)
    // TODO: Integrate with a logging service like Sentry, LogRocket, etc.
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      // You can render any custom fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 text-center">
          <div>
            <h2 className="text-2xl font-bold mb-3">Something went wrong.</h2>
            <p className="mb-2">We apologize for the inconvenience.</p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="whitespace-pre-wrap text-left bg-red-50 dark:bg-red-800/50 p-3 rounded-md mt-4">
                <summary>Error Details</summary>
                <p>{this.state.error.toString()}</p>
                {/* <p>{this.state.error.stack}</p> // Be careful with exposing stack traces in production */}
              </details>
            )}
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
