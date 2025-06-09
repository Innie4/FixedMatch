import { enableIndexedDbPersistence, disableNetwork, enableNetwork } from 'firebase/firestore'
import { db } from './firebase'

// Error types
export const ErrorTypes = {
  NETWORK: 'network',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  ALREADY_EXISTS: 'already_exists',
  INVALID_ARGUMENT: 'invalid_argument',
  INTERNAL: 'internal',
  UNKNOWN: 'unknown',
}

// Parse Firebase error
export function parseFirebaseError(error) {
  const errorCode = error.code || ''
  const errorMessage = error.message || 'An unknown error occurred'

  // Determine error type
  let type = ErrorTypes.UNKNOWN

  if (errorCode.includes('network') || errorMessage.includes('network')) {
    type = ErrorTypes.NETWORK
  } else if (errorCode.includes('permission-denied') || errorMessage.includes('permission')) {
    type = ErrorTypes.PERMISSION
  } else if (errorCode.includes('not-found') || errorMessage.includes('not found')) {
    type = ErrorTypes.NOT_FOUND
  } else if (errorCode.includes('already-exists') || errorMessage.includes('already exists')) {
    type = ErrorTypes.ALREADY_EXISTS
  } else if (errorCode.includes('invalid-argument') || errorMessage.includes('invalid')) {
    type = ErrorTypes.INVALID_ARGUMENT
  } else if (errorCode.includes('internal') || errorMessage.includes('internal')) {
    type = ErrorTypes.INTERNAL
  }

  return {
    type,
    code: errorCode,
    message: errorMessage,
    original: error,
  }
}

// User-friendly error messages
export function getUserFriendlyErrorMessage(error) {
  const parsedError =
    typeof error === 'object' && error !== null
      ? parseFirebaseError(error)
      : { type: ErrorTypes.UNKNOWN }

  switch (parsedError.type) {
    case ErrorTypes.NETWORK:
      return 'Network connection issue. Please check your internet connection and try again.'
    case ErrorTypes.PERMISSION:
      return 'You do not have permission to perform this action.'
    case ErrorTypes.NOT_FOUND:
      return 'The requested resource was not found.'
    case ErrorTypes.ALREADY_EXISTS:
      return 'This resource already exists.'
    case ErrorTypes.INVALID_ARGUMENT:
      return 'Invalid data provided. Please check your input and try again.'
    case ErrorTypes.INTERNAL:
      return 'An internal error occurred. Our team has been notified.'
    default:
      return 'An unexpected error occurred. Please try again later.'
  }
}

// Enable offline persistence
export async function enableOfflineSupport() {
  try {
    await enableIndexedDbPersistence(db)
    console.log('Offline persistence enabled')
    return true
  } catch (error) {
    console.error('Error enabling offline persistence:', error)
    return false
  }
}

// Network status management
let isOnline = navigator.onLine

// Update network status
function updateNetworkStatus() {
  const wasOnline = isOnline
  isOnline = navigator.onLine

  // If network status changed
  if (wasOnline !== isOnline) {
    if (isOnline) {
      // Reconnect to Firestore
      enableNetwork(db)
        .then(() => {
          console.log('Reconnected to Firestore')
        })
        .catch((error) => {
          console.error('Error reconnecting to Firestore:', error)
        })
    } else {
      // Disconnect from Firestore to save bandwidth
      disableNetwork(db)
        .then(() => {
          console.log('Disconnected from Firestore')
        })
        .catch((error) => {
          console.error('Error disconnecting from Firestore:', error)
        })
    }
  }
}

// Initialize network status listeners
export function initNetworkListeners() {
  window.addEventListener('online', updateNetworkStatus)
  window.addEventListener('offline', updateNetworkStatus)

  // Initial check
  updateNetworkStatus()

  return () => {
    window.removeEventListener('online', updateNetworkStatus)
    window.removeEventListener('offline', updateNetworkStatus)
  }
}

// Check if we're online
export function isNetworkOnline() {
  return isOnline
}

// Retry a function with exponential backoff
export async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let retries = 0

  while (retries < maxRetries) {
    try {
      return await fn()
    } catch (error) {
      const parsedError = parseFirebaseError(error)

      // Don't retry permission errors
      if (parsedError.type === ErrorTypes.PERMISSION) {
        throw error
      }

      retries++

      if (retries >= maxRetries) {
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, retries - 1)

      // Wait before retrying
      await new Promise((resolve) => {
        setTimeout(resolve, delay)
      })
    }
  }
}
