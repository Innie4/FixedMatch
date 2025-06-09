'use client'

import { Search, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SearchFilterBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onFilterStatus: (status: string) => void
  onFilterDateRange: (range: string) => void
  placeholder?: string
  filterOptions?: {
    status?: boolean
    date?: boolean
  }
}

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  onFilterStatus,
  onFilterDateRange,
  placeholder = 'Search...',
  filterOptions = { status: true, date: true },
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-1 items-center space-x-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {filterOptions.status && (
            <>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onFilterStatus('all')}>All Items</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterStatus('active')}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterStatus('archived')}>
                Archived
              </DropdownMenuItem>
            </>
          )}

          {filterOptions.date && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onFilterDateRange('all')}>All Time</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterDateRange('week')}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterDateRange('month')}>
                This Month
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
