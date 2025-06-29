'use client'

import type React from 'react'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import '@/styles/globals.css'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { SiteHeader } from '@/components/site-header'
import { MobileNav } from '@/components/main-nav'
import ErrorBoundary from '@/components/error-boundary'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Predicts',
  description: 'Your trusted source for soccer predictions',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <div className="relative min-h-screen flex flex-col">
                {!isAdminPage && <SiteHeader />}
                <main className="flex-1 pb-16 md:pb-0">{children}</main>
                {!isAdminPage && <MobileNav />}
              </div>
            </ErrorBoundary>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
