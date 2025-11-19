import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignOut, MagnifyingGlass, Download, Eye, Funnel, SortAscending, Buildings } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, Applicant } from "@/lib/supabase"
import { BusinessInfoManager } from "@/components/admin/BusinessInfoManager"

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  reviewing: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  hired: "bg-purple-100 text-purple-800"
}

const statusLabels = {
  new: "New",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired"
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const { user, signOut, loading } = useAuth()
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("created_at_desc")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login")
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      fetchApplicants()
    }
  }, [user])

  useEffect(() => {
    filterAndSortApplicants()
  }, [applicants, searchQuery, statusFilter, sortBy])

  const fetchApplicants = async () => {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setApplicants(data || [])
    } catch (error) {
      console.error('Error fetching applicants:', error)
      toast.error("Failed to load applicants")
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortApplicants = () => {
    let filtered = [...applicants]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.position_interested.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_at_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'created_at_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'name_asc':
          return a.full_name.localeCompare(b.full_name)
        case 'name_desc':
          return b.full_name.localeCompare(a.full_name)
        default:
          return 0
      }
    })

    setFilteredApplicants(filtered)
  }

  const handleStatusUpdate = async (applicantId: string, newStatus: Applicant['status']) => {
    setUpdatingStatus(true)
    try {
      const { error } = await supabase
        .from('applicants')
        .update({ status: newStatus })
        .eq('id', applicantId)

      if (error) throw error

      toast.success("Status updated successfully")
      fetchApplicants()

      if (selectedApplicant && selectedApplicant.id === applicantId) {
        setSelectedApplicant({ ...selectedApplicant, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error("Failed to update status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleNotesUpdate = async (applicantId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('applicants')
        .update({ notes })
        .eq('id', applicantId)

      if (error) throw error

      toast.success("Notes updated successfully")
      fetchApplicants()

      if (selectedApplicant && selectedApplicant.id === applicantId) {
        setSelectedApplicant({ ...selectedApplicant, notes })
      }
    } catch (error) {
      console.error('Error updating notes:', error)
      toast.error("Failed to update notes")
    }
  }

  const downloadResume = async (resumeUrl: string, filename: string) => {
    try {
      const response = await fetch(resumeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success("Resume downloaded")
    } catch (error) {
      console.error('Error downloading resume:', error)
      toast.error("Failed to download resume")
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage applicants and applications
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <SignOut size={20} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="applicants" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="business-info">
              <Buildings size={16} className="mr-2" />
              Business Info & SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applicants"  className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold text-foreground">{applicants.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">New</p>
            <p className="text-2xl font-bold text-blue-600">
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
            <p className="text-2xl font-bold text-green-600">
              {applicants.filter(a => a.status === 'shortlisted').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Hired</p>
            <p className="text-2xl font-bold text-purple-600">
              {applicants.filter(a => a.status === 'hired').length}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlass
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search by name, email, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Funnel size={20} className="text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              <SortAscending size={20} className="text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
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
        </Card>

        {/* Table */}
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
                ) : filteredApplicants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No applicants found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="font-medium">{applicant.full_name}</TableCell>
                      <TableCell>{applicant.email}</TableCell>
                      <TableCell>{applicant.position_interested}</TableCell>
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
                            onClick={() => {
                              setSelectedApplicant(applicant)
                              setIsDetailDialogOpen(true)
                            }}
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </Button>
                          {applicant.resume_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadResume(applicant.resume_url!, applicant.resume_filename || 'resume.pdf')}
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

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
            <DialogDescription>
              View and manage applicant information
            </DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="font-medium">{selectedApplicant.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedApplicant.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedApplicant.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Applied Date</Label>
                    <p className="font-medium">
                      {new Date(selectedApplicant.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Professional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Position Interested</Label>
                    <p className="font-medium">{selectedApplicant.position_interested}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Years of Experience</Label>
                    <p className="font-medium">{selectedApplicant.experience_years} years</p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApplicant.cover_letter && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Cover Letter</Label>
                  <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md">
                    {selectedApplicant.cover_letter}
                  </p>
                </div>
              )}

              {/* Resume */}
              {selectedApplicant.resume_url && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Resume</Label>
                  <Button
                    variant="outline"
                    onClick={() => downloadResume(selectedApplicant.resume_url!, selectedApplicant.resume_filename || 'resume.pdf')}
                  >
                    <Download size={16} className="mr-2" />
                    Download {selectedApplicant.resume_filename}
                  </Button>
                </div>
              )}

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={selectedApplicant.status}
                  onValueChange={(value) => handleStatusUpdate(selectedApplicant.id, value as Applicant['status'])}
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
                  value={selectedApplicant.notes || ''}
                  onChange={(e) => {
                    setSelectedApplicant({ ...selectedApplicant, notes: e.target.value })
                  }}
                  onBlur={(e) => handleNotesUpdate(selectedApplicant.id, e.target.value)}
                  rows={4}
                  placeholder="Add internal notes about this applicant..."
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
          </TabsContent>

          <TabsContent value="business-info">
            <BusinessInfoManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
