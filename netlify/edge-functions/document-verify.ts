import type { Config, Context } from "@netlify/edge-functions";

/**
 * Document Verification Edge Function
 * Validates uploaded files for type, size, and content integrity before processing
 * 
 * Features:
 * - File signature (magic bytes) validation
 * - MIME type verification
 * - File size enforcement
 * - Malicious content detection patterns
 */

// Allowed file types and their configurations
const ALLOWED_FILE_TYPES: Record<string, {
  mimeTypes: string[];
  maxSizeMB: number;
  signatures: number[][];
}> = {
  // Documents
  'pdf': {
    mimeTypes: ['application/pdf'],
    maxSizeMB: 5,
    signatures: [[0x25, 0x50, 0x44, 0x46]] // %PDF
  },
  'doc': {
    mimeTypes: ['application/msword'],
    maxSizeMB: 5,
    signatures: [[0xD0, 0xCF, 0x11, 0xE0]] // OLE compound document
  },
  'docx': {
    mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSizeMB: 5,
    signatures: [[0x50, 0x4B, 0x03, 0x04]] // PK (ZIP format)
  },
  // Images (for additional documents)
  'jpg': {
    mimeTypes: ['image/jpeg'],
    maxSizeMB: 10,
    signatures: [[0xFF, 0xD8, 0xFF]]
  },
  'jpeg': {
    mimeTypes: ['image/jpeg'],
    maxSizeMB: 10,
    signatures: [[0xFF, 0xD8, 0xFF]]
  },
  'png': {
    mimeTypes: ['image/png'],
    maxSizeMB: 10,
    signatures: [[0x89, 0x50, 0x4E, 0x47]] // PNG signature
  }
};

// Suspicious patterns to detect potentially malicious content
const SUSPICIOUS_PATTERNS = [
  /<%[^>]*script/i,           // ASP script injection
  /<script[^>]*>/i,           // HTML script tags
  /javascript:/i,             // JavaScript protocol
  /vbscript:/i,               // VBScript protocol
  /on\w+\s*=/i,              // Event handlers
  /data:text\/html/i,         // Data URI HTML
  /__proto__/i,               // Prototype pollution
  /eval\s*\(/i,              // Eval calls
];

interface VerificationResult {
  valid: boolean;
  error?: string;
  details?: {
    filename: string;
    extension: string;
    contentType: string;
    size: number;
    sizeFormatted: string;
    signatureValid: boolean;
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

function validateFileSignature(extension: string, bytes: Uint8Array): boolean {
  const config = ALLOWED_FILE_TYPES[extension];
  if (!config || !config.signatures || config.signatures.length === 0) {
    return true; // No signature check for this type
  }

  return config.signatures.some(signature => {
    // Ensure the buffer has enough bytes for signature validation
    if (bytes.length < signature.length) {
      return false;
    }
    for (let i = 0; i < signature.length; i++) {
      if (bytes[i] !== signature[i]) return false;
    }
    return true;
  });
}

function checkSuspiciousContent(content: string): boolean {
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(content));
}

async function validateDocument(
  filename: string,
  contentType: string,
  arrayBuffer: ArrayBuffer,
  bucket: string
): Promise<VerificationResult> {
  const extension = getExtension(filename);
  const bytes = new Uint8Array(arrayBuffer);
  const size = arrayBuffer.byteLength;

  // Check if extension is allowed
  const config = ALLOWED_FILE_TYPES[extension];
  if (!extension || !config) {
    return {
      valid: false,
      error: `File type '.${extension || 'unknown'}' is not allowed. Allowed types: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`
    };
  }

  // Check MIME type matches extension
  if (!config.mimeTypes.includes(contentType.toLowerCase())) {
    return {
      valid: false,
      error: `Content type '${contentType}' does not match file extension '.${extension}'`
    };
  }

  // Check file size
  const maxBytes = config.maxSizeMB * 1024 * 1024;
  if (size > maxBytes) {
    return {
      valid: false,
      error: `File size (${formatBytes(size)}) exceeds maximum allowed size (${formatBytes(maxBytes)})`
    };
  }

  if (size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    };
  }

  // Validate file signature (magic bytes)
  const signatureValid = validateFileSignature(extension, bytes);
  if (!signatureValid) {
    return {
      valid: false,
      error: `File content does not match expected format for '.${extension}' files. The file may be corrupted or misnamed.`
    };
  }

  // Check for suspicious content in text-based parts (first 10KB)
  const textContent = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 10240));
  if (checkSuspiciousContent(textContent)) {
    return {
      valid: false,
      error: 'File contains potentially malicious content'
    };
  }

  // Check bucket is allowed
  const allowedBuckets = ['resumes', 'documents'];
  if (!allowedBuckets.includes(bucket)) {
    return {
      valid: false,
      error: `Upload to bucket '${bucket}' is not allowed`
    };
  }

  return {
    valid: true,
    details: {
      filename,
      extension,
      contentType,
      size,
      sizeFormatted: formatBytes(size),
      signatureValid
    }
  };
}

