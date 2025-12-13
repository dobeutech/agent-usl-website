# Unique Staffing Professionals - Website & Applicant System

A modern, professional staffing agency website with integrated applicant tracking system, admin dashboard, and comprehensive API for HR integrations.

## 🎯 Project Overview

This project delivers a complete website for Unique Staffing Professionals Inc., including:

- **Modernized Website**: Professional UI with responsive design (mobile, tablet, desktop)
- **Applicant System**: Public-facing application form with resume upload
- **Admin Dashboard**: Secure portal to manage applicants with filtering, sorting, and export
- **Supabase Backend**: Scalable database, authentication, and file storage
- **API Documentation**: OpenAPI 3.0 spec for HR system integrations
- **Accessibility Features**: Built-in accessibility controls for users
- **Multi-language Support**: English, Spanish, and French

## ✨ Features

### Public Website
- Professional hero section with clear CTAs
- Services showcase
- Industries served
- Why choose us section
- Client testimonials
- Contact form with SMS/Text capability
- **Job applicant submission form** with resume upload
- **Cookie consent** with GDPR/CCPA compliance
- **Accessibility controls** (font size, contrast, reduced motion, etc.)

### Applicant Submission
- Personal information capture (name, email, phone)
- Email confirmation with verification
- Position and experience details (multi-select)
- Resume/CV upload (PDF, DOC, DOCX up to 5MB)
- Optional cover letter and additional documents
- LinkedIn and portfolio URL support
- **Marketing preferences** (newsletter, job alerts, SMS opt-in)
- **UTM tracking** for referral source attribution
- Form validation and error handling
- Duplicate phone number detection

### Admin Portal
- Secure authentication system (Supabase Auth)
- Dashboard with real-time statistics
- View all applicants in sortable table
- Advanced filtering and search:
  - Search by name, email, or position
  - Filter by application status
  - Filter by position
  - Sort by date or name
- Applicant status management (New, Reviewing, Shortlisted, Rejected, Hired)
- Internal notes system
- Resume download functionality
- Detailed applicant view with all documents
- **CSV Export** for generating candidate lists
- **Analytics Dashboard** with visitor tracking
- **Business Info Manager** for SEO settings

### API & Integrations
- **OpenAPI 3.0 documentation** at `/developers/api/docs`
- Full CRUD for applicants
- Analytics endpoints for visitor data
- Communication preferences management
- Export functionality (CSV/JSON)
- Designed for integration with HR/ATS systems

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unique-staffing-prof
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run all migrations from `supabase/migrations/` in order
   - See detailed setup in `supabase/MIGRATION_DOCUMENTATION.md`

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

6. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Admin Access Setup

### Creating Admin Users

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Click **Add User** → **Create New User**
4. Enter:
   - Email: `admin@yourdomain.com` (or any valid email)
   - Password: Create a strong password (min 8 characters)
5. Click **Create User**
6. *(Optional)* Confirm the email if email verification is enabled
7. Navigate to `/admin/login` on your deployed site
8. Log in with the credentials you created

### Admin Dashboard Features

Once logged in at `/admin/dashboard`, you can:

- **View Applicants**: See all submitted applications in a table
- **Filter & Search**: Filter by status, position; search by name/email
- **Sort**: Sort by date, name (ascending/descending)
- **Update Status**: Change status from New → Reviewing → Shortlisted → Hired/Rejected
- **Add Notes**: Add internal notes visible only to admins
- **Download Resumes**: Download applicant resumes directly
- **Export to CSV**: Generate candidate lists for new contracts
- **View Analytics**: See visitor traffic and conversion data
- **Manage Business Info**: Update SEO and business information

## 🌐 Routes

| Route | Description |
|-------|-------------|
| `/` | Public homepage with application form |
| `/privacy` | Privacy policy |
| `/privacy/sms` | SMS privacy policy |
| `/terms` | Terms of service |
| `/tos` | Redirects to `/terms` |
| `/unsubscribe` | Manage communication preferences |
| `/verify-email` | Email verification handler |
| `/application-confirmation` | Post-submission confirmation |
| `/developers/api/docs` | OpenAPI documentation (Swagger UI) |
| `/openapi/docs` | Alternate API docs route |
| `/admin/login` | Admin login page |
| `/admin/dashboard` | Admin dashboard (protected) |

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix UI)
- **Icons**: Phosphor Icons
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Notifications**: Sonner
- **Form Validation**: React Hook Form + Zod
- **API Docs**: Swagger UI

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui component library
│   ├── admin/                 # Admin dashboard components
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── ApplicantTable.tsx
│   │   ├── ApplicantFilters.tsx
│   │   ├── ApplicantStats.tsx
│   │   └── ApplicantDetailDialog.tsx
│   ├── seo/                   # SEO components
│   ├── AccessibilityControls.tsx  # Accessibility widget
│   ├── CookieConsent.tsx      # GDPR cookie banner
│   ├── EnhancedApplyForm.tsx  # Application form
│   └── ...
├── contexts/
│   ├── AuthContext.tsx        # Supabase auth state
│   ├── LanguageContext.tsx    # i18n (en/es/fr)
│   ├── ThemeProvider.tsx      # Dark/light mode
│   └── BusinessInfoContext.tsx
├── pages/
│   ├── Home.tsx               # Public homepage
│   ├── AdminLogin.tsx         # Admin authentication
│   ├── AdminDashboard.tsx     # Admin panel
│   ├── PrivacyPolicy.tsx      # Privacy policy
│   ├── SMSPrivacyPolicy.tsx   # SMS privacy policy
│   ├── TermsOfService.tsx     # Terms of service
│   ├── OpenAPIDocs.tsx        # API documentation
│   └── Unsubscribe.tsx        # Preference management
├── lib/
│   ├── supabase.ts            # Supabase client + types
│   ├── analytics.ts           # Analytics tracking
│   └── utils.ts               # Utilities
├── locales/
│   └── translations.ts        # i18n translations
└── App.tsx                    # Main app + routing

