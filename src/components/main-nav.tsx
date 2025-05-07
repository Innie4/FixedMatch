"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Info, 
  BarChart2, 
  User, 
  Mail, 
  LogIn 
} from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  
  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="h-4 w-4 mr-2" />,
      active: pathname === "/"
    },
    {
      href: "/predictions",
      label: "Predictions",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
      active: pathname === "/predictions" || pathname.startsWith("/prediction/")
    },
    {
      href: "/about",
      label: "About",
      icon: <Info className="h-4 w-4 mr-2" />,
      active: pathname === "/about"
    },
    {
      href: "/contact",
      label: "Contact",
      icon: <Mail className="h-4 w-4 mr-2" />,
      active: pathname === "/contact"
    },
    {
      href: "/account",
      label: "My Account",
      icon: <User className="h-4 w-4 mr-2" />,
      active: pathname === "/account"
    }
  ]

  return (
    <nav className="flex items-center space-x-1">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
            route.active 
              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  
  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/"
    },
    {
      href: "/predictions",
      label: "Predictions",
      icon: <BarChart2 className="h-5 w-5" />,
      active: pathname === "/predictions" || pathname.startsWith("/prediction/")
    },
    {
      href: "/about",
      label: "About",
      icon: <Info className="h-5 w-5" />,
      active: pathname === "/about"
    },
    {
      href: "/contact",
      label: "Contact",
      icon: <Mail className="h-5 w-5" />,
      active: pathname === "/contact"
    },
    {
      href: "/account",
      label: "Account",
      icon: <User className="h-5 w-5" />,
      active: pathname === "/account"
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 md:hidden">
      <div className="flex justify-between items-center">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center text-xs font-medium p-2 rounded-md",
              route.active 
                ? "text-[#1a56db]" 
                : "text-gray-600 dark:text-gray-400 hover:text-[#1a56db]"
            )}
          >
            {route.icon}
            <span className="mt-1">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href="/auth/login" className="flex items-center">
          <LogIn className="h-4 w-4 mr-2" />
          Log in
        </Link>
      </Button>
      <Button asChild size="sm" className="bg-[#1a56db] hover:bg-[#1e40af]">
        <Link href="/auth/signup">Sign up</Link>
      </Button>
    </div>
  )
}