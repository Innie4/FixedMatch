'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Star, Clock, MoreHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SearchFilterBar } from '@/components/admin/search-filter-bar'
import { DataTable } from '@/components/admin/data-table'
import { BulkActionMenu } from '@/components/admin/bulk-action-menu'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface WinningTicket {
  id: number
  title: string
  image: string
  odds: string
  winnings: string
  stake: string
  date: string
  status: string
  featured: boolean
  matches: Array<{
    teams: string
    prediction: string
    result: string
  }>
  uploadedBy: string
  uploadedAt: string
}

interface WinningTicketsTabProps {
  tickets: WinningTicket[]
  onUploadTicket: () => void
  onDeleteTicket: (id: number) => void
  onBulkAction: (action: string, type: string) => void
}

export function WinningTicketsTab({
  tickets,
  onUploadTicket,
  onDeleteTicket,
  onBulkAction,
}: WinningTicketsTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDateRange, setFilterDateRange] = useState('all')
  const [sortColumn, setSortColumn] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null)

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortColumn === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortColumn === 'odds') {
      return sortDirection === 'asc'
        ? parseFloat(a.odds) - parseFloat(b.odds)
        : parseFloat(b.odds) - parseFloat(a.odds)
    } else if (sortColumn === 'winnings') {
      return sortDirection === 'asc'
        ? parseFloat(a.winnings.replace('$', '')) - parseFloat(b.winnings.replace('$', ''))
        : parseFloat(b.winnings.replace('$', '')) - parseFloat(a.winnings.replace('$', ''))
    }
    return 0
  })

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Handle row selection
  const handleRowSelect = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  // Handle select all
  const handleSelectAll = (items: Array<{ id: number }>) => {
    if (selectedRows.length === items.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(items.map((item) => item.id))
    }
  }

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setDeleteItemId(id)
    setIsDeleteConfirmOpen(true)
  }

  const columns = [
    {
      key: 'title',
      title: 'Ticket',
      render: (ticket: WinningTicket) => (
        <div className="flex items-center gap-3">
          <Image
            src={ticket.image}
            alt={ticket.title}
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
          <div>
            <div className="font-medium">{ticket.title}</div>
            <div className="text-sm text-gray-500">{ticket.date}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'odds',
      title: 'Odds',
      sortable: true,
      render: (ticket: WinningTicket) => ticket.odds,
    },
    {
      key: 'winnings',
      title: 'Winnings',
      sortable: true,
      render: (ticket: WinningTicket) => ticket.winnings,
    },
    {
      key: 'status',
      title: 'Status',
      render: (ticket: WinningTicket) => (
        <Badge variant={ticket.status === 'active' ? 'default' : 'secondary'}>
          {ticket.status === 'active' ? 'Active' : 'Archived'}
        </Badge>
      ),
    },
    {
      key: 'featured',
      title: 'Featured',
      render: (ticket: WinningTicket) => (
        <Badge
          variant={ticket.featured ? 'default' : 'outline'}
          className={ticket.featured ? 'bg-amber-500' : ''}
        >
          {ticket.featured ? 'Featured' : 'Not Featured'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (ticket: WinningTicket) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log('View ticket', ticket.id)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Edit ticket', ticket.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteConfirm(ticket.id)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const bulkActions = [
    {
      label: 'Feature',
      action: () => onBulkAction('feature', 'tickets'),
      icon: <Star className="h-4 w-4" />,
    },
    {
      label: 'Archive',
      action: () => onBulkAction('archive', 'tickets'),
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: 'Delete',
      action: () => onBulkAction('delete', 'tickets'),
      icon: <Trash2 className="h-4 w-4" />,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterStatus={setFilterStatus}
          onFilterDateRange={setFilterDateRange}
          placeholder="Search winning tickets..."
        />

        <div className="flex items-center gap-2">
          <Button onClick={onUploadTicket}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Upload Ticket
          </Button>

          {selectedRows.length > 0 && <BulkActionMenu actions={bulkActions} />}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={sortedTickets}
        selectedRows={selectedRows}
        onSelectRow={handleRowSelect}
        onSelectAll={handleSelectAll}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Ticket"
        description="Are you sure you want to delete this ticket? This action cannot be undone."
        onConfirm={() => {
          if (deleteItemId) {
            onDeleteTicket(deleteItemId)
            setIsDeleteConfirmOpen(false)
          }
        }}
        confirmLabel="Delete"
      />
    </div>
  )
}
