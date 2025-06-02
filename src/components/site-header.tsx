import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"

import { useState } from "react"

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Simulate authentication state

  // Placeholder functions for authentication actions
  const handleLogin = () => { console.log("Login clicked") }
  const handleSignup = () => { console.log("Sign Up clicked") }
  const handleAccount = () => { console.log("My Account clicked") }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="flex items-center gap-2">
                  <Image src="/FIXEDMatchD.png" alt="Legit Soccer Tips Logo" width={32} height={32} />
                  <span className="font-bold text-xl text-gray-900 dark:text-white">Legit Soccer Tips</span>
                </Link>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2"
                  >
                    Home
                  </Link>
                  <Link
                    href="/predictions"
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2"
                  >
                    Predictions
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2"
                  >
                    Contact
                  </Link>
                  {isLoggedIn ? (
                    <Link
                      href="/account"
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2"
                    >
                      My Account
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/auth/login"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2"
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
                {/* Removed login and signup buttons from mobile menu */}
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/FIXEDMatchD.png" 
              alt="Legit Soccer Tips Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden md:inline-block">Legit Soccer Tips</span>
          </Link>
        </div>
        <div className="hidden md:flex">
          <MainNav isLoggedIn={isLoggedIn} />
        </div>
        <div className="flex items-center gap-2">
          {/* Authentication Buttons */}
          {/* Removed conditional buttons here */}
          {/* Removed AuthButtons component */}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}