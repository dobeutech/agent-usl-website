import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MagnifyingGlass, Funnel, SortAscending, Briefcase, Export } from "@phosphor-icons/react"

interface ApplicantFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  positionFilter: string
  onPositionFilterChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  uniquePositions: string[]
  filteredCount: number
  totalCount: number
  onExport: () => void
}

export function ApplicantFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  positionFilter,
  onPositionFilterChange,
  sortBy,
  onSortChange,
  uniquePositions,
  filteredCount,
  totalCount,
  onExport
}: ApplicantFiltersProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by name, email, or position..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Funnel size={20} className="text-muted-foreground flex-shrink-0" />
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={20} className="text-muted-foreground flex-shrink-0" />
          <Select value={positionFilter} onValueChange={onPositionFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {uniquePositions.map(position => (
                <SelectItem key={position} value={position}>{position}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <SortAscending size={20} className="text-muted-foreground flex-shrink-0" />
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at_desc">Newest First</SelectItem>
              <SelectItem value="created_at_asc">Oldest First</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCount} applicants
        </p>
        <Button variant="outline" size="sm" onClick={onExport} disabled={filteredCount === 0}>
          <Export size={16} className="mr-2" />
          Export CSV
        </Button>
      </div>
    </Card>
  )
}

