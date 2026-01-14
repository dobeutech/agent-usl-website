# Supabase Storage Setup Guide

## Overview

Feature **feat-025** (Supabase Storage) requires creating a storage bucket for resume files. This is a **deployment/infrastructure task** that requires admin access to the Supabase project.

**Current Status**: Code is 100% ready. Only infrastructure setup needed.

## Why This Can't Be Done Automatically

Creating storage buckets requires the **service_role** key (admin key), not the **anon** key. This is a security feature that prevents unauthorized bucket creation. The anon key is intentionally limited to:
- Reading data (with RLS policies)
- Inserting data (with RLS policies)
- Uploading files to existing buckets (with RLS policies)

**Bucket creation requires**:
- Supabase Dashboard access OR
- Service role key OR
- Database admin access

## Option 1: Create Bucket via Supabase Dashboard (RECOMMENDED)

### Step 1: Access Supabase Dashboard
1. Go to: https://ynedsbgiveycubmusjzf.supabase.co
2. Log in with your Supabase account credentials

### Step 2: Create Storage Bucket
1. Click **Storage** in the left sidebar
2. Click **New Bucket** (or **Create Bucket**)
3. Configure the bucket:
   - **Name**: `resumes`
   - **Public**: ❌ **No** (keep it private)
   - **File size limit**: 5 MB (5242880 bytes)
   - **Allowed MIME types**: 
     - `application/pdf`
     - `application/msword`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
4. Click **Create**

### Step 3: Configure RLS Policies
Go to the **Policies** tab for the `resumes` bucket and add:

**Policy 1: Upload Access (Anyone can upload)**
- **Name**: Anyone can upload resumes
- **Type**: INSERT
- **Target roles**: anon
- **Policy**: `bucket_id = 'resumes'`

**Policy 2: Download Access (Authenticated users)**
- **Name**: Authenticated users can view resumes
- **Type**: SELECT
- **Target roles**: authenticated
- **Policy**: `bucket_id = 'resumes'`

**Policy 3: Delete Access (Authenticated users)**
- **Name**: Authenticated users can delete resumes
- **Type**: DELETE
- **Target roles**: authenticated
- **Policy**: `bucket_id = 'resumes'`

## Option 2: Apply SQL Migration (Alternative)

If you have database admin access, you can run the migration file:

```bash
# Navigate to project root
cd /e/cursor/cursor-projects/uniquestaffingprofessionals/unique-staffing-prof

# Apply the migration (requires service_role key in environment)
psql <connection-string> < supabase/migrations/20251119020940_create_resumes_storage_bucket.sql
```

**Migration file location**: `supabase/migrations/20251119020940_create_resumes_storage_bucket.sql`

## Option 3: Use Supabase CLI with Service Role Key

If you have the service_role key:

```bash
# Set service role key in environment
export SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Run migration
supabase db push
```

## Verification Steps

After creating the bucket, verify the setup:

### Step 1: Run Test Script
```bash
cd my-agent
node test-storage-setup.mjs
```

**Expected output**:
```
1. Storage Buckets:
   ✅ "resumes" bucket exists

2. Applicants Table RLS:
   SELECT: ✅ Works
   INSERT: ✅ Allowed

3. Auth Status:
   Session check: ✅ Auth system responding
```

### Step 2: Test File Upload via UI
1. Navigate to http://localhost:5000/apply
2. Fill out the application form
3. Upload a PDF resume (under 5MB)
4. Submit the form
5. Verify: No errors, success message appears

### Step 3: Verify Admin Download
1. Log in to admin dashboard: http://localhost:5000/admin
2. View an applicant with a resume
3. Click "Download Resume"
4. Verify: File downloads successfully

## Enable Production Mode

Once the bucket is created and verified:

### Step 1: Update Environment Variable
Edit `.env` file:
```bash
# Change from:
VITE_FORCE_DEMO_MODE=true

# To:
VITE_FORCE_DEMO_MODE=false
```

### Step 2: Restart Dev Server
```bash
npm run dev
```

### Step 3: Update Feature Status
Update `my-agent/.agent/feature_list.json`:
```json
{
  "id": "feat-025",
  "passes": true,
  "last_tested": "2026-01-14T10:00:00.000Z",
  "tested_by": "agent",
  "notes": "Supabase Storage bucket created successfully. File uploads working in production mode."
}
```

### Step 4: Commit Changes
```bash
cd my-agent
git add .agent/feature_list.json
git commit -m "[agent] Complete feat-025: Supabase Storage configured and verified"
```

## Current Code Status

✅ **All code is ready**:
- File upload UI component (ApplicationForm.tsx)
- Storage service functions (storage.ts)
- Demo mode support
- Error handling
- Admin download functionality
- Migration file with RLS policies

## Troubleshooting

### "Error creating bucket: new row violates row-level security policy"
- **Cause**: Using anon key instead of service_role key
- **Solution**: Use Supabase Dashboard (Option 1) instead

### "No buckets found"
- **Cause**: Bucket hasn't been created yet
- **Solution**: Follow Option 1 steps to create bucket

### "Upload fails with 400 error"
- **Cause**: RLS policies not configured
- **Solution**: Add the 3 RLS policies from Step 3

### "Admin can't download files"
- **Cause**: SELECT policy missing or incorrect
- **Solution**: Verify authenticated SELECT policy exists

## Security Notes

The storage configuration is designed for security:

✅ **Private bucket** - Files not publicly accessible
✅ **Anonymous uploads** - Applicants can submit resumes
✅ **Authenticated downloads** - Only admins can access files
✅ **RLS policies** - Enforced at database level
✅ **File type restrictions** - Only PDF/DOC/DOCX accepted
✅ **Size limits** - Maximum 5MB per file

## Next Steps After Completion

Once feat-025 passes, the application will be:
- ✅ 40/40 features passing (100% complete)
- ✅ Production-ready
- ✅ Ready for deployment
- ✅ All functionality verified

## Support

If you encounter issues:
1. Check Supabase Dashboard for bucket status
2. Verify RLS policies are active
3. Check browser console for errors
4. Review test-storage-setup.mjs output
5. Check Supabase logs for API errors

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-14T09:30:00.000Z  
**Status**: Ready for deployment team
