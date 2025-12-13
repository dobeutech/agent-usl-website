import { useEffect, useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { supabase, Applicant } from '@/lib/supabase'
import { toast } from 'sonner'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Users, Briefcase, Clock, TrendingUp } from 'lucide-react'

const COLORS = ['#73B77D', '#6DA373', '#679169', '#617F5F', '#5B6D55']

export function AnalyticsDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')

  useEffect(() => {
    fetchApplicants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange])

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true)

      const daysAgo = parseInt(dateRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysAgo)

      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error

      setApplicants(data || [])
    } catch (error) {
      console.error('Error fetching applicants:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  const getPositionDistribution = () => {
    const positionCounts: Record<string, number> = {}

    applicants.forEach(applicant => {
      const positions = applicant.positions_interested || [applicant.position_interested]
      positions.forEach(position => {
        if (position) {
          positionCounts[position] = (positionCounts[position] || 0) + 1
        }
      })
    })

    return Object.entries(positionCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }

  const getExperienceDistribution = () => {
    const experienceCounts: Record<string, number> = {
      '0-2 years': 0,
      '3-5 years': 0,
      '6-10 years': 0,
      '10+ years': 0
    }

    applicants.forEach(applicant => {
      const years = applicant.experience_years
      if (years <= 2) experienceCounts['0-2 years']++
      else if (years <= 5) experienceCounts['3-5 years']++
      else if (years <= 10) experienceCounts['6-10 years']++
      else experienceCounts['10+ years']++
    })

    return Object.entries(experienceCounts).map(([name, value]) => ({ name, value }))
  }

  const getSubmissionTimeline = () => {
    const timeline: Record<string, number> = {}

    applicants.forEach(applicant => {
      const date = new Date(applicant.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
      timeline[date] = (timeline[date] || 0) + 1
    })

    return Object.entries(timeline)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const getVerificationRate = () => {
    const total = applicants.length
    const verified = applicants.filter(a => a.email_verified).length
    return total > 0 ? Math.round((verified / total) * 100) : 0
  }

  const getLocationDistribution = () => {
    const locations: Record<string, number> = {}

    applicants.forEach(applicant => {
      const location = applicant.submission_location || 'Unknown'
      locations[location] = (locations[location] || 0) + 1
    })

    return Object.entries(locations)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const positionData = getPositionDistribution()
  const experienceData = getExperienceDistribution()
  const timelineData = getSubmissionTimeline()
  const locationData = getLocationDistribution()
  const verificationRate = getVerificationRate()

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-2xl text-foreground">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <Label htmlFor="date-range">Time Period:</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-foreground">{applicants.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Verified</p>
              <p className="text-3xl font-bold text-foreground">{verificationRate}%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Experience</p>
              <p className="text-3xl font-bold text-foreground">
                {applicants.length > 0
                  ? Math.round(
                      applicants.reduce((sum, a) => sum + a.experience_years, 0) / applicants.length
                    )
                  : 0}{' '}
                yrs
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Top Position</p>
              <p className="text-lg font-bold text-foreground truncate">
                {positionData[0]?.name || 'N/A'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-secondary-foreground" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Position Interest Distribution</h3>
          {positionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value})`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {positionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-12">No data available</p>
          )}
        </Card>

        {/* Experience Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Experience Level Distribution</h3>
          {experienceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={experienceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#73B77D" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-12">No data available</p>
          )}
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Timeline */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Application Submission Timeline</h3>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#73B77D" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-12">No data available</p>
          )}
        </Card>

        {/* Location Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Top Submission Locations</h3>
          {locationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#73B77D" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-12">No location data available</p>
          )}
        </Card>
      </div>
    </div>
  )
}
