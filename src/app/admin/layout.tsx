"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  Users, 
  FileText, 
  Star, 
  Search,
  Settings, 
  Globe, 
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  UserCog,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { AdminHeader } from "@/components/admin/layout/admin-header"

// Define the NavItem type
interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Prediction Management",
      href: "/admin/predictions",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Review Management",
      href: "/admin/reviews",
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: "VIP Content Management",
      href: "/admin/vip-content",
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: "SEO Management",
      href: "/admin/seo",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: "System Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Admin User Management",
      href: "/admin/admin-users",
      icon: <UserCog className="h-5 w-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Header - Using the dedicated AdminHeader component */}
      <AdminHeader />
      
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar (desktop only) */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-1 p-4 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-gray-100 dark:bg-gray-700 text-[#1a56db]"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
        </aside>
        
        {/* Page Content */}
        <main className="flex-1 md:ml-64 pt-16">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}