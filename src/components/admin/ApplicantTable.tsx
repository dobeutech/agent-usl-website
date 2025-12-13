import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Eye, Download } from "@phosphor-icons/react"
import { Applicant } from "@/lib/supabase"

const statusColors = {
  new: "bg-accent/20 text-accent-foreground dark:bg-accent/30",
  reviewing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  shortlisted: "bg-primary/20 text-primary dark:bg-primary/30",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  hired: "bg-primary/30 text-primary dark:bg-primary/40"
}

const statusLabels = {
  new: "New",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired"
}

interface ApplicantTableProps {
  applicants: Applicant[]
  isLoading: boolean
  onView: (applicant: Applicant) => void
  onDownloadResume: (url: string, filename: string) => void
}

export function ApplicantTable({ applicants, isLoading, onView, onDownloadResume }: ApplicantTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading applicants...
                </TableCell>
              </TableRow>
            ) : applicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No applicants found
                </TableCell>
              </TableRow>
            ) : (
              applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">{applicant.full_name}</TableCell>
                  <TableCell>{applicant.email}</TableCell>
                  <TableCell>
                    {applicant.positions_interested && applicant.positions_interested.length > 0
                      ? applicant.positions_interested.join(', ')
                      : applicant.position_interested}
                  </TableCell>
                  <TableCell>{applicant.experience_years} years</TableCell>
                  <TableCell>
                    <Badge className={statusColors[applicant.status]}>
                      {statusLabels[applicant.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(applicant.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(applicant)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                      {applicant.resume_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDownloadResume(applicant.resume_url!, applicant.resume_filename || 'resume.pdf')}
                        >
                          <Download size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

