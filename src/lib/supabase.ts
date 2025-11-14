import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Applicant {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  position_interested: string
  experience_years: number
  resume_url: string | null
  resume_filename: string | null
  cover_letter: string | null
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  notes: string | null
  updated_at: string
}

export interface ApplicantInsert {
  full_name: string
  email: string
  phone: string
  position_interested: string
  experience_years: number
  resume_url?: string | null
  resume_filename?: string | null
  cover_letter?: string | null
  status?: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  notes?: string | null
}
