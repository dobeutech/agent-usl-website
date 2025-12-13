import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "@phosphor-icons/react"
import { Applicant } from "@/lib/supabase"

interface ApplicantDetailDialogProps {
  applicant: Applicant | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdate: (applicantId: string, newStatus: Applicant['status']) => void
  onNotesUpdate: (applicantId: string, notes: string) => void
  onDownloadResume: (url: string, filename: string) => void
  updatingStatus: boolean
  onApplicantChange: (applicant: Applicant) => void
}

export function ApplicantDetailDialog({
  applicant,
  isOpen,
  onOpenChange,
  onStatusUpdate,
  onNotesUpdate,
  onDownloadResume,
  updatingStatus,
  onApplicantChange
}: ApplicantDetailDialogProps) {
  if (!applicant) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Applicant Details</DialogTitle>
          <DialogDescription>
            View and manage applicant information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="font-medium">{applicant.full_name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{applicant.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{applicant.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Applied Date</Label>
                <p className="font-medium">
                  {new Date(applicant.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Professional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Position(s) Interested</Label>
                <p className="font-medium">
                  {applicant.positions_interested && applicant.positions_interested.length > 0
                    ? applicant.positions_interested.join(', ')
                    : applicant.position_interested}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Years of Experience</Label>
                <p className="font-medium">{applicant.experience_years} years</p>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          {applicant.cover_letter && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Cover Letter</Label>
              <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md">
                {applicant.cover_letter}
              </p>
            </div>
          )}

          {/* Resume */}
          {applicant.resume_url && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Resume</Label>
              <Button
                variant="outline"
                onClick={() => onDownloadResume(applicant.resume_url!, applicant.resume_filename || 'resume.pdf')}
              >
                <Download size={16} className="mr-2" />
                Download {applicant.resume_filename}
              </Button>
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={applicant.status}
              onValueChange={(value) => onStatusUpdate(applicant.id, value as Applicant['status'])}
              disabled={updatingStatus}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Admin Notes</Label>
            <Textarea
              value={applicant.notes || ''}
              onChange={(e) => {
                onApplicantChange({ ...applicant, notes: e.target.value })
              }}
              onBlur={(e) => onNotesUpdate(applicant.id, e.target.value)}
              rows={4}
              placeholder="Add internal notes about this applicant..."
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

