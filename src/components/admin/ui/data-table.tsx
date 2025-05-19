"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<T> {
  data: T[]
  columns: {
    key: string
    title: string
    render?: (item: T) => React.ReactNode
  }[]
  searchPlaceholder?: string
  onSearch?: (term: string) => void
  filters?: {
    key: string
    title: string
    options: { value: string; label: string }[]
    onFilter: (value: string) => void
  }[]
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  rowActions?: (item: T) => React.ReactNode
  bulkActions?: React.ReactNode
  selectedRows?: T[]
  onRowSelect?: (item: T) => void
  onSelectAll?: () => void
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  onSearch,
  filters,
  pagination,
  rowActions,
  bulkActions,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    if (onSearch) {
      onSearch(term)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {filters && filters.length > 0 && (
            <div className="flex items-center gap-2">
              {filters.map((filter) => (
                <div key={filter.key} className="flex items-center gap-2">
                  <Select onValueChange={filter.onFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={filter.title} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {bulkActions && selectedRows.length > 0 && (
          <div className="flex items-center gap-2">
            {bulkActions}
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {onRowSelect && (
                <TableHead className="w-[40px]">
                  <input
                    type="checkbox"
                    onChange={onSelectAll}
                    checked={selectedRows.length > 0 && selectedRows.length === data.length}
                    className="h-4 w-4"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key}>{column.title}</TableHead>
              ))}
              {rowActions && <TableHead className="w-[100px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onRowSelect ? 1 : 0) + (rowActions ? 1 : 0)} className="text-center py-8">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  {onRowSelect && (
                    <TableCell>
                      <input
                        type="checkbox"
                        onChange={() => onRowSelect(item)}
                        checked={selectedRows.some((row: any) => row.id === item.id)}
                        className="h-4 w-4"
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={`${item.id}-${column.key}`}>
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell>{rowActions(item)}</TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}