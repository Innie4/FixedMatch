import { Search, Filter, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SearchFilterBarProps {
  searchPlaceholder: string
  searchTerm: string
  onSearchChange: (value: string) => void
  filterOptions: {
    status: Array<{
      value: string
      label: string
    }>
    date: Array<{
      value: string
      label: string
    }>
  }
  onFilterChange: (type: 'status' | 'date', value: string) => void
  actionButton?: React.ReactNode
}

export function SearchFilterBar({
  searchPlaceholder,
  searchTerm,
  onSearchChange,
  filterOptions,
  onFilterChange,
  actionButton,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
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
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions.status.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onFilterChange('status', option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions.date.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onFilterChange('date', option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {actionButton && <div className="flex items-center gap-2">{actionButton}</div>}
    </div>
  )
}
