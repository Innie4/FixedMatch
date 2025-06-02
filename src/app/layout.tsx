"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { MobileNav } from "@/components/main-nav"
import { enableOfflineSupport, initNetworkListeners } from "@/lib/firebase-error-handler"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  // Initialize Firebase offline support and network listeners
  useEffect(() => {
    // Enable offline persistence
    enableOfflineSupport()
      .then(success => {
        if (success) {
          console.log('Offline support enabled')
        } else {
          console.warn('Failed to enable offline support')
        }
      })
    
    // Initialize network status listeners
    const cleanup = initNetworkListeners()
    
    return () => {
      // Clean up network listeners
      cleanup()
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col">
            {!isAdminPage && <SiteHeader />}
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            {!isAdminPage && <MobileNav />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
