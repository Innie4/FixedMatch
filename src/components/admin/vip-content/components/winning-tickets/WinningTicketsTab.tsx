import { useState } from 'react'
import { ImagePlus, ChevronDown, Star, Clock, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SearchFilterBar } from '../SearchFilterBar'
import { TicketTable } from './TicketTable'
import { TicketDetailsSheet } from './TicketDetailsSheet'
import { UploadTicketForm } from './UploadTicketForm'
import { WinningTicket } from '../../types'

interface WinningTicketsTabProps {
  tickets: WinningTicket[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  filterStatus: string
  setFilterStatus: (value: string) => void
  filterDateRange: string
  setFilterDateRange: (value: string) => void
  sortColumn: string
  setSortColumn: (value: string) => void
  sortDirection: string
  setSortDirection: (value: string) => void
  selectedRows: number[]
  setSelectedRows: (value: number[]) => void
  onDeleteConfirm: (type: string, id: number) => void
}

export function WinningTicketsTab({
  tickets,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterDateRange,
  setFilterDateRange,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
  selectedRows,
  setSelectedRows,
  onDeleteConfirm,
}: WinningTicketsTabProps) {
  const [isUploadTicketOpen, setIsUploadTicketOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<WinningTicket | null>(null)

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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleRowSelect = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedRows.length === filteredTickets.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredTickets.map((item) => item.id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on tickets:`, selectedRows)
    setSelectedRows([])
  }

  const handleViewDetails = (ticket: WinningTicket) => {
    setSelectedTicket(ticket)
  }

  const handleCloseDetails = () => {
    setSelectedTicket(null)
  }

  const filterOptions = {
    status: [
      { value: 'all', label: 'All Tickets' },
      { value: 'active', label: 'Active' },
      { value: 'archived', label: 'Archived' },
    ],
    date: [
      { value: 'all', label: 'All Time' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' },
    ],
  }

  const handleFilterChange = (type: 'status' | 'date', value: string) => {
    if (type === 'status') {
      setFilterStatus(value)
    } else {
      setFilterDateRange(value)
    }
  }

  const uploadButton = (
    <Button onClick={() => setIsUploadTicketOpen(true)}>
      <ImagePlus className="mr-2 h-4 w-4" />
      Upload Ticket
    </Button>
  )

  const bulkActionButton = selectedRows.length > 0 && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Actions
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleBulkAction('feature')}>
          <Star className="mr-2 h-4 w-4" />
          Feature
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
          <Clock className="mr-2 h-4 w-4" />
          Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="space-y-4">
      <SearchFilterBar
        searchPlaceholder="Search winning tickets..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        actionButton={
          <div className="flex items-center gap-2">
            {uploadButton}
            {bulkActionButton}
          </div>
        }
      />

      <TicketTable
        tickets={sortedTickets}
        selectedRows={selectedRows}
        onSelectRow={handleRowSelect}
        onSelectAll={handleSelectAll}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onViewDetails={handleViewDetails}
        onDelete={(id) => onDeleteConfirm('ticket', id)}
      />

      {selectedTicket && (
        <TicketDetailsSheet
          ticket={selectedTicket}
          isOpen={!!selectedTicket}
          onClose={handleCloseDetails}
        />
      )}

      <UploadTicketForm isOpen={isUploadTicketOpen} onClose={() => setIsUploadTicketOpen(false)} />
    </div>
  )
}
