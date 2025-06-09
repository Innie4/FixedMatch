import { type ToastAction } from '@/components/ui/toast'
import { type ToastProps } from '@/components/ui/toast'
import { signOut } from 'next-auth/react'

interface CustomToast {
  (props: ToastProps): {
    id: string
    dismiss: () => void
    update: (props: ToastProps) => void
  }
}

// This function should ideally be called within a React component or a custom hook
// that has access to the `useToast` hook. For global fetch, we'll need to pass `toast`.
export async function fetcher<T = any>(
  url: string,
  options?: RequestInit,
  toast?: CustomToast // Accept toast as an argument
): Promise<T> {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json()
      let errorMessage = errorData.message || errorData.error || 'An API error occurred.'

      if (response.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.'
        // Optionally, redirect to login or sign out
        // signOut({ callbackUrl: "/auth/login" });
      } else if (response.status === 403) {
        errorMessage = "Access denied. You don't have permission."
      } else if (response.status === 404) {
        errorMessage = errorData.message || 'Resource not found.'
      } else if (response.status === 429) {
        errorMessage = 'Too many requests. Please try again later.'
      } else if (response.status >= 500) {
        errorMessage = 'Internal server error. Please try again later.'
      }

      if (toast) {
        toast({
          title: 'API Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }

      throw new Error(errorMessage)
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T // Return an empty object for no content
    }

    return response.json()
  } catch (error: any) {
    // If the error was already toasted, avoid re-toasting it unless it's a network error
    if (toast && (!options?.headers || !('X-Skip-Toast' in options.headers))) {
      toast({
        title: 'Network Error',
        description:
          error.message ||
          'Could not connect to the server. Please check your internet connection.',
        variant: 'destructive',
      })
    }
    throw error
  }
}
