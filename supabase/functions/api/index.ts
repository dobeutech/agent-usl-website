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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Validate API key
  if (!validateApiKey(req)) {
    return new Response(
      JSON.stringify({ error: 'Invalid or missing API key' }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  const url = new URL(req.url)
  const path = url.pathname.replace('/api', '')

  // Initialize Supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // GET /applicants - List all applicants
    if (path === '/applicants' && req.method === 'GET') {
      const status = url.searchParams.get('status')
      const limit = parseInt(url.searchParams.get('limit') || '100')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      let query = supabaseClient
        .from('applicants')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error, count } = await query

      if (error) throw error

      return new Response(
        JSON.stringify({ data, count, limit, offset }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /applicants/:id - Get single applicant
    if (path.match(/^\/applicants\/[^/]+$/) && req.method === 'GET') {
      const id = path.split('/').pop()

      const { data, error } = await supabaseClient
        .from('applicants')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT /applicants/:id - Update applicant
    if (path.match(/^\/applicants\/[^/]+$/) && req.method === 'PUT') {
      const id = path.split('/').pop()
      const body = await req.json()

      const { data, error } = await supabaseClient
        .from('applicants')
        .update(body)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /jobs - List all active jobs
    if (path === '/jobs' && req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Not found
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
