'use client'

import type React from 'react'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import { MobileNav } from '@/components/main-nav'
import { enableOfflineSupport, initNetworkListeners } from '@/lib/firebase-error-handler'
import { initializeCache } from '@/lib/firestore-cache'
import { trackPageView } from '@/lib/firebase-analytics'
import { monitorFirestoreUsage } from '@/lib/firebase-monitoring'
import ErrorBoundary from '@/components/error-boundary'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  // Initialize Firebase services
  useEffect(() => {
    // Enable offline persistence
    enableOfflineSupport().then((success) => {
      if (success) {
        console.log('Offline support enabled')
      } else {
        console.warn('Failed to enable offline support')
      }
    })

    // Initialize network status listeners
    const networkCleanup = initNetworkListeners()

    // Initialize cache and prefetch frequently accessed data
    const cacheCleanup = initializeCache()

    // Set up periodic monitoring (once per hour)
    const monitoringInterval = setInterval(
      () => {
        monitorFirestoreUsage().catch((err) => console.error('Monitoring error:', err))
      },
      60 * 60 * 1000
    ) // 1 hour

    return () => {
      // Clean up all listeners and intervals
      networkCleanup()
      cacheCleanup()
      clearInterval(monitoringInterval)
    }
  }, [])

  // Track page views
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname).catch((err) => console.error('Error tracking page view:', err))
    }
  }, [pathname])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <div className="relative min-h-screen flex flex-col">
              {!isAdminPage && <SiteHeader />}
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              {!isAdminPage && <MobileNav />}
            </div>
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
