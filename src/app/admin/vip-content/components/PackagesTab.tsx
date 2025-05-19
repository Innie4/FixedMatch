import { useState } from "react"
import { 
  Search, 
  Filter, 
  ChevronDown, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Eye, 
  ArrowUpDown, 
  Package, 
  Star, 
  DollarSign,
  Plus 
} from "lucide-react"
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
import { SubscriptionPackage } from "../types"

interface PackagesTabProps {
  packages: SubscriptionPackage[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
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

export function PackagesTab({
  packages,
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
  onFeatureToggle
}: PackagesTabProps) {
  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState(false)
  
  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" || 
      pkg.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (sortColumn === "price") {
      return sortDirection === "asc" 
        ? a.price - b.price
        : b.price - a.price;
    } else if (sortColumn === "subscribers") {
      return sortDirection === "asc" 
        ? a.subscribers - b.subscribers
        : b.subscribers - a.subscribers;
    } else if (sortColumn === "conversion") {
      return sortDirection === "asc" 
        ? a.conversionRate - b.conversionRate
        : b.conversionRate - a.conversionRate;
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
    if (selectedRows.length === filteredPackages.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredPackages.map(item => item.id));
    }
  };
  
  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on packages:`, selectedRows);
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
              placeholder="Search packages..."
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
                All Packages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("archived")}>
                Archived
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreatePackageOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Package
          </Button>
          {selectedRows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Bulk Actions ({selectedRows.length})
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
                  Activate Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("deactivate")}>
                  Deactivate Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("archive")}>
                  Archive Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleBulkAction("delete")}
                  className="text-destructive focus:text-destructive"
                >
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Packages Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox 
                  checked={selectedRows.length === filteredPackages.length && filteredPackages.length > 0} 
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all packages"
                />
              </TableHead>
              <TableHead className="w-[250px]">
                <div className="flex items-center space-x-1">
                  <span>Package</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleSort("name")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="sr-only">Sort by name</span>
                  </Button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleSort("price")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="sr-only">Sort by price</span>
                  </Button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Subscribers</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleSort("subscribers")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="sr-only">Sort by subscribers</span>
                  </Button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Conversion Rate</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleSort("conversion")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="sr-only">Sort by conversion rate</span>
                  </Button>
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPackages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No packages found.
                </TableCell>
              </TableRow>
            ) : (
              sortedPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedRows.includes(pkg.id)} 
                      onCheckedChange={() => handleRowSelect(pkg.id)}
                      aria-label={`Select ${pkg.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-muted p-2">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{pkg.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {pkg.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${pkg.price.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{pkg.subscribers}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{pkg.conversionRate}%</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={pkg.status === "active" ? "default" : pkg.status === "inactive" ? "secondary" : "outline"}>
                      {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(pkg)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onFeatureToggle(pkg.id, "package")}>
                          <Star className="mr-2 h-4 w-4" />
                          Toggle Popular
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDeleteConfirm("package", pkg.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
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
  );
}