'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'

interface Column {
  key: string
  title: string
  sortable?: boolean
  render?: (item: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  selectedRows: number[]
  onSelectRow: (id: number) => void
  onSelectAll: (items: any[]) => void
  sortColumn: string
  sortDirection: string
  onSort: (column: string) => void
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (count: number) => void
}

export function DataTable({
  columns,
  data,
  selectedRows,
  onSelectRow,
  onSelectAll,
  sortColumn,
  sortDirection,
  onSort,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: DataTableProps) {
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedRows.length === data.length && data.length > 0}
                onCheckedChange={() => onSelectAll(data)}
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={column.sortable ? 'cursor-pointer' : ''}
                onClick={() => column.sortable && onSort(column.key)}
              >
                <div className="flex items-center">
                  {column.title}
                  {column.sortable && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${sortColumn === column.key ? 'opacity-100' : 'opacity-50'}`}
                    />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(item.id)}
                  onCheckedChange={() => onSelectRow(item.id)}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={`${item.id}-${column.key}`}>
                  {column.render ? column.render(item) : item[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
