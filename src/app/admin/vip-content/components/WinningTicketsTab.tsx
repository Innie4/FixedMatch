import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Star, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Edit,
  Upload,
  Download,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  ArrowUpDown,
  ImagePlus
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { WinningTicket } from "../types"

interface WinningTicketsTabProps {
  tickets: WinningTicket[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterDateRange: string;
  setFilterDateRange: (value: string) => void;
  sortColumn: string;
  setSortColumn: (value: string) => void;
  sortDirection: string;
  setSortDirection: (value: string) => void;
  selectedRows: number[];
  setSelectedRows: (value: number[]) => void;
  onDeleteConfirm: (type: string, id: number) => void;
  onEdit: (item: any) => void;
  onFeatureToggle: (id: number, type: string) => void;
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
  onEdit,
  onFeatureToggle
}: WinningTicketsTabProps) {
  const [isUploadTicketOpen, setIsUploadTicketOpen] = useState(false)
  
  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" || 
      ticket.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc" 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortColumn === "odds") {
      return sortDirection === "asc" 
        ? parseFloat(a.odds) - parseFloat(b.odds)
        : parseFloat(b.odds) - parseFloat(a.odds);
    } else if (sortColumn === "winnings") {
      return sortDirection === "asc" 
        ? parseFloat(a.winnings.replace('$', '')) - parseFloat(b.winnings.replace('$', ''))
        : parseFloat(b.winnings.replace('$', '')) - parseFloat(a.winnings.replace('$', ''));
    }
    return 0;
  });
  
  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  // Handle row selection
  const handleRowSelect = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === filteredTickets.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredTickets.map(item => item.id));
    }
  };
  
  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on tickets:`, selectedRows);
    setSelectedRows([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search winning tickets..."
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
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Tickets
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("archived")}>
                Archived
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterDateRange("all")}>
                All Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterDateRange("week")}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterDateRange("month")}>
                This Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsUploadTicketOpen(true)}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Upload Ticket
          </Button>
          {selectedRows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction("feature")}>
                  <Star className="mr-2 h-4 w-4" />
                  Feature
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("archive")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedRows.length === filteredTickets.length && filteredTickets.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Ticket</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("odds")}
              >
                <div className="flex items-center">
                  Odds
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortColumn === "odds" ? 'opacity-100' : 'opacity-50'}`} />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("winnings")}
              >
                <div className="flex items-center">
                  Winnings
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortColumn === "winnings" ? 'opacity-100' : 'opacity-50'}`} />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              sortedTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(ticket.id)}
                      onCheckedChange={() => handleRowSelect(ticket.id)}
                    />
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{ticket.odds}</TableCell>
                  <TableCell>{ticket.winnings}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.status === "active" ? "default" : "secondary"}>
                      {ticket.status === "active" ? "Active" : "Archived"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ticket.featured ? "default" : "outline"} className={ticket.featured ? "bg-amber-500" : ""}>
                      {ticket.featured ? "Featured" : "Not Featured"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log("View details", ticket)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(ticket)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onFeatureToggle(ticket.id, "ticket")}>
                          {ticket.featured ? "Unfeature" : "Feature"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteConfirm("ticket", ticket.id)} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}