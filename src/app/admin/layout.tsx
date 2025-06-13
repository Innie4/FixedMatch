import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminMobileNav from '@/components/admin/AdminMobileNav'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminNavItems } from '@/config/admin-nav'

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
