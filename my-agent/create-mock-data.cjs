const fs = require('fs');
const path = require('path');

const mockDataContent = `// Mock data for demo mode when Supabase is not configured
import type { Applicant } from './supabase'

// Check if we're in demo mode (no Supabase configured)
export function isDemoMode(): boolean {
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
      positions_interested: ['Customer Service Representative', 'Call Center Agent'],
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
`;

const targetPath = path.resolve(__dirname, '..', 'src', 'lib', 'mockData.ts');
fs.writeFileSync(targetPath, mockDataContent);
console.log('Created mockData.ts at:', targetPath);
