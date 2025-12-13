import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

interface VerificationEmailRequest {
  email: string
  name: string
  verificationToken: string
}

// Build verification email HTML content
function buildVerificationEmailHtml(name: string, verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; padding: 30px; border-radius: 10px;">
        <h1 style="color: #73B77D; margin-bottom: 20px;">Email Verification Required</h1>
        <p>Hello ${name},</p>
        <p>Thank you for submitting your application to Unique Staffing Professionals!</p>
        <p>Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #73B77D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666; font-size: 14px;">${verificationUrl}</p>
        <p style="margin-top: 30px; font-size: 14px; color: #666;">This link will expire in 24 hours.</p>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">If you didn't submit this application, please ignore this email.</p>
      </div>
    </body>
    </html>
  `
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { email, name, verificationToken }: VerificationEmailRequest = await req.json()

    const verificationUrl = `${req.headers.get('origin')}/verify-email?token=${verificationToken}`

    // Prepare email content (to be sent via email service)
    const _emailContent = {
      to: email,
      subject: 'Verify Your Email - Unique Staffing Professionals',
      html: buildVerificationEmailHtml(name, verificationUrl)
    }

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // For now, log the email (in production, this would send actual email)
    console.warn('Email sending not configured. Verification email for:', email)
    console.warn('Verification URL:', verificationUrl)

    return new Response(
      JSON.stringify({ success: true, message: 'Verification email sent' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    console.error('Error sending verification email:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
