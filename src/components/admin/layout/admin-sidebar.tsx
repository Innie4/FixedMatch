"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, FileText, Globe, Settings, Star, UserCog, Users } from "lucide-react"
import { cn } from "@/lib/utils"

// Define the navigation items
const navItems = [
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

export function AdminSidebarContent() {
  const pathname = usePathname()
  
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
            pathname === item.href
              ? "bg-gray-100 dark:bg-gray-800 text-[#1a56db]"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export function AdminSidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-1 p-4 overflow-y-auto">
        <AdminSidebarContent />
      </div>
    </aside>
  )
}