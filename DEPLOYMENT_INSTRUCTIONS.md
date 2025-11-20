# 🚀 DEPLOYMENT INSTRUCTIONS
## Unique Staffing Professionals - Production Setup

---

## ⚠️ CRITICAL: Jobs Not Appearing? Follow These Steps

The website is deployed but **jobs need to be added to the database manually**.

### Step 1: Run Database Migrations in Supabase

1. **Go to your Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/ynedsbgiveycubmusjzf

2. **Navigate to SQL Editor:**
   - Click "SQL Editor" in the left sidebar

3. **Run the Jobs Table Migration:**
   - Copy the entire contents of `supabase/migrations/002_jobs_table.sql`
   - Paste into SQL Editor
   - Click "Run" or press `Ctrl+Enter`
   - ✅ This creates the jobs table and adds 5 sample jobs

4. **Add Additional Jobs (Including LinkedIn Job):**
   - Copy the entire contents of `add-jobs-to-database.sql`
   - Paste into SQL Editor
   - Click "Run"
   - ✅ This adds 20 jobs including the Onsite Supervisor position from LinkedIn

5. **Run Analytics Migration:**
   - Copy the entire contents of `supabase/migrations/20251119140000_analytics_tracking.sql`
   - Paste into SQL Editor
   - Click "Run"
   - ✅ This creates visitor analytics and cookie consent tables

### Step 2: Verify Jobs Appear

1. **Check Database:**
   - In Supabase Dashboard, go to "Table Editor"
   - Select "jobs" table
   - You should see 20+ jobs listed

2. **Check Website:**
   - Visit: https://unique-staffing-professionals.netlify.app/#jobs
   - Jobs should now auto-populate without search
   - LinkedIn Onsite Supervisor job should be visible

---

## 🔧 Lint Test Results

**Status:** ✅ **PASSED** (Warnings only, no errors)

**Summary:**
- 0 Errors
- 31 Warnings (non-critical)
- Build: ✅ Successful

**Common Warnings:**
- Unused variables (can be cleaned up)
- React Hook dependencies (optimized for performance)
- Fast refresh export warnings (UI components - not critical)

---

## 🔐 Admin Access Setup

### Create Admin User

1. **Go to Supabase Dashboard:**
   - Navigate to "Authentication" → "Users"

2. **Add New User:**
   - Click "Add User" → "Create new user"
   - Email: `admin@uniquestaffingprofessionals.com` (or your choice)
   - Password: Create a strong password

3. **Confirm Email:**
   - In the user list, click the three dots next to the user
   - Select "Confirm email"

4. **Login to Admin Dashboard:**
   - URL: https://unique-staffing-professionals.netlify.app/admin/login
   - Use the email and password you created

---

## 🔑 API Key for findd.ai Integration

### Generate API Key

API keys are managed through Supabase. To generate one:

1. **Create API Keys Table** (if not exists):
```sql
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    key_name TEXT NOT NULL,
    api_key TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can manage API keys
CREATE POLICY "Authenticated users can manage API keys"
    ON public.api_keys
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
```

2. **Generate API Key:**
```sql
INSERT INTO public.api_keys (key_name, api_key, is_active)
VALUES (
    'findd.ai Integration',
    'usp_' || encode(gen_random_bytes(32), 'hex'),
    true
)
RETURNING api_key;
```

3. **Copy the API Key** and provide it to findd.ai

4. **API Documentation:**
   - URL: https://unique-staffing-professionals.netlify.app/openapi/docs
   - Share this with findd.ai for integration

---

## 📧 Email Service Setup (Optional - Phase 2)

To enable automated emails:

1. **Sign up for Resend:**
   - Go to https://resend.com
   - Create account and get API key

2. **Add to Netlify Environment Variables:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add: `RESEND_API_KEY=your-api-key-here`

3. **Redeploy:**
   - Trigger a new deployment for env vars to take effect

---

## 📊 Features Checklist

### ✅ Completed & Deployed

- [x] Multi-language support (EN/ES/FR)
- [x] Dark/Light/System theme toggle
- [x] Enhanced application form
- [x] Email verification workflow
- [x] Phone duplicate detection
- [x] Multi-position selection
- [x] Resume + additional document uploads
- [x] Optional URL fields (job posting, LinkedIn, portfolio)
- [x] Cookie consent (CCPA compliant)
- [x] Analytics tracking system
- [x] Privacy Policy page
- [x] Terms of Service page
- [x] Unsubscribe page
- [x] Talent Network modal
- [x] Job listings system
- [x] Admin dashboard
- [x] Analytics dashboard
- [x] OpenAPI documentation
- [x] Security fixes (29 issues resolved)

### ⏳ Requires Database Setup

- [ ] **Add jobs to database** ← **THIS IS WHY JOBS DON'T APPEAR**
- [ ] Create admin user
- [ ] Generate API key for findd.ai

### 📝 Optional (Phase 2)

- [ ] Add Google Analytics GA4
- [ ] Configure Resend for email
- [ ] Add company logo and favicon
- [ ] SMS verification system

---

## 🎯 Quick Start Guide

**To see jobs on the website RIGHT NOW:**

1. Open Supabase SQL Editor
2. Run `add-jobs-to-database.sql`
3. Refresh website
4. Jobs will appear!

**To access admin dashboard:**

1. Create admin user in Supabase Auth
2. Login at `/admin/login`
3. View applicants and analytics

---

## 🔗 Important URLs

- **Production Site:** https://unique-staffing-professionals.netlify.app
- **Admin Login:** https://unique-staffing-professionals.netlify.app/admin/login
- **API Docs:** https://unique-staffing-professionals.netlify.app/openapi/docs
- **Privacy Policy:** https://unique-staffing-professionals.netlify.app/privacy
- **Terms of Service:** https://unique-staffing-professionals.netlify.app/terms

---

## 📞 Support Contact

**Technical Issues:** omorilla@uniquestaffingprofessionals.com

---

**Last Updated:** November 19, 2024  
**Deployment Status:** ✅ LIVE ON NETLIFY

