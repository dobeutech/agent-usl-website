import { useEffect, useState, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignOut, Buildings, ChartBar, Info } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, Applicant } from "@/lib/supabase"
import { isDemoMode, getDemoApplicants, updateDemoApplicant } from "@/lib/mockData"
import { BusinessInfoManager } from "@/components/admin/BusinessInfoManager"
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard"
import { ApplicantStats } from "@/components/admin/ApplicantStats"
import { ApplicantFilters } from "@/components/admin/ApplicantFilters"
import { ApplicantTable } from "@/components/admin/ApplicantTable"
import { ApplicantDetailDialog } from "@/components/admin/ApplicantDetailDialog"

export function AdminDashboard() {
  const navigate = useNavigate()
  const { user, signOut, loading, isDemo } = useAuth()
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("created_at_desc")
  const [positionFilter, setPositionFilter] = useState<string>("all")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login")
    }
  }, [user, loading, navigate])

  const fetchApplicants = useCallback(async () => {
    // Use mock data in demo mode
    if (isDemo || isDemoMode()) {
      setApplicants(getDemoApplicants())
      setIsLoading(false)
      return
    }

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
  }, [isDemo])

  useEffect(() => {
    if (user) {
      fetchApplicants()
    }
  }, [user, fetchApplicants])

  const filterAndSortApplicants = useCallback(() => {
    let filtered = [...applicants]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Apply position filter
    if (positionFilter !== "all") {
      filtered = filtered.filter(app => {
        if (app.positions_interested && app.positions_interested.length > 0) {
          return app.positions_interested.includes(positionFilter)
        }
        return app.position_interested === positionFilter
      })
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
  }, [applicants, searchQuery, statusFilter, positionFilter, sortBy])

  useEffect(() => {
    filterAndSortApplicants()
  }, [filterAndSortApplicants])

  // Get unique positions for filter - memoized to avoid recalculation
  const uniquePositions = useMemo(() => Array.from(new Set(
    applicants.flatMap(app =>
      app.positions_interested && app.positions_interested.length > 0
        ? app.positions_interested
        : [app.position_interested]
    ).filter(Boolean)
  )).sort(), [applicants])

  // Export to CSV function - memoized with useCallback
  const exportToCSV = useCallback(() => {
    const headers = ['Name', 'Email', 'Phone', 'Position', 'Experience (Years)', 'Status', 'Applied Date', 'Notes']
    const rows = filteredApplicants.map(app => [
      app.full_name,
      app.email,
      app.phone,
      app.positions_interested?.join('; ') || app.position_interested,
      app.experience_years,
      app.status,
      new Date(app.created_at).toLocaleDateString(),
      app.notes || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `applicants_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Exported to CSV')
  }, [filteredApplicants])


  const handleStatusUpdate = async (applicantId: string, newStatus: Applicant['status']) => {
    setUpdatingStatus(true)

    // Demo mode: update mock data
    if (isDemo || isDemoMode()) {
      const updated = updateDemoApplicant(applicantId, { status: newStatus })
      if (updated) {
        toast.success("Status updated successfully")
        setApplicants(getDemoApplicants())
        if (selectedApplicant && selectedApplicant.id === applicantId) {
          setSelectedApplicant({ ...selectedApplicant, status: newStatus })
        }
      }
      setUpdatingStatus(false)
      return
    }

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
    // Demo mode: update mock data
    if (isDemo || isDemoMode()) {
      const updated = updateDemoApplicant(applicantId, { notes })
      if (updated) {
        toast.success("Notes updated successfully")
        setApplicants(getDemoApplicants())
        if (selectedApplicant && selectedApplicant.id === applicantId) {
          setSelectedApplicant({ ...selectedApplicant, notes })
        }
      }
      return
    }

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
    // In demo mode, show a message about demo limitations
    if (isDemo || isDemoMode() || resumeUrl.startsWith('demo://')) {
      toast.info("Demo mode: Resume download simulated", {
        description: `Would download: ${filename}`
      })
      return
    }

    try {
      // Check if it's a legacy/public URL
      if (resumeUrl.startsWith('http')) {
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
        return
      }

      // It's a storage path - generate signed URL
      // Assume 'resumes' bucket for now as that's where resumes go
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(resumeUrl, 60) // 60 seconds expiry

      if (error) throw error
      if (!data?.signedUrl) throw new Error('Failed to generate signed URL')

      // Open signed URL in new tab (triggers download due to content-disposition usually, or view)
      // Or fetch it to force download name
      const response = await fetch(data.signedUrl)
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

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant)
    setIsDetailDialogOpen(true)
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
      {/* Demo Mode Banner */}
      {(isDemo || isDemoMode()) && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Info size={18} />
            <span className="text-sm font-medium">
              Demo Mode: Using sample data. Connect Supabase for production use.
            </span>
          </div>
        </div>
      )}

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
            <TabsTrigger value="analytics">
              <ChartBar size={16} className="mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="business-info">
              <Buildings size={16} className="mr-2" />
              Business Info & SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applicants" className="space-y-6">
            <ApplicantStats applicants={applicants} />

            <ApplicantFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              positionFilter={positionFilter}
              onPositionFilterChange={setPositionFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              uniquePositions={uniquePositions}
              filteredCount={filteredApplicants.length}
              totalCount={applicants.length}
              onExport={exportToCSV}
            />

            <ApplicantTable
              applicants={filteredApplicants}
              isLoading={isLoading}
              onView={handleViewApplicant}
              onDownloadResume={downloadResume}
            />

            <ApplicantDetailDialog
              applicant={selectedApplicant}
              isOpen={isDetailDialogOpen}
              onOpenChange={setIsDetailDialogOpen}
              onStatusUpdate={handleStatusUpdate}
              onNotesUpdate={handleNotesUpdate}
              onDownloadResume={downloadResume}
              updatingStatus={updatingStatus}
              onApplicantChange={setSelectedApplicant}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="business-info">
            <BusinessInfoManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
