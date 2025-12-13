import { supabase } from './supabase'

/**
 * Normalizes a phone number by removing all non-numeric characters
 * @param phone - The phone number to normalize
 * @returns Normalized phone number containing only digits
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '')
}

/**
 * Checks if a phone number already exists in the database
 * @param phone - The phone number to check
 * @returns Object containing exists flag and applicant data if found
 */
export async function checkPhoneDuplicate(phone: string): Promise<{
  exists: boolean
  applicant: { id: string; full_name: string; email: string; created_at: string; email_verified: boolean } | null
}> {
  const normalized = normalizePhone(phone)

  const { data, error } = await supabase
    .from('applicants')
    .select('id, full_name, email, created_at, email_verified')
    .eq('phone_normalized', normalized)
    .maybeSingle()

  if (error) {
    console.error('Error checking phone duplicate:', error)
    return { exists: false, applicant: null }
  }

  return { exists: !!data, applicant: data }
}

/**
 * Generates a secure random token for email verification
 * @returns A URL-safe random token string
 */
export function generateVerificationToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Calculates token expiry time (24 hours from now)
 * @returns ISO string of expiry time
 */
export function getTokenExpiry(): string {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + 24)
  return expiry.toISOString()
}

/**
 * Validates if a string is a properly formatted URL
 * @param url - The URL string to validate
 * @returns True if valid URL, false otherwise
 */
export function validateUrl(url: string): boolean {
  if (!url || url.trim() === '') return true // Empty is valid (optional field)

  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validates if a URL is a LinkedIn profile
 * @param url - The URL to validate
 * @returns True if valid LinkedIn URL, false otherwise
 */
export function validateLinkedInUrl(url: string): boolean {
  if (!url || url.trim() === '') return true // Empty is valid (optional field)

  if (!validateUrl(url)) return false

  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    return hostname === 'linkedin.com' ||
           hostname === 'www.linkedin.com' ||
           hostname.endsWith('.linkedin.com')
  } catch {
    return false
  }
}

/**
 * Validates file type for document uploads
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns True if valid file type, false otherwise
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Validates file size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum allowed size in megabytes
 * @returns True if file size is within limits, false otherwise
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}

/**
 * Uploads a file to Supabase storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path within bucket
 * @returns Object containing URL and filename, or null on error
 */
export async function uploadFile(
  file: File,
  bucket: string,
  folder?: string
): Promise<{ url: string; filename: string } | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return { url: publicUrl, filename: file.name }
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

/**
 * Stores email verification token and creates log entry
 * @param email - Email address to verify
 * @param token - Verification token
 * @param applicantId - Optional applicant ID if already created
 * @returns Success status
 */
export async function createEmailVerificationLog(
  email: string,
  token: string,
  applicantId?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('email_verification_log')
      .insert([{
        applicant_id: applicantId || null,
        email,
        token,
        sent_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Error creating verification log:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error creating verification log:', error)
    return false
  }
}

/**
 * Verifies an email verification token
 * @param token - The verification token to check
 * @returns Object with verification status and email
 */
export async function verifyEmailToken(token: string): Promise<{
  valid: boolean
  email: string | null
  applicantId: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('email_verification_log')
      .select('email, applicant_id, verified_at')
      .eq('token', token)
      .maybeSingle()

    if (error || !data) {
      return { valid: false, email: null, applicantId: null }
    }

    // Check if already verified
    if (data.verified_at) {
      return { valid: true, email: data.email, applicantId: data.applicant_id }
    }

    // Mark as verified
    await supabase
      .from('email_verification_log')
      .update({ verified_at: new Date().toISOString() })
      .eq('token', token)

    return { valid: true, email: data.email, applicantId: data.applicant_id }
  } catch (error) {
    console.error('Error verifying token:', error)
    return { valid: false, email: null, applicantId: null }
  }
}
