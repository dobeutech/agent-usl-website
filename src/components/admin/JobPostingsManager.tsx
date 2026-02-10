import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, PencilSimple, Trash, Briefcase, MapPin } from "@phosphor-icons/react"
import { toast } from "sonner"
import { supabase, Job } from "@/lib/supabase"
import { isDemoMode, getDemoJobs, addDemoJob, updateDemoJob, deleteDemoJob } from "@/lib/mockData"

const CATEGORIES = [
  'Janitorial',
  'Construction',
  'Retail & Sales',
  'Facilities Management',
  'Industrial & Manufacturing',
  'Administrative',
  'Warehouse & Logistics',
  'Healthcare Support',
  'IT & Technology',
  'Facilities Maintenance',
  'Other'
]

const JOB_TYPES: Job['job_type'][] = ['full-time', 'part-time', 'contract', 'temporary']
const SALARY_TYPES: ('hourly' | 'annual')[] = ['hourly', 'annual']

interface JobFormData {
  title: string
  description: string
  requirements: string
  location_city: string
  location_state: string
  location_zip: string
  job_type: Job['job_type']
  category: string
  salary_min: string
  salary_max: string
  salary_type: 'hourly' | 'annual' | ''
  is_active: boolean
  featured: boolean
  expires_at: string
}

const emptyForm: JobFormData = {
  title: '',
  description: '',
  requirements: '',
  location_city: '',
  location_state: '',
  location_zip: '',
  job_type: 'full-time',
  category: '',
  salary_min: '',
  salary_max: '',
  salary_type: '',
  is_active: true,
  featured: false,
  expires_at: ''
}

export function JobPostingsManager() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [form, setForm] = useState<JobFormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      if (isDemoMode()) {
        setJobs(getDemoJobs())
      } else {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setJobs(data || [])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to load job postings')
    } finally {
      setLoading(false)
    }
  }

  const openAddDialog = () => {
    setEditingJob(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (job: Job) => {
    setEditingJob(job)
    setForm({
      title: job.title,
      description: job.description,
      requirements: job.requirements || '',
      location_city: job.location_city,
      location_state: job.location_state,
      location_zip: job.location_zip,
      job_type: job.job_type,
      category: job.category,
      salary_min: job.salary_min?.toString() || '',
      salary_max: job.salary_max?.toString() || '',
      salary_type: job.salary_type || '',
      is_active: job.is_active,
      featured: job.featured,
      expires_at: job.expires_at ? job.expires_at.split('T')[0] : ''
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.description || !form.location_city || !form.location_state || !form.location_zip || !form.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const jobData = {
        title: form.title,
        description: form.description,
        requirements: form.requirements || null,
        location_city: form.location_city,
        location_state: form.location_state,
        location_zip: form.location_zip,
        job_type: form.job_type,
        category: form.category,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        salary_type: (form.salary_type || null) as 'hourly' | 'annual' | null,
        is_active: form.is_active,
        featured: form.featured,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null
      }

      if (isDemoMode()) {
        if (editingJob) {
          updateDemoJob(editingJob.id, jobData)
          toast.success('Job posting updated successfully')
        } else {
          addDemoJob(jobData)
          toast.success('Job posting created successfully')
        }
        setJobs(getDemoJobs())
      } else {
        if (editingJob) {
          const { error } = await supabase
            .from('jobs')
            .update(jobData)
            .eq('id', editingJob.id)

          if (error) throw error
          toast.success('Job posting updated successfully')
        } else {
          const { error } = await supabase
            .from('jobs')
            .insert(jobData)

          if (error) throw error
          toast.success('Job posting created successfully')
        }
        await fetchJobs()
      }

      setDialogOpen(false)
      setEditingJob(null)
      setForm(emptyForm)
    } catch (error) {
      console.error('Error saving job:', error)
      toast.error('Failed to save job posting')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (job: Job) => {
    if (!confirm(`Are you sure you want to delete "${job.title}"?`)) return

    try {
      if (isDemoMode()) {
        deleteDemoJob(job.id)
        setJobs(getDemoJobs())
        toast.success('Job posting deleted')
      } else {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', job.id)

        if (error) throw error
        toast.success('Job posting deleted')
        await fetchJobs()
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      toast.error('Failed to delete job posting')
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">Loading job postings...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase size={24} />
            Job Postings
          </h2>
          <p className="text-muted-foreground">{jobs.length} job{jobs.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus size={20} className="mr-2" />
          Add New Job
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Featured</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No job postings yet. Click "Add New Job" to create one.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{job.title}</td>
                    <td className="p-4 text-muted-foreground">{job.category}</td>
                    <td className="p-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location_city}, {job.location_state}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize">
                        {job.job_type.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={job.is_active ? "default" : "secondary"}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {job.featured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Featured
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(job)}>
                          <PencilSimple size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(job)} className="text-destructive hover:text-destructive">
                          <Trash size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job Posting' : 'Add New Job Posting'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Warehouse Associate"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Job description..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                placeholder="Job requirements..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location_city">City *</Label>
                <Input
                  id="location_city"
                  value={form.location_city}
                  onChange={(e) => setForm({ ...form, location_city: e.target.value })}
                  placeholder="Baltimore"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location_state">State *</Label>
                <Input
                  id="location_state"
                  value={form.location_state}
                  onChange={(e) => setForm({ ...form, location_state: e.target.value })}
                  placeholder="MD"
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location_zip">ZIP *</Label>
                <Input
                  id="location_zip"
                  value={form.location_zip}
                  onChange={(e) => setForm({ ...form, location_zip: e.target.value })}
                  placeholder="21201"
                  maxLength={5}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Type *</Label>
                <Select value={form.job_type} onValueChange={(value) => setForm({ ...form, job_type: value as Job['job_type'] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type.replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_min">Salary Min</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={form.salary_min}
                  onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_max">Salary Max</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={form.salary_max}
                  onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Salary Type</Label>
                <Select value={form.salary_type} onValueChange={(value) => setForm({ ...form, salary_type: value as 'hourly' | 'annual' | '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_at">Expires At</Label>
              <Input
                id="expires_at"
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={form.featured}
                  onCheckedChange={(checked) => setForm({ ...form, featured: checked })}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
