import { supabase } from './supabase'
import { isDemoMode, getDemoApplicants, updateDemoApplicant } from './mockData'

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

  // In demo mode, check against mock data
  if (isDemoMode()) {
    const demoApplicants = getDemoApplicants()
    const matchingApplicant = demoApplicants.find(
      applicant => normalizePhone(applicant.phone) === normalized ||
                   (applicant.phone_normalized && applicant.phone_normalized.replace(/[^0-9]/g, '') === normalized)
    )

    if (matchingApplicant) {
      return {
        exists: true,
        applicant: {
          id: matchingApplicant.id,
          full_name: matchingApplicant.full_name,
          email: matchingApplicant.email,
          created_at: matchingApplicant.created_at,
          email_verified: matchingApplicant.email_verified
        }
      }
    }
    return { exists: false, applicant: null }
  }

  // Live Supabase mode
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
 * Reads the first bytes of a file to get its signature (magic bytes)
 * @param file - The file to read
 * @param numBytes - Number of bytes to read (default 8)
 * @returns Array of byte values (empty array for empty files)
 */
export async function getFileSignature(file: File, numBytes: number = 8): Promise<number[]> {
  // Handle empty files
  if (file.size === 0) {
    return []
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Handle null result case
      if (reader.result === null) {
        resolve([])
        return
      }
      const arrayBuffer = reader.result as ArrayBuffer
      const bytes = new Uint8Array(arrayBuffer)
      resolve(Array.from(bytes))
    }
    reader.onerror = () => reject(reader.error)
    // Read only up to the available bytes or numBytes, whichever is smaller
    reader.readAsArrayBuffer(file.slice(0, Math.min(numBytes, file.size)))
  })
}

/**
 * Server-side document verification using Netlify edge function
 * Validates file type, size, and content integrity
 * @param file - The file to verify
 * @param bucket - The target storage bucket
 * @returns Verification result with details or error
 */
export async function verifyDocumentServerSide(
  file: File,
  bucket: string = 'resumes'
): Promise<{
  valid: boolean
  error?: string
  details?: {
    filename: string
    extension: string
    contentType: string
    size: number
    sizeFormatted: string
    signatureValid: boolean
  }
}> {
  // In demo mode, perform client-side validation only
  if (isDemoMode()) {
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
    
    if (!allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File type '.${extension}' is not allowed`
      }
    }

    const maxSize = bucket === 'resumes' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed (${bucket === 'resumes' ? '5MB' : '10MB'})`
      }
    }

    return {
      valid: true,
      details: {
        filename: file.name,
        extension,
        contentType: file.type,
        size: file.size,
        sizeFormatted: formatBytes(file.size),
        signatureValid: true
      }
    }
  }

  try {
    // Get file signature for server-side validation
    const fileSignature = await getFileSignature(file)

    // Call Netlify edge function for validation
    const response = await fetch('/.netlify/edge-functions/document-verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        size: file.size,
        bucket,
        fileSignature
      })
    })

    // Check if response is valid JSON before parsing
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Edge function returned non-JSON response, falling back to client-side validation')
      return performClientSideValidation(file, bucket)
    }

    // Handle non-2xx responses gracefully
    const result = await response.json()
    
    // Even non-200 responses from the edge function contain valid JSON with error info
    // so we can return them directly
    return result

  } catch (error) {
    console.error('Document verification error:', error)
    
    // Fallback to client-side validation if edge function fails
    return performClientSideValidation(file, bucket)
  }
}

/**
 * Fallback client-side validation when edge function is unavailable
 */
function performClientSideValidation(
  file: File,
  bucket: string
): {
  valid: boolean
  error?: string
  details?: {
    filename: string
    extension: string
    contentType: string
    size: number
    sizeFormatted: string
    signatureValid: boolean
  }
} {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
  
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File type '.${extension}' is not allowed. Allowed: ${allowedExtensions.join(', ')}`
    }
  }

  const maxSize = bucket === 'resumes' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed (${bucket === 'resumes' ? '5MB' : '10MB'})`
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    }
  }

  return {
    valid: true,
    details: {
      filename: file.name,
      extension,
      contentType: file.type,
      size: file.size,
      sizeFormatted: formatBytes(file.size),
      signatureValid: true // Assumed true for client-side fallback
    }
  }
}

/**
 * Formats bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Uploads a file to Supabase storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path within bucket
 * @returns Object containing path and filename, or null on error
 */
export async function uploadFile(
  file: File,
  bucket: string,
  folder?: string
): Promise<{ path: string; filename: string } | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // In demo mode, simulate file upload with a mock URL
    if (isDemoMode()) {
      // Create a blob URL for demo purposes (file is stored in browser memory)
      // Note: blob URL is created but not stored as it's not needed in demo mode
      URL.createObjectURL(file)
      return {
        path: `demo://storage/${bucket}/${filePath}`,
        filename: file.name
      }
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    // Return the storage path instead of public URL
    // Signed URLs will be generated on demand by the admin dashboard
    return { path: filePath, filename: file.name }
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
  // In demo mode, check against mock data tokens
  if (isDemoMode()) {
    const demoApplicants = getDemoApplicants()
    const matchingApplicant = demoApplicants.find(
      applicant => applicant.email_verification_token === token
    )

    if (!matchingApplicant) {
      return { valid: false, email: null, applicantId: null }
    }

    // Check if already verified
    if (matchingApplicant.email_verified) {
      return {
        valid: true,
        email: matchingApplicant.email,
        applicantId: matchingApplicant.id
      }
    }

    // Check if token has expired
    if (matchingApplicant.token_expiry) {
      const expiry = new Date(matchingApplicant.token_expiry)
      if (expiry < new Date()) {
        return { valid: false, email: null, applicantId: null }
      }
    }

    // Mark as verified in demo mode
    updateDemoApplicant(matchingApplicant.id, {
      email_verified: true,
      email_confirmed: new Date().toISOString(),
      email_verification_token: null,
      token_expiry: null
    })

    return {
      valid: true,
      email: matchingApplicant.email,
      applicantId: matchingApplicant.id
    }
  }

  // Live Supabase mode
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
