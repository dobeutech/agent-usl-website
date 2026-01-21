import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

// Allowed file types and their MIME types
const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  // Documents
  'pdf': ['application/pdf'],
  'doc': ['application/msword'],
  'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  // Images (for profile photos if needed)
  'jpg': ['image/jpeg'],
  'jpeg': ['image/jpeg'],
  'png': ['image/png'],
}

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// File signature (magic bytes) validation
const FILE_SIGNATURES: Record<string, number[][]> = {
  'pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'doc': [[0xD0, 0xCF, 0x11, 0xE0]], // OLE compound document
  'docx': [[0x50, 0x4B, 0x03, 0x04]], // PK (ZIP format)
  'jpg': [[0xFF, 0xD8, 0xFF]],
  'jpeg': [[0xFF, 0xD8, 0xFF]],
  'png': [[0x89, 0x50, 0x4E, 0x47]], // PNG signature
}

interface ValidationRequest {
  filename: string
  contentType: string
  size: number
  bucket: string
  // Optional: first bytes of file for signature validation
  fileSignature?: number[]
}

interface ValidationResponse {
  valid: boolean
  error?: string
  details?: {
    filename: string
    extension: string
    contentType: string
    size: number
    sizeFormatted: string
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

function validateFileType(extension: string, contentType: string): boolean {
  const allowedMimes = ALLOWED_FILE_TYPES[extension]
  if (!allowedMimes) return false
  return allowedMimes.includes(contentType.toLowerCase())
}

function validateFileSignature(extension: string, signature: number[]): boolean {
  const expectedSignatures = FILE_SIGNATURES[extension]
  if (!expectedSignatures) return true // No signature check for this type

  return expectedSignatures.some(expected => {
    for (let i = 0; i < expected.length; i++) {
      if (signature[i] !== expected[i]) return false
    }
    return true
  })
}

function validateUpload(request: ValidationRequest): ValidationResponse {
  const { filename, contentType, size, bucket, fileSignature } = request
  const extension = getExtension(filename)

  // Check if extension is allowed
  if (!extension || !ALLOWED_FILE_TYPES[extension]) {
    return {
      valid: false,
      error: `File type '.${extension || 'unknown'}' is not allowed. Allowed types: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`
    }
  }

  // Check MIME type matches extension
  if (!validateFileType(extension, contentType)) {
    return {
      valid: false,
      error: `Content type '${contentType}' does not match file extension '.${extension}'`
    }
  }

  // Check file size
  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size (${formatBytes(size)}) exceeds maximum allowed size (${formatBytes(MAX_FILE_SIZE)})`
    }
  }

  if (size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    }
  }

  // Validate file signature if provided
  if (fileSignature && fileSignature.length > 0) {
    if (!validateFileSignature(extension, fileSignature)) {
      return {
        valid: false,
        error: `File content does not match expected format for '.${extension}' files. The file may be corrupted or misnamed.`
      }
    }
  }

  // Check bucket is allowed
  const allowedBuckets = ['resumes', 'documents']
  if (!allowedBuckets.includes(bucket)) {
    return {
      valid: false,
      error: `Upload to bucket '${bucket}' is not allowed`
    }
  }

  return {
    valid: true,
    details: {
      filename,
      extension,
      contentType,
      size,
      sizeFormatted: formatBytes(size)
    }
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }

  try {
    const body: ValidationRequest = await req.json()

    // Validate required fields
    if (!body.filename || !body.contentType || body.size === undefined || !body.bucket) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Missing required fields: filename, contentType, size, bucket"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const result = validateUpload(body)

    return new Response(
      JSON.stringify(result),
      {
        status: result.valid ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )

  } catch (error) {
    console.error("Validation error:", error)
    return new Response(
      JSON.stringify({
        valid: false,
        error: "Internal validation error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
