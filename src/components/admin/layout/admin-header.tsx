"use client"

import Link from "next/link"
import Image from "next/image"
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from "lucide-react"
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
import { AdminSidebarContent } from "@/components/admin/layout/admin-sidebar"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
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
                  <span className="font-bold text-xl text-gray-900 dark:text-white">Admin Dashboard</span>
                </Link>
                <AdminSidebarContent />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden md:inline-block">Admin Panel</span>
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
  )
}