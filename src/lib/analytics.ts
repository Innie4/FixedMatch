import posthog from 'posthog-js'

// Initialize PostHog
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
  })
}

interface SubscriptionPackage {
  id: number;
  name: string;
  description: string;
  durations: {
    twoWeeks: { price: number; enabled: boolean };
    oneMonth: { price: number; enabled: boolean };
    threeMonths: { price: number; enabled: boolean };
    sixMonths: { price: number; enabled: boolean };
  };
  countries: string[];
  status: 'active' | 'inactive';
  subscribers: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

// Package Analytics
export const packageAnalytics = {
  // Track package views
  trackPackageView: (packageId: number, packageName: string) => {
    posthog.capture('package_viewed', {
      package_id: packageId,
      package_name: packageName,
    })
  },

  // Track package creation
  trackPackageCreated: (packageData: Partial<SubscriptionPackage>) => {
    posthog.capture('package_created', {
      package_name: packageData.name,
      package_countries: packageData.countries,
      package_status: packageData.status,
    })
  },

  // Track package updates
  trackPackageUpdated: (packageId: number, changes: Partial<SubscriptionPackage>) => {
    posthog.capture('package_updated', {
      package_id: packageId,
      changes: Object.keys(changes),
    })
  },

  // Track package deletion
  trackPackageDeleted: (packageId: number, packageName: string) => {
    posthog.capture('package_deleted', {
      package_id: packageId,
      package_name: packageName,
    })
  },

  // Track subscription purchases
  trackSubscriptionPurchase: (packageId: number, duration: string, amount: number) => {
    posthog.capture('subscription_purchased', {
      package_id: packageId,
      duration,
      amount,
    })
  },

  // Track subscription cancellations
  trackSubscriptionCancelled: (packageId: number, reason?: string) => {
    posthog.capture('subscription_cancelled', {
      package_id: packageId,
      reason,
    })
  },
}

// User Analytics
export const userAnalytics = {
  // Track user registration
  trackUserRegistered: (userId: number, source: string) => {
    posthog.capture('user_registered', {
      user_id: userId,
      source,
    })
  },

  // Track user login
  trackUserLogin: (userId: number, method: string) => {
    posthog.capture('user_login', {
      user_id: userId,
      method,
    })
  },

  // Track user logout
  trackUserLogout: (userId: number) => {
    posthog.capture('user_logout', {
      user_id: userId,
    })
  },
}

// Performance Analytics
export const performanceAnalytics = {
  // Track page load time
  trackPageLoad: (pageName: string, loadTime: number) => {
    posthog.capture('page_load', {
      page: pageName,
      load_time: loadTime,
    })
  },

  // Track API response time
  trackApiResponse: (endpoint: string, responseTime: number, status: number) => {
    posthog.capture('api_response', {
      endpoint,
      response_time: responseTime,
      status,
    })
  },

  // Track error rates
  trackError: (errorType: string, errorMessage: string, context?: any) => {
    posthog.capture('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      context,
    })
  },
}

// Export PostHog instance for direct use if needed
export { posthog } 