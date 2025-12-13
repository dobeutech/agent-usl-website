import { Card } from "@/components/ui/card"
import { Applicant } from "@/lib/supabase"

interface ApplicantStatsProps {
  applicants: Applicant[]
}

export function ApplicantStats({ applicants }: ApplicantStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Total</p>
        <p className="text-2xl font-bold text-foreground">{applicants.length}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">New</p>
        <p className="text-2xl font-bold text-accent-foreground">
          {applicants.filter(a => a.status === 'new').length}
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Reviewing</p>
        <p className="text-2xl font-bold text-yellow-600">
          {applicants.filter(a => a.status === 'reviewing').length}
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Shortlisted</p>
        <p className="text-2xl font-bold text-primary">
          {applicants.filter(a => a.status === 'shortlisted').length}
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Hired</p>
        <p className="text-2xl font-bold text-primary">
          {applicants.filter(a => a.status === 'hired').length}
        </p>
      </Card>
    </div>
  )
}

