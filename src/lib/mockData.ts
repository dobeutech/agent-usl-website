// Mock data for demo mode when Supabase is not configured
import type { Applicant, Job } from './supabase'

// Check if we're in demo mode (no Supabase configured or force demo mode)
export function isDemoMode(): boolean {
  // Allow forcing demo mode via environment variable
  const forceDemoMode = import.meta.env.VITE_FORCE_DEMO_MODE === 'true'
  if (forceDemoMode) {
    return true
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  return !supabaseUrl || !supabaseKey ||
         supabaseUrl === 'https://placeholder.supabase.co' ||
         supabaseKey === 'placeholder-anon-key'
}

// Generate realistic mock applicants with dynamic dates
function generateMockApplicants(): Applicant[] {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  const hour = 60 * 60 * 1000

  return [
    {
      id: '1',
      created_at: new Date(now - 1 * day).toISOString(),
      updated_at: new Date(now - 1 * day).toISOString(),
      full_name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      email_confirmed: null,
      email_verified: false,
      email_verification_token: null,
      token_expiry: null,
      phone: '301-555-1234',
      phone_normalized: '+13015551234',
      position_interested: 'Warehouse Associate',
      positions_interested: ['Warehouse Associate', 'Forklift Operator'],
      experience_years: 3,
      resume_url: null,
      resume_filename: 'maria_garcia_resume.pdf',
      cover_letter: null,
      job_posting_url: null,
      linkedin_url: null,
      portfolio_url: null,
      submission_location: null,
      status: 'new',
      notes: null,
      admin_notified_at: null,
      preferred_language: 'es',
      browser_language: 'es-US'
    },
    {
      id: '2',
      created_at: new Date(now - 2 * day).toISOString(),
      updated_at: new Date(now - 1 * day).toISOString(),
      full_name: 'James Wilson',
      email: 'james.wilson@email.com',
      email_confirmed: new Date(now).toISOString(),
      email_verified: true,
      email_verification_token: null,
      token_expiry: null,
      phone: '202-555-5678',
      phone_normalized: '+12025555678',
      position_interested: 'Customer Service Representative',
      positions_interested: ['Customer Service Representative', 'Facilities Management'],
      experience_years: 5,
      resume_url: 'https://example.com/resume.pdf',
      resume_filename: 'james_wilson_resume.pdf',
      cover_letter: 'I am excited to apply for this position...',
      job_posting_url: null,
      linkedin_url: 'https://linkedin.com/in/jameswilson',
      portfolio_url: null,
      submission_location: null,
      status: 'reviewing',
      notes: 'Strong candidate, schedule phone interview',
      admin_notified_at: new Date(now).toISOString(),
      preferred_language: 'en',
      browser_language: 'en-US'
    },
    {
      id: '3',
      created_at: new Date(now - 3 * day).toISOString(),
      updated_at: new Date(now - 2 * day).toISOString(),
      full_name: 'Aisha Johnson',
      email: 'aisha.johnson@email.com',
      email_confirmed: new Date(now).toISOString(),
      email_verified: true,
      email_verification_token: null,
      token_expiry: null,
      phone: '240-555-9012',
      phone_normalized: '+12405559012',
      position_interested: 'Administrative Assistant',
      positions_interested: ['Administrative Assistant', 'Office Manager'],
      experience_years: 7,
      resume_url: 'https://example.com/resume2.pdf',
      resume_filename: 'aisha_johnson_resume.pdf',
      cover_letter: 'With over 7 years of administrative experience...',
      job_posting_url: null,
      linkedin_url: 'https://linkedin.com/in/aishajohnson',
      portfolio_url: null,
      submission_location: null,
      status: 'shortlisted',
      notes: 'Excellent qualifications, recommend for final interview',
      admin_notified_at: new Date(now).toISOString(),
      preferred_language: 'en',
      browser_language: 'en-US'
    },
    {
      id: '4',
      created_at: new Date(now - 5 * day).toISOString(),
      updated_at: new Date(now - 4 * day).toISOString(),
      full_name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@email.com',
      email_confirmed: null,
      email_verified: false,
      email_verification_token: 'abc123',
      token_expiry: new Date(now + 1 * day).toISOString(),
      phone: '301-555-3456',
      phone_normalized: '+13015553456',
      position_interested: 'Janitorial Staff',
      positions_interested: ['Janitorial Staff', 'Maintenance Technician'],
      experience_years: 2,
      resume_url: null,
      resume_filename: 'carlos_rodriguez_resume.pdf',
      cover_letter: null,
      job_posting_url: null,
      linkedin_url: null,
      portfolio_url: null,
      submission_location: null,
      status: 'new',
      notes: null,
      admin_notified_at: null,
      preferred_language: 'es',
      browser_language: 'es-US'
    },
    {
      id: '5',
      created_at: new Date(now - 7 * day).toISOString(),
      updated_at: new Date(now - 6 * day).toISOString(),
      full_name: 'Emily Chen',
      email: 'emily.chen@email.com',
      email_confirmed: new Date(now).toISOString(),
      email_verified: true,
      email_verification_token: null,
      token_expiry: null,
      phone: '703-555-7890',
      phone_normalized: '+17035557890',
      position_interested: 'HR Coordinator',
      positions_interested: ['HR Coordinator', 'Recruiter'],
      experience_years: 4,
      resume_url: 'https://example.com/resume3.pdf',
      resume_filename: 'emily_chen_resume.pdf',
      cover_letter: 'I am passionate about helping organizations...',
      job_posting_url: null,
      linkedin_url: 'https://linkedin.com/in/emilychen',
      portfolio_url: null,
      submission_location: null,
      status: 'hired',
      notes: 'Hired for HR Coordinator position starting next month',
      admin_notified_at: new Date(now).toISOString(),
      preferred_language: 'en',
      browser_language: 'en-US'
    },
    {
      id: '6',
      created_at: new Date(now - 10 * day).toISOString(),
      updated_at: new Date(now - 8 * day).toISOString(),
      full_name: 'Robert Thompson',
      email: 'robert.thompson@email.com',
      email_confirmed: new Date(now).toISOString(),
      email_verified: true,
      email_verification_token: null,
      token_expiry: null,
      phone: '202-555-2345',
      phone_normalized: '+12025552345',
      position_interested: 'Security Guard',
      positions_interested: ['Security Guard'],
      experience_years: 8,
      resume_url: 'https://example.com/resume4.pdf',
      resume_filename: 'robert_thompson_resume.pdf',
      cover_letter: null,
      job_posting_url: null,
      linkedin_url: null,
      portfolio_url: null,
      submission_location: null,
      status: 'rejected',
      notes: 'Does not meet security clearance requirements',
      admin_notified_at: new Date(now).toISOString(),
      preferred_language: 'en',
      browser_language: 'en-US'
    },
    {
      id: '7',
      created_at: new Date(now - 12 * hour).toISOString(),
      updated_at: new Date(now - 12 * hour).toISOString(),
      full_name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      email_confirmed: null,
      email_verified: false,
      email_verification_token: 'def456',
      token_expiry: new Date(now + 1 * day).toISOString(),
      phone: '240-555-6789',
      phone_normalized: '+12405556789',
      position_interested: 'Retail Associate',
      positions_interested: ['Retail Associate', 'Cashier'],
      experience_years: 1,
      resume_url: null,
      resume_filename: 'sophie_martin_resume.pdf',
      cover_letter: null,
      job_posting_url: null,
      linkedin_url: null,
      portfolio_url: null,
      submission_location: null,
      status: 'new',
      notes: null,
      admin_notified_at: null,
      preferred_language: 'fr',
      browser_language: 'fr-FR'
    },
    {
      id: '8',
      created_at: new Date(now - 4 * day).toISOString(),
      updated_at: new Date(now - 3 * day).toISOString(),
      full_name: 'David Lee',
      email: 'david.lee@email.com',
      email_confirmed: new Date(now).toISOString(),
      email_verified: true,
      email_verification_token: null,
      token_expiry: null,
      phone: '301-555-8901',
      phone_normalized: '+13015558901',
      position_interested: 'Forklift Operator',
      positions_interested: ['Forklift Operator', 'Warehouse Associate'],
      experience_years: 6,
      resume_url: 'https://example.com/resume5.pdf',
      resume_filename: 'david_lee_resume.pdf',
      cover_letter: 'Certified forklift operator with 6 years experience...',
      job_posting_url: null,
      linkedin_url: null,
      portfolio_url: null,
      submission_location: null,
      status: 'reviewing',
      notes: 'Has valid forklift certification',
      admin_notified_at: new Date(now).toISOString(),
      preferred_language: 'en',
      browser_language: 'en-US'
    }
  ]
}

export const mockApplicants = generateMockApplicants()

// Mock storage for demo mode - allows updates to persist in session
let demoApplicants = [...mockApplicants]

export function getDemoApplicants(): Applicant[] {
  return [...demoApplicants]
}

export function updateDemoApplicant(id: string, updates: Partial<Applicant>): Applicant | null {
  const index = demoApplicants.findIndex(a => a.id === id)
  if (index === -1) return null

  demoApplicants[index] = {
    ...demoApplicants[index],
    ...updates,
    updated_at: new Date().toISOString()
  }
  return demoApplicants[index]
}

export function resetDemoData(): void {
  demoApplicants = [...mockApplicants]
}

function generateDemoJobs(): Job[] {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000

  return [
    {
      id: 'job-1',
      created_at: new Date(now - 5 * day).toISOString(),
      updated_at: new Date(now - 2 * day).toISOString(),
      title: 'Commercial Janitorial Technician',
      description: 'We are seeking reliable and detail-oriented janitorial technicians for commercial office buildings in the Baltimore metro area. Responsibilities include floor care, restroom sanitation, trash removal, and general cleaning of common areas. Evening and weekend shifts available.',
      requirements: 'Must be able to lift 30+ lbs. Previous commercial cleaning experience preferred. Reliable transportation required. Background check required.',
      location_city: 'Baltimore',
      location_state: 'MD',
      location_zip: '21201',
      job_type: 'full-time',
      category: 'Janitorial',
      salary_min: 16,
      salary_max: 20,
      salary_type: 'hourly',
      is_active: true,
      featured: true,
      expires_at: new Date(now + 30 * day).toISOString()
    },
    {
      id: 'job-2',
      created_at: new Date(now - 10 * day).toISOString(),
      updated_at: new Date(now - 3 * day).toISOString(),
      title: 'Construction Laborer',
      description: 'Join our team on active commercial construction sites throughout the DC metropolitan area. Tasks include site preparation, material handling, demolition support, and assisting skilled tradespeople. Multiple openings available for immediate start.',
      requirements: 'OSHA 10 certification preferred. Must have steel-toe boots and basic PPE. Ability to work outdoors in various weather conditions. Must pass drug screening.',
      location_city: 'Washington',
      location_state: 'DC',
      location_zip: '20001',
      job_type: 'contract',
      category: 'Construction',
      salary_min: 18,
      salary_max: 25,
      salary_type: 'hourly',
      is_active: true,
      featured: true,
      expires_at: new Date(now + 45 * day).toISOString()
    },
    {
      id: 'job-3',
      created_at: new Date(now - 7 * day).toISOString(),
      updated_at: new Date(now - 1 * day).toISOString(),
      title: 'Warehouse Associate / Forklift Operator',
      description: 'Immediate openings for warehouse associates at a distribution center in Jessup, MD. Duties include receiving and shipping freight, inventory management, order picking, and operating sit-down and stand-up forklifts. First and second shifts available.',
      requirements: 'Valid forklift certification required for operator roles. Must be able to lift up to 50 lbs repeatedly. Previous warehouse experience a plus. Steel-toe boots required.',
      location_city: 'Jessup',
      location_state: 'MD',
      location_zip: '20794',
      job_type: 'full-time',
      category: 'Warehouse & Logistics',
      salary_min: 17,
      salary_max: 22,
      salary_type: 'hourly',
      is_active: true,
      featured: false,
      expires_at: new Date(now + 21 * day).toISOString()
    },
    {
      id: 'job-4',
      created_at: new Date(now - 14 * day).toISOString(),
      updated_at: new Date(now - 5 * day).toISOString(),
      title: 'Facilities Maintenance Technician',
      description: 'Seeking an experienced facilities maintenance technician for a corporate campus in Silver Spring. Responsibilities include preventive maintenance, HVAC filter changes, minor plumbing and electrical repairs, painting, and responding to tenant work orders.',
      requirements: 'Minimum 2 years of building maintenance experience. Knowledge of HVAC, plumbing, and electrical systems. Valid driver\'s license. Must be available for on-call rotation.',
      location_city: 'Silver Spring',
      location_state: 'MD',
      location_zip: '20910',
      job_type: 'full-time',
      category: 'Facilities Maintenance',
      salary_min: 45000,
      salary_max: 55000,
      salary_type: 'annual',
      is_active: true,
      featured: false,
      expires_at: new Date(now + 60 * day).toISOString()
    },
    {
      id: 'job-5',
      created_at: new Date(now - 3 * day).toISOString(),
      updated_at: new Date(now - 1 * day).toISOString(),
      title: 'Administrative Assistant',
      description: 'Our client, a growing property management company in Columbia, MD, is looking for an organized administrative assistant. Duties include answering phones, scheduling appointments, data entry, filing, and supporting the office manager with daily operations.',
      requirements: 'Proficiency in Microsoft Office Suite. Excellent communication skills. High school diploma or equivalent required; associate degree preferred. Bilingual English/Spanish is a plus.',
      location_city: 'Columbia',
      location_state: 'MD',
      location_zip: '21044',
      job_type: 'full-time',
      category: 'Administrative',
      salary_min: 38000,
      salary_max: 45000,
      salary_type: 'annual',
      is_active: true,
      featured: false,
      expires_at: new Date(now + 30 * day).toISOString()
    },
    {
      id: 'job-6',
      created_at: new Date(now - 20 * day).toISOString(),
      updated_at: new Date(now - 15 * day).toISOString(),
      title: 'Part-Time Facilities Coordinator',
      description: 'Part-time facilities coordinator needed for a mixed-use commercial property in Bethesda. Coordinate vendor schedules, manage work orders, conduct building inspections, and ensure compliance with safety regulations. Flexible schedule, 20-25 hours per week.',
      requirements: 'Experience in facilities management or property management. Strong organizational and communication skills. Familiarity with CMMS software a plus. Must be detail-oriented.',
      location_city: 'Bethesda',
      location_state: 'MD',
      location_zip: '20814',
      job_type: 'part-time',
      category: 'Facilities Management',
      salary_min: 22,
      salary_max: 28,
      salary_type: 'hourly',
      is_active: true,
      featured: false,
      expires_at: new Date(now + 14 * day).toISOString()
    }
  ]
}

export const demoJobs = generateDemoJobs()

let demoJobsList = [...demoJobs]

export function getDemoJobs(): Job[] {
  return [...demoJobsList]
}

export function addDemoJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Job {
  const newJob: Job = {
    ...job,
    id: `job-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  demoJobsList = [newJob, ...demoJobsList]
  return newJob
}

export function updateDemoJob(id: string, updates: Partial<Job>): Job | null {
  const index = demoJobsList.findIndex(j => j.id === id)
  if (index === -1) return null

  demoJobsList[index] = {
    ...demoJobsList[index],
    ...updates,
    updated_at: new Date().toISOString()
  }
  return demoJobsList[index]
}

export function deleteDemoJob(id: string): boolean {
  const index = demoJobsList.findIndex(j => j.id === id)
  if (index === -1) return false
  demoJobsList.splice(index, 1)
  return true
}
