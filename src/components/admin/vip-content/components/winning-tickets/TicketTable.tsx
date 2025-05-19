import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WinningTicket } from "../../types";
import { ArrowUpDown } from "lucide-react";

interface TicketTableProps {
  tickets: WinningTicket[];
  selectedRows: number[];
  onSelectRow: (id: number) => void;
  onSelectAll: () => void;
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: string;
  onViewDetails: (ticket: WinningTicket) => void;
  onDelete: (id: number) => void;
}

export function TicketTable({
  tickets,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onSort,
  sortColumn,
  sortDirection,
  onViewDetails,
  onDelete
}: TicketTableProps) {
  const renderSortIcon = (column: string) => {
    return (
      <ArrowUpDown 
        className={`ml-2 h-4 w-4 ${sortColumn === column ? 'opacity-100' : 'opacity-50'}`} 
      />
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedRows.length === tickets.length && tickets.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Ticket</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("odds")}
            >
              <div className="flex items-center">
                Odds
                {renderSortIcon("odds")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("winnings")}
            >
              <div className="flex items-center">
                Winnings
                {renderSortIcon("winnings")}
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No tickets found
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(ticket.id)}
                    onCheckedChange={() => onSelectRow(ticket.id)}
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
                      <DropdownMenuItem onClick={() => onViewDetails(ticket)}>
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log("Edit ticket", ticket.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(ticket.id)} className="text-red-600">
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
  );
}