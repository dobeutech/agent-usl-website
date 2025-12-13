import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-api-key, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// Simple API key validation
function validateApiKey(req: Request): boolean {
  const apiKey = req.headers.get('x-api-key')
  const validApiKey = Deno.env.get('FINDD_API_KEY')
  return apiKey === validApiKey
}

// Helper to send JSON response
function jsonResponse(data: unknown, status = 200) {
  return new Response(
    JSON.stringify(data),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname.replace('/api', '')

  // Health check - no auth required
  if (path === '/health' && req.method === 'GET') {
    return jsonResponse({ status: 'healthy', timestamp: new Date().toISOString() })
  }

  // Validate API key for all other routes
  if (!validateApiKey(req)) {
    return jsonResponse({ error: 'Invalid or missing API key', code: 'UNAUTHORIZED' }, 401)
  }

  // Initialize Supabase client with service role for full access
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // ========================
    // APPLICANTS ENDPOINTS
    // ========================

    // GET /applicants - List all applicants with filtering
    if (path === '/applicants' && req.method === 'GET') {
      const status = url.searchParams.get('status')
      const position = url.searchParams.get('position')
      const minExperience = url.searchParams.get('min_experience')
      const maxExperience = url.searchParams.get('max_experience')
      const emailVerified = url.searchParams.get('email_verified')
      const newsletterSubscribed = url.searchParams.get('newsletter_subscribed')
      const smsEnabled = url.searchParams.get('sms_enabled')
      const createdAfter = url.searchParams.get('created_after')
      const createdBefore = url.searchParams.get('created_before')
      const utmSource = url.searchParams.get('utm_source')
      const sortField = url.searchParams.get('sort') || 'created_at'
      const sortOrder = url.searchParams.get('order') || 'desc'
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100)
      const offset = parseInt(url.searchParams.get('offset') || '0')

      let query = supabaseClient
        .from('applicants')
        .select('*', { count: 'exact' })
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1)

      // Apply filters
      if (status) query = query.eq('status', status)
      if (position) query = query.contains('positions_interested', [position])
      if (minExperience) query = query.gte('experience_years', parseInt(minExperience))
      if (maxExperience) query = query.lte('experience_years', parseInt(maxExperience))
      if (emailVerified !== null) query = query.eq('email_verified', emailVerified === 'true')
      if (newsletterSubscribed !== null) query = query.eq('newsletter_subscribed', newsletterSubscribed === 'true')
      if (smsEnabled !== null) query = query.eq('sms_notifications_enabled', smsEnabled === 'true')
      if (createdAfter) query = query.gte('created_at', createdAfter)
      if (createdBefore) query = query.lte('created_at', createdBefore)
      if (utmSource) query = query.contains('communication_preferences', { utm_source: utmSource })

      const { data, error, count } = await query

      if (error) throw error

      return jsonResponse({ data, count, limit, offset })
    }

    // POST /applicants - Create new applicant
    if (path === '/applicants' && req.method === 'POST') {
      const body = await req.json()
      
      const { data, error } = await supabaseClient
        .from('applicants')
        .insert([body])
        .select()
        .single()

      if (error) throw error

      return jsonResponse({ data }, 201)
    }

    // GET /applicants/:id - Get single applicant
    if (path.match(/^\/applicants\/[^/]+$/) && req.method === 'GET') {
      const id = path.split('/').pop()

      const { data, error } = await supabaseClient
        .from('applicants')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return jsonResponse({ error: 'Applicant not found', code: 'NOT_FOUND' }, 404)
        }
        throw error
      }

      return jsonResponse({ data })
    }

    // PUT /applicants/:id - Update applicant
    if (path.match(/^\/applicants\/[^/]+$/) && req.method === 'PUT') {
      const id = path.split('/').pop()
      const body = await req.json()

      const { data, error } = await supabaseClient
        .from('applicants')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return jsonResponse({ error: 'Applicant not found', code: 'NOT_FOUND' }, 404)
        }
        throw error
      }

      return jsonResponse({ data })
    }

    // DELETE /applicants/:id - Delete applicant (GDPR)
    if (path.match(/^\/applicants\/[^/]+$/) && req.method === 'DELETE') {
      const id = path.split('/').pop()

      const { error } = await supabaseClient
        .from('applicants')
        .delete()
        .eq('id', id)

      if (error) throw error

      return new Response(null, { status: 204, headers: corsHeaders })
    }

    // GET /applicants/:id/documents - Get applicant documents
    if (path.match(/^\/applicants\/[^/]+\/documents$/) && req.method === 'GET') {
      const id = path.split('/')[2]

      const { data, error } = await supabaseClient
        .from('applicant_documents')
        .select('*')
        .eq('applicant_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return jsonResponse({ data })
    }

    // GET /applicants/export - Export applicants
    if (path === '/applicants/export' && req.method === 'GET') {
      const format = url.searchParams.get('format') || 'csv'
      const status = url.searchParams.get('status')
      const position = url.searchParams.get('position')
      const createdAfter = url.searchParams.get('created_after')
      const createdBefore = url.searchParams.get('created_before')

      let query = supabaseClient
        .from('applicants')
        .select('*')
        .order('created_at', { ascending: false })

      if (status) query = query.eq('status', status)
      if (position) query = query.contains('positions_interested', [position])
      if (createdAfter) query = query.gte('created_at', createdAfter)
      if (createdBefore) query = query.lte('created_at', createdBefore)

      const { data, error } = await query

      if (error) throw error

      if (format === 'csv') {
        const headers = ['id', 'full_name', 'email', 'phone', 'positions_interested', 'experience_years', 'status', 'created_at', 'email_verified', 'newsletter_subscribed', 'sms_notifications_enabled']
        const csvRows = [
          headers.join(','),
          ...data.map(row => headers.map(h => {
            const val = row[h]
            if (Array.isArray(val)) return `"${val.join('; ')}"`
            if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`
            return val ?? ''
          }).join(','))
        ]
        return new Response(csvRows.join('\n'), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="applicants_${new Date().toISOString().split('T')[0]}.csv"`
          }
        })
      }

      return jsonResponse(data)
    }

    // ========================
    // JOBS ENDPOINTS
    // ========================

    // GET /jobs - List all jobs
    if (path === '/jobs' && req.method === 'GET') {
      const isActive = url.searchParams.get('is_active')
      const jobType = url.searchParams.get('job_type')
      const category = url.searchParams.get('category')
      const locationState = url.searchParams.get('location_state')
      const featured = url.searchParams.get('featured')

      let query = supabaseClient
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (isActive !== null) query = query.eq('is_active', isActive !== 'false')
      if (jobType) query = query.eq('job_type', jobType)
      if (category) query = query.eq('category', category)
      if (locationState) query = query.eq('location_state', locationState)
      if (featured === 'true') query = query.eq('featured', true)

      const { data, error } = await query

      if (error) throw error

      return jsonResponse({ data })
    }

    // GET /jobs/:id - Get single job
    if (path.match(/^\/jobs\/[^/]+$/) && req.method === 'GET') {
      const id = path.split('/').pop()

      const { data, error } = await supabaseClient
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return jsonResponse({ error: 'Job not found', code: 'NOT_FOUND' }, 404)
        }
        throw error
      }

      return jsonResponse({ data })
    }

    // ========================
    // ANALYTICS ENDPOINTS
    // ========================

    // GET /analytics/visitors - Get visitor analytics
    if (path === '/analytics/visitors' && req.method === 'GET') {
      const startDate = url.searchParams.get('start_date')
      const endDate = url.searchParams.get('end_date')
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 1000)

      if (!startDate || !endDate) {
        return jsonResponse({ error: 'start_date and end_date are required', code: 'BAD_REQUEST' }, 400)
      }

      const { data, error, count } = await supabaseClient
        .from('visitor_analytics')
        .select('*', { count: 'exact' })
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return jsonResponse({ data, count, limit })
    }

    // GET /analytics/summary - Get analytics summary
    if (path === '/analytics/summary' && req.method === 'GET') {
      const startDate = url.searchParams.get('start_date')
      const endDate = url.searchParams.get('end_date')

      if (!startDate || !endDate) {
        return jsonResponse({ error: 'start_date and end_date are required', code: 'BAD_REQUEST' }, 400)
      }

      // Get visitor count
      const { count: totalVisitors } = await supabaseClient
        .from('visitor_analytics')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      // Get unique visitors
      const { data: uniqueData } = await supabaseClient
        .from('visitor_analytics')
        .select('visitor_id')
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      const uniqueVisitors = new Set(uniqueData?.map(v => v.visitor_id)).size

      // Get application count
      const { count: totalApplications } = await supabaseClient
        .from('applicants')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      const conversionRate = totalVisitors && totalApplications 
        ? ((totalApplications / totalVisitors) * 100).toFixed(2)
        : 0

      return jsonResponse({
        total_visitors: totalVisitors || 0,
        unique_visitors: uniqueVisitors,
        total_applications: totalApplications || 0,
        conversion_rate: parseFloat(conversionRate as string)
      })
    }

    // GET /analytics/sources - Get traffic sources
    if (path === '/analytics/sources' && req.method === 'GET') {
      const startDate = url.searchParams.get('start_date')
      const endDate = url.searchParams.get('end_date')

      if (!startDate || !endDate) {
        return jsonResponse({ error: 'start_date and end_date are required', code: 'BAD_REQUEST' }, 400)
      }

      const { data, error } = await supabaseClient
        .from('visitor_analytics')
        .select('utm_source, utm_medium, utm_campaign, referrer')
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      if (error) throw error

      // Aggregate sources
      const sourceMap = new Map<string, { visitors: number, source: string, medium: string, campaign: string }>()
      
      data?.forEach(row => {
        const key = `${row.utm_source || 'direct'}|${row.utm_medium || ''}|${row.utm_campaign || ''}`
        const existing = sourceMap.get(key) || {
          source: row.utm_source || (row.referrer ? 'referral' : 'direct'),
          medium: row.utm_medium || '',
          campaign: row.utm_campaign || '',
          visitors: 0
        }
        existing.visitors++
        sourceMap.set(key, existing)
      })

      const sources = Array.from(sourceMap.values())
        .sort((a, b) => b.visitors - a.visitors)

      return jsonResponse({ data: sources })
    }

    // ========================
    // COMMUNICATIONS ENDPOINTS
    // ========================

    // GET /communications/preferences - Get preferences by email
    if (path === '/communications/preferences' && req.method === 'GET') {
      const email = url.searchParams.get('email')

      if (!email) {
        return jsonResponse({ error: 'email is required', code: 'BAD_REQUEST' }, 400)
      }

      const { data, error } = await supabaseClient
        .from('applicants')
        .select('email, newsletter_subscribed, job_notifications_enabled, sms_notifications_enabled, updated_at')
        .eq('email', email)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return jsonResponse({ error: 'Email not found', code: 'NOT_FOUND' }, 404)
        }
        throw error
      }

      return jsonResponse(data)
    }

    // PUT /communications/preferences - Update preferences
    if (path === '/communications/preferences' && req.method === 'PUT') {
      const body = await req.json()
      const { email, newsletter_subscribed, job_notifications_enabled, sms_notifications_enabled } = body

      if (!email) {
        return jsonResponse({ error: 'email is required', code: 'BAD_REQUEST' }, 400)
      }

      const { data, error } = await supabaseClient
        .from('applicants')
        .update({
          newsletter_subscribed,
          job_notifications_enabled,
          sms_notifications_enabled,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select('email, newsletter_subscribed, job_notifications_enabled, sms_notifications_enabled, updated_at')
        .single()

      if (error) throw error

      return jsonResponse(data)
    }

    // POST /communications/unsubscribe - Process unsubscribe
    if (path === '/communications/unsubscribe' && req.method === 'POST') {
      const body = await req.json()
      const { email, type, reason } = body

      if (!email || !type) {
        return jsonResponse({ error: 'email and type are required', code: 'BAD_REQUEST' }, 400)
      }

      // Log unsubscribe
      await supabaseClient
        .from('unsubscribe_log')
        .insert([{ email, unsubscribe_type: type, reason }])

      // Update preferences based on type
      const updates: Record<string, boolean> = {}
      if (type === 'newsletter' || type === 'all') updates.newsletter_subscribed = false
      if (type === 'job_notifications' || type === 'all') updates.job_notifications_enabled = false
      if (type === 'sms' || type === 'all') updates.sms_notifications_enabled = false

      await supabaseClient
        .from('applicants')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('email', email)

      return jsonResponse({ success: true, message: 'Unsubscribed successfully' })
    }

    // Not found
    return jsonResponse({ error: 'Not found', code: 'NOT_FOUND' }, 404)

  } catch (error) {
    console.error('API Error:', error)
    return jsonResponse({ error: error.message, code: 'INTERNAL_ERROR' }, 500)
  }
})