export default async function handler(request: Request, context: Context): Promise<Response | void> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info",
  };

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only handle POST requests to verify endpoint
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/.netlify/edge-functions/document-verify')) {
    return context.next();
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ valid: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const contentType = request.headers.get('content-type') || '';

    // Handle multipart form data (actual file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const bucket = formData.get('bucket') as string || 'resumes';

      if (!file) {
        return new Response(
          JSON.stringify({ valid: false, error: "No file provided" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const result = await validateDocument(file.name, file.type, arrayBuffer, bucket);

      return new Response(
        JSON.stringify(result),
        {
          status: result.valid ? 200 : 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle JSON request (metadata validation only)
    if (contentType.includes('application/json')) {
      // Parse JSON with validation
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return new Response(
          JSON.stringify({
            valid: false,
            error: "Invalid JSON payload"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Validate body is an object
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: "Request body must be a JSON object"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { filename, contentType: fileContentType, size, bucket, fileSignature } = body as Record<string, unknown>;

      // Validate required fields exist and have correct types
      if (
        typeof filename !== 'string' ||
        typeof fileContentType !== 'string' ||
        typeof size !== 'number' ||
        typeof bucket !== 'string'
      ) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: "Missing or invalid required fields: filename (string), contentType (string), size (number), bucket (string)"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Validate fileSignature if provided
      if (fileSignature !== undefined && !Array.isArray(fileSignature)) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: "fileSignature must be an array of numbers"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const extension = getExtension(filename);
      const config = ALLOWED_FILE_TYPES[extension];

      // Basic metadata validation
      if (!extension || !config) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: `File type '.${extension || 'unknown'}' is not allowed`
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!config.mimeTypes.includes(fileContentType.toLowerCase())) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: `Content type '${fileContentType}' does not match file extension '.${extension}'`
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const maxBytes = config.maxSizeMB * 1024 * 1024;
      if (size > maxBytes) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: `File size exceeds maximum allowed size (${formatBytes(maxBytes)})`
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Reject empty files (mirroring multipart validation)
      if (size === 0) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: 'File is empty'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Enforce allowed buckets (same as multipart validation)
      const allowedBuckets = ['resumes', 'documents'];
      if (!allowedBuckets.includes(bucket)) {
        return new Response(
          JSON.stringify({
            valid: false,
            error: `Upload to bucket '${bucket}' is not allowed`
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Validate file signature if provided
      let signatureValid = true;
      if (fileSignature && Array.isArray(fileSignature) && fileSignature.length > 0) {
        signatureValid = validateFileSignature(extension, new Uint8Array(fileSignature));
        if (!signatureValid) {
          return new Response(
            JSON.stringify({
              valid: false,
              error: `File content does not match expected format for '.${extension}' files`
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      return new Response(
        JSON.stringify({
          valid: true,
          details: {
            filename,
            extension,
            contentType: fileContentType,
            size,
            sizeFormatted: formatBytes(size),
            signatureValid
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ valid: false, error: "Unsupported content type" }),
      {
        status: 415,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Document verification error:", error);
    return new Response(
      JSON.stringify({
        valid: false,
        error: "Internal verification error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

export const config: Config = {
  path: "/.netlify/edge-functions/document-verify",
  method: ["POST", "OPTIONS"],
};
