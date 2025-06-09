import Link from 'next/link'
import Image from 'next/image'
import { ModeToggle } from '@/components/mode-toggle'

interface AuthFormWrapperProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export default function AuthFormWrapper({ children, title, subtitle }: AuthFormWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Legit Soccer Tips. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
