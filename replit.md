# Unique Staffing Professionals Inc. - Website

## Overview
Professional staffing agency website for Unique Staffing Professionals Inc. based in Riverdale, MD. Built with React, TypeScript, Vite, and Tailwind CSS v4. Originally a GitHub Spark project, adapted for Replit. Includes admin portal with applicant management, live chat, job postings management, and email notifications via Resend.

## Recent Changes
- 2026-02-10: Added live chat system with ChatContext (localStorage persistence), LiveChatAdmin component in admin portal, and LiveChat.tsx integration with email alerts via Resend.
- 2026-02-10: Added JobPostingsManager for admin portal CRUD operations on job listings with demo mode data.
- 2026-02-10: Created Express backend server (port 3001) with Resend email integration for application, chat, and contact notifications to Omorilla@uniquestaffingprofessionals.com.
- 2026-02-10: Vite proxy configured to forward /api requests to Express backend. Frontend and backend run together via `npm run dev`.
- 2026-02-10: Admin dashboard now has 5 tabs: Applicants, Live Chat, Job Postings, Analytics, Business Info & SEO.
- 2026-02-10: Supabase production-readiness optimization completed. All 16 Supabase-dependent components now have demo mode guards.
- 2026-02-10: Initial import from GitHub. Configured Vite for Replit (port 5000, host 0.0.0.0, allowedHosts). Set up demo mode via `VITE_FORCE_DEMO_MODE=true`.

## Project Architecture
- **Frontend**: React 19 + TypeScript + Vite 6 + Tailwind CSS v4
- **Backend API**: Express server (port 3001) with Resend email integration
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **State Management**: React Context (Auth, BusinessInfo, Language, Theme, Chat)
- **Database**: Supabase (external) - currently in demo mode with mock data
- **Routing**: react-router-dom v7
- **Animations**: Framer Motion, Three.js (VideoHero)
- **Icons**: Phosphor Icons, Lucide React
- **i18n**: Custom language context (en, es, fr)
- **Email**: Resend API for notifications (RESEND_API_KEY secret)

## Key Files
- `src/App.tsx` - Main app with routing and providers (Auth, Chat, BusinessInfo, Theme, Language)
- `src/pages/Home.tsx` - Landing page
- `src/pages/AdminDashboard.tsx` - Admin portal with 5 tabs (Applicants, Live Chat, Job Postings, Analytics, Business Info)
- `src/lib/mockData.ts` - Demo mode data and utilities (applicants + jobs)
- `src/lib/supabase.ts` - Supabase client configuration
- `src/contexts/ChatContext.tsx` - Chat state management with localStorage persistence
- `src/contexts/AuthContext.tsx` - Authentication with demo mode credentials
- `src/components/LiveChat.tsx` - Frontend chat widget using ChatContext
- `src/components/admin/LiveChatAdmin.tsx` - Admin chat management panel
- `src/components/admin/JobPostingsManager.tsx` - Job CRUD admin component
- `src/components/JobListings.tsx` - Public job listings (uses demo data in demo mode)
- `src/components/EnhancedApplyForm.tsx` - Application form with email notification
- `server/index.ts` - Express API server for Resend email notifications
- `vite.config.ts` - Vite config with Tailwind CSS v4 plugin and API proxy

## Environment Variables
- `VITE_FORCE_DEMO_MODE` - Set to `true` to run in demo mode (no Supabase required)
- `VITE_SUPABASE_URL` - Supabase project URL (optional in demo mode)
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key (optional in demo mode)
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional)
- `RESEND_API_KEY` - Resend API key for email notifications (server-side secret)

## Admin Portal
- **Login**: Omorilla@uniquestaffingprofessionals.com / USP@dmin2026! (case-insensitive)
- **Tabs**: Applicants, Live Chat (with unread badge), Job Postings (CRUD), Analytics, Business Info & SEO
- **Demo mode**: All admin features work with mock data when VITE_FORCE_DEMO_MODE=true

## Email Notifications (Resend)
- POST /api/application-notification - New job application alerts
- POST /api/chat-notification - New chat message alerts
- POST /api/contact-notification - General inquiry alerts
- All emails sent to Omorilla@uniquestaffingprofessionals.com from onboarding@resend.dev

## Supabase Production Readiness
All components with Supabase calls are guarded by `isDemoMode()` from `src/lib/mockData.ts`. When `VITE_FORCE_DEMO_MODE=true` or Supabase credentials are missing, all features work with local mock data. To switch to production Supabase:
1. Set `VITE_FORCE_DEMO_MODE` to `false` (or remove it)
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Create required Supabase tables: `applicants`, `email_verification_log`, `newsletter_subscriptions`, `business_info`, `jobs`
4. Create Supabase storage bucket: `resumes`

### Demo Mode Guarded Components (17+ total)
- Auth: `AuthContext.tsx`
- Data: `BusinessInfoContext.tsx`, `AdminDashboard.tsx`, `AnalyticsDashboard.tsx`, `BusinessInfoManager.tsx`
- Forms: `EnhancedApplyForm.tsx`, `ApplyForm.tsx`, `JobAlerts.tsx`
- Utilities: `form-utils.ts` (submitApplication, uploadFile, createEmailVerificationLog, verifyEmailToken)
- Pages: `AdminLogin.tsx`, `EmailVerification.tsx`, `Unsubscribe.tsx`, `ServiceAreaPage.tsx`
- Analytics: `analytics.ts`
- Listings: `JobListings.tsx`, `JobPostingsManager.tsx`

### Security Features
- Token expiry validation (24 hours) for email verification
- Supabase auth: autoRefreshToken, persistSession, detectSessionInUrl
- Custom `x-application-name` header for request tracking
- No blob URL memory leaks in demo file uploads
- Server-side API key handling for Resend (never exposed to client)

## User Preferences
- None recorded yet
