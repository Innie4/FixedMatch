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

interface ReviewFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onFilterRatingChange: (value: string) => void
  onFilterDateRangeChange: (value: string) => void
}

export function ReviewFilter({
  searchTerm,
  onSearchChange,
  onFilterRatingChange,
  onFilterDateRangeChange,
}: ReviewFilterProps) {
  return (
    <div className="flex flex-1 items-center space-x-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search reviews..."
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
          <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onFilterRatingChange('all')}>
            All Ratings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterRatingChange('5')}>5 Stars</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterRatingChange('4')}>4 Stars</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterRatingChange('3')}>3 Stars</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterRatingChange('2')}>2 Stars</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterRatingChange('1')}>1 Star</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onFilterDateRangeChange('all')}>
            All Time
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterDateRangeChange('today')}>
            Today
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterDateRangeChange('week')}>
            This Week
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterDateRangeChange('month')}>
            This Month
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
