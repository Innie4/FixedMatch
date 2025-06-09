import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

interface AdminSidebarProps {
  navItems: NavItem[]
}

export function AdminSidebar({ navItems }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-1 p-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
              pathname === item.href
                ? 'bg-gray-100 dark:bg-gray-700 text-[#1a56db]'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </div>
    </aside>
  )
}