public/
├── sitemap.xml                # SEO sitemap
├── robots.txt                 # Crawler rules
├── openapi.yaml               # OpenAPI specification
└── logo.webp                  # Company logo

supabase/
├── migrations/                # Database migrations
└── functions/                 # Edge functions
    ├── api/                   # REST API
    ├── send-verification-email/
    └── send-admin-notification/
```

## 📊 Database Schema

### Applicants Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| created_at | timestamp | Application date |
| updated_at | timestamp | Last update |
| full_name | text | Applicant name |
| email | text | Email address |
| email_verified | boolean | Verification status |
| phone | text | Phone number |
| phone_normalized | text | E.164 format |
| positions_interested | text[] | Positions array |
| experience_years | integer | Years of experience |
| resume_url | text | Resume file URL |
| resume_filename | text | Original filename |
| cover_letter | text | Cover letter text |
| linkedin_url | text | LinkedIn profile |
| portfolio_url | text | Portfolio link |
| status | enum | new/reviewing/shortlisted/rejected/hired |
| notes | text | Internal notes |
| newsletter_subscribed | boolean | Newsletter opt-in |
| job_notifications_enabled | boolean | Job alerts opt-in |
| sms_notifications_enabled | boolean | SMS consent |
| communication_preferences | jsonb | UTM/tracking data |
| subscription_source | text | Referral source |
| preferred_language | text | User's selected language (en/es/fr) |
| browser_language | text | Browser detected language |

### Additional Tables
- `visitor_analytics` - Page views and tracking
- `cookie_consent_log` - GDPR consent records
- `newsletter_subscriptions` - Email list management
- `unsubscribe_log` - Unsubscribe audit trail
- `jobs` - Job listings

## 🚢 Deployment (Netlify)

### Automatic Deployment
This project is configured for Netlify deployment. Push to main branch triggers automatic deployment.

### Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod

# Deploy preview
netlify deploy
```

### Environment Variables
Set these in Netlify dashboard (Site Settings > Environment Variables):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type check (not in build) |

## ♿ Accessibility Features

The site includes a built-in accessibility control panel accessible via the accessibility icon (floating button). Users can:

- **Adjust text size** (75% - 200%)
- **Enable high contrast mode**
- **Reduce motion/animations**
- **Use dyslexia-friendly font**
- **Underline all links**
- **Increase click target sizes**
- **Enhance focus highlights**

Settings persist across sessions via localStorage.

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Public can only submit applications
- Authenticated users only can view/manage data
- Private storage for resumes
- Protected admin routes
- Secure session management
- CORS configuration for Edge Functions
- Input validation and sanitization

## 📧 Communication Features

### Email
- Email verification for applications
- Newsletter subscription
- Job opportunity notifications
- Unsubscribe functionality

### SMS
- Opt-in SMS notifications
- SMS privacy policy compliance
- TCPA compliant opt-out

## 🔧 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Supabase Connection Issues
- Verify `.env` variables are correct
- Check Supabase project is active
- Ensure RLS policies are configured

### Admin Login Issues
- Verify admin user is created in Supabase Authentication
- Check email is confirmed
- Clear browser cache/cookies

## 📄 Legal Pages

- **Privacy Policy** (`/privacy`) - Data collection and usage
- **SMS Privacy Policy** (`/privacy/sms`) - Text message specific policy
- **Terms of Service** (`/terms` or `/tos`) - Service terms

## 📚 Additional Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment instructions
- **[supabase/MIGRATION_DOCUMENTATION.md](./supabase/MIGRATION_DOCUMENTATION.md)** - Database setup

## ✅ Project Deliverables

- [x] Website UI revamp and modernization
- [x] Supabase backend setup
- [x] Applicant submission form with file uploads
- [x] Admin login system (Supabase Auth)
- [x] Admin dashboard with sorting, filtering, and status updates
- [x] Resume download functionality
- [x] CSV export for candidate lists
- [x] Marketing opt-in/opt-out (Email, SMS)
- [x] UTM and referral tracking
- [x] OpenAPI documentation
- [x] Accessibility controls
- [x] Mobile-responsive design
- [x] Multi-language support (EN/ES/FR)
- [x] GDPR/CCPA compliant cookie consent
- [x] Sitemap and robots.txt for SEO
- [x] Comprehensive documentation
- [x] Production-ready build
- [x] Security best practices

**Project Status**: ✅ Production Ready

---

Built for Unique Staffing Professionals Inc.
