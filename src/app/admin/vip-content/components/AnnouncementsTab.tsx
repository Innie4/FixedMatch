import { useState } from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  ArrowUpDown,
  Megaphone,
  Calendar,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
interface Announcement {
  id: number
  title: string
  content: string
  publishDate: string
  expiryDate: string
  targetAudience: string
  views: number
  clicks: number
  status: 'published' | 'scheduled' | 'expired' | 'draft'
}

interface AnnouncementsTabProps {
  announcements: Announcement[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  filterStatus: string
  setFilterStatus: (value: string) => void
  sortColumn: string
  setSortColumn: (value: string) => void
  sortDirection: string
  setSortDirection: (value: string) => void
  selectedRows: number[]
  setSelectedRows: (value: number[]) => void
  onDeleteConfirm: (type: string, id: number) => void
  onEdit: (item: any) => void
  onCreateAnnouncement: () => void
}

export function AnnouncementsTab({
  announcements,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
  selectedRows,
  setSelectedRows,
  onDeleteConfirm,
  onEdit,
  onCreateAnnouncement,
}: AnnouncementsTabProps) {
  // Filter announcements
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Sort announcements
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (sortColumn === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
        : new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    } else if (sortColumn === 'views') {
      return sortDirection === 'asc' ? a.views - b.views : b.views - a.views
    } else if (sortColumn === 'clicks') {
      return sortDirection === 'asc' ? a.clicks - b.clicks : b.clicks - a.clicks
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
  const handleSelectAll = () => {
    if (selectedRows.length === filteredAnnouncements.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredAnnouncements.map((item) => item.id))
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on announcements:`, selectedRows)
    setSelectedRows([])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search announcements..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                All Announcements
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('published')}>
                Published
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('scheduled')}>
                Scheduled
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('expired')}>
                Expired
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('draft')}>Draft</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={onCreateAnnouncement}>
          <Megaphone className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
          <span className="text-sm font-medium">{selectedRows.length} selected</span>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('publish')}>
            Publish
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('archive')}>
            Archive
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
            Delete
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedRows([])}>
            Cancel
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    selectedRows.length === filteredAnnouncements.length &&
                    filteredAnnouncements.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <span>Publish Date</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() => handleSort('views')}
                >
                  <span>Views</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() => handleSort('clicks')}
                >
                  <span>Clicks</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAnnouncements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(announcement.id)}
                    onCheckedChange={() => handleRowSelect(announcement.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{announcement.title}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {announcement.content}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {announcement.publishDate}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {announcement.expiryDate}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{announcement.targetAudience}</Badge>
                </TableCell>
                <TableCell>{announcement.views}</TableCell>
                <TableCell>{announcement.clicks}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      announcement.status === 'published'
                        ? 'default'
                        : announcement.status === 'scheduled'
                          ? 'secondary'
                          : announcement.status === 'expired'
                            ? 'destructive'
                            : 'outline'
                    }
                  >
                    {announcement.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(announcement)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDeleteConfirm('announcement', announcement.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {sortedAnnouncements.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No announcements found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
