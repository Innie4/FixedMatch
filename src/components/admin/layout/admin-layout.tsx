'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
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
  ChevronDown,
  LogOut,
  UserCog,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModeToggle } from '@/components/mode-toggle'
import { AdminSidebar } from '@/components/admin/sidebar'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'User Management',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Prediction Management',
      href: '/admin/predictions',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Review Management',
      href: '/admin/reviews',
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: 'VIP Content Management',
      href: '/admin/vip-content',
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: 'SEO Management',
      href: '/admin/seo',
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: 'System Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: 'Admin User Management',
      href: '/admin/admin-users',
      icon: <UserCog className="h-5 w-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px] md:hidden">
                <div className="flex flex-col gap-6 py-6">
                  <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
                    <span className="font-bold text-xl text-gray-900 dark:text-white">
                      Admin Dashboard
                    </span>
                  </Link>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                          pathname === item.href
                            ? 'bg-gray-100 dark:bg-gray-800 text-[#1a56db]'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden md:inline-block">
                Admin Panel
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center px-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input type="search" placeholder="Search..." className="w-full pl-8" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                3
              </span>
            </Button>

            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 pl-2 pr-1">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="Admin"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="hidden sm:inline-block">Admin</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar (desktop only) */}
        <AdminSidebar navItems={navItems} />

        {/* Main content area */}
        <div className="flex-1 md:ml-64 p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}

// Helper function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
