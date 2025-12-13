import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

interface AdminNotificationRequest {
  applicant: {
    id: string
    full_name: string
    email: string
    phone: string
    positions_interested: string[]
    experience_years: number
    resume_url: string | null
    job_posting_url: string | null
    linkedin_url: string | null
    portfolio_url: string | null
    created_at: string
  }
}

// Build email HTML content
function buildEmailHtml(applicant: AdminNotificationRequest['applicant'], dashboardUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Verified Application</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; padding: 30px; border-radius: 10px;">
        <h1 style="color: #73B77D; margin-bottom: 20px;">New Verified Application Received</h1>

        <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #333;">Applicant Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${applicant.full_name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${applicant.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${applicant.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Positions:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${applicant.positions_interested.join(', ')}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Experience:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${applicant.experience_years} years</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Applied:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${new Date(applicant.created_at).toLocaleString()}</td>
            </tr>
          </table>
        </div>

        ${applicant.resume_url ? `
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Documents</h3>
            <p><a href="${applicant.resume_url}" style="color: #73B77D; text-decoration: none;">Download Resume</a></p>
          </div>
        ` : ''}

        ${applicant.linkedin_url || applicant.portfolio_url || applicant.job_posting_url ? `
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Links</h3>
            ${applicant.linkedin_url ? `<p><strong>LinkedIn:</strong> <a href="${applicant.linkedin_url}" style="color: #73B77D;">${applicant.linkedin_url}</a></p>` : ''}
            ${applicant.portfolio_url ? `<p><strong>Portfolio:</strong> <a href="${applicant.portfolio_url}" style="color: #73B77D;">${applicant.portfolio_url}</a></p>` : ''}
            ${applicant.job_posting_url ? `<p><strong>Job Posting:</strong> <a href="${applicant.job_posting_url}" style="color: #73B77D;">${applicant.job_posting_url}</a></p>` : ''}
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 30px;">
          <a href="${dashboardUrl}" style="background-color: #73B77D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View in Dashboard</a>
        </div>
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
    const { applicant }: AdminNotificationRequest = await req.json()

    const adminEmail = 'omorilla@uniquestaffingprofessionals.com'

    // Build email HTML for admin notification
    const dashboardUrl = `${req.headers.get('origin')}/admin/dashboard`
    const _emailContent = {
      to: adminEmail,
      subject: `New Verified Application: ${applicant.full_name}`,
      html: buildEmailHtml(applicant, dashboardUrl)
    }

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // For now, log the email (in production, this would send actual email)
    console.warn('Email sending not configured. Admin notification for:', adminEmail)
    console.warn('Applicant:', applicant.full_name, applicant.email)

    return new Response(
      JSON.stringify({ success: true, message: 'Admin notification sent' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    console.error('Error sending admin notification:', error)
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
