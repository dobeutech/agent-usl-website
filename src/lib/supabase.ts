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
  updated_at: string
  full_name: string
  email: string
  email_confirmed: string | null
  email_verified: boolean
  email_verification_token: string | null
  token_expiry: string | null
  phone: string
  phone_normalized: string | null
  position_interested: string
  positions_interested: string[] | null
  experience_years: number
  resume_url: string | null
  resume_filename: string | null
  cover_letter: string | null
  job_posting_url: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  submission_location: string | null
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  notes: string | null
  admin_notified_at: string | null
  preferred_language: string | null
  browser_language: string | null
}

export interface ApplicantInsert {
  full_name: string
  email: string
  email_confirmed?: string | null
  email_verified?: boolean
  email_verification_token?: string | null
  token_expiry?: string | null
  phone: string
  phone_normalized?: string | null
  position_interested?: string
  positions_interested?: string[] | null
  experience_years: number
  resume_url?: string | null
  resume_filename?: string | null
  cover_letter?: string | null
  job_posting_url?: string | null
  linkedin_url?: string | null
  portfolio_url?: string | null
  submission_location?: string | null
  status?: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  notes?: string | null
  preferred_language?: string | null
  browser_language?: string | null
}

export interface ApplicantDocument {
  id: string
  applicant_id: string
  document_type: 'cover_letter' | 'reference' | 'certificate' | 'portfolio' | 'other'
  document_url: string
  document_filename: string
  file_size: number | null
  mime_type: string | null
  uploaded_at: string
  created_at: string
}

export interface EmailVerificationLog {
  id: string
  applicant_id: string | null
  email: string
  token: string
  sent_at: string
  verified_at: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// Job Listings Types
export interface Job {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string
  requirements: string | null
  location_city: string
  location_state: string
  location_zip: string
  job_type: 'full-time' | 'part-time' | 'contract' | 'temporary'
  category: string
  salary_min: number | null
  salary_max: number | null
  salary_type: 'hourly' | 'annual' | null
  is_active: boolean
  featured: boolean
  expires_at: string | null
}

export interface JobInsert {
  title: string
  description: string
  requirements?: string | null
  location_city: string
  location_state: string
  location_zip: string
  job_type: 'full-time' | 'part-time' | 'contract' | 'temporary'
  category: string
  salary_min?: number | null
  salary_max?: number | null
  salary_type?: 'hourly' | 'annual' | null
  is_active?: boolean
  featured?: boolean
  expires_at?: string | null
}
