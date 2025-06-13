'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Users,
  FileText,
  Star,
  Settings,
  Globe,
  UserCog,
} from 'lucide-react'
import { Package } from 'lucide-react'
import { CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdminHeader } from '@/components/admin/layout/admin-header'
import { adminNavItems } from '@/config/admin-nav'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminMobileNav from '@/components/admin/AdminMobileNav'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Define the NavItem type
interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar navItems={adminNavItems} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <AdminMobileNav navItems={adminNavItems} />
        {children}
      </div>
    </div>
  )
}
