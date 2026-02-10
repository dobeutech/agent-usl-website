import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);
const PORT = 3001;
const TO_EMAIL = 'Omorilla@uniquestaffingprofessionals.com';
const FROM_EMAIL = 'onboarding@resend.dev';

app.use(cors());
app.use(express.json());

app.post('/api/application-notification', async (req, res) => {
  try {
    const { fullName, email, phone, position, experienceYears } = req.body;

    if (!fullName || !email || !position) {
      return res.status(400).json({ success: false, error: 'Missing required fields: fullName, email, position' });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Job Application: ${fullName} - ${position}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Job Application</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Full Name:</td>
              <td style="padding: 8px 12px;">${fullName}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Email:</td>
              <td style="padding: 8px 12px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Phone:</td>
              <td style="padding: 8px 12px;">${phone || 'Not provided'}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Position:</td>
              <td style="padding: 8px 12px;">${position}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Experience (Years):</td>
              <td style="padding: 8px 12px;">${experienceYears ?? 'Not provided'}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">This notification was sent from the Unique Staffing Professionals website.</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Application notification error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to send application notification' });
  }
});

app.post('/api/chat-notification', async (req, res) => {
  try {
    const { visitorName, message, conversationId } = req.body;

    if (!visitorName || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields: visitorName, message' });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Chat Message from ${visitorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Chat Message</h2>
          <p><strong>From:</strong> ${visitorName}</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #1f2937;">${message}</p>
          </div>
          ${conversationId ? `<p style="color: #6b7280; font-size: 14px;">Conversation ID: ${conversationId}</p>` : ''}
          <p style="margin-top: 20px;">
            <a href="https://uniquestaffingprofessionals.com/admin" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Admin Dashboard</a>
          </p>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">This notification was sent from the Unique Staffing Professionals website.</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Chat notification error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to send chat notification' });
  }
});

app.post('/api/contact-notification', async (req, res) => {
  try {
    const { name, email, phone, message, type } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, email, message' });
    }

    const inquiryType = type || 'General';

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New ${inquiryType} Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New ${inquiryType} Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Name:</td>
              <td style="padding: 8px 12px;">${name}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Email:</td>
              <td style="padding: 8px 12px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Phone:</td>
              <td style="padding: 8px 12px;">${phone || 'Not provided'}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Inquiry Type:</td>
              <td style="padding: 8px 12px;">${inquiryType}</td>
            </tr>
          </table>
          <div style="margin-top: 16px;">
            <h3 style="color: #374151;">Message:</h3>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px;">
              <p style="margin: 0; color: #1f2937;">${message}</p>
            </div>
          </div>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">This notification was sent from the Unique Staffing Professionals website.</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Contact notification error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to send contact notification' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
