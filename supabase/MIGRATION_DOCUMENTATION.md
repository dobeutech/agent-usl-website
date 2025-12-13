# Supabase Migration Documentation

## Overview
This document describes all database migrations and identifies duplicates.

## Migration Files

### Core Tables

1. **20251119001246_create_applicants_table.sql** (or 20251119020909 - duplicate)
   - Creates the `applicants` table with basic fields
   - Sets up RLS policies
   - Creates indexes for email, status, and created_at
   - **Note**: There are two identical files - both create the same table

2. **20251119001305_create_resumes_storage_bucket.sql** (or 20251119020940 - duplicate)
   - Creates the `resumes` storage bucket
   - Sets up storage policies
   - **Note**: There are two identical files

3. **20251119021018_enhance_applicants_schema.sql** (or 20251119120000 - duplicate)
   - Adds enhanced fields to applicants table:
     - Email verification fields (email_verified, email_verification_token, token_expiry, email_confirmed)
     - Multi-position support (positions_interested array)
     - URL fields (job_posting_url, linkedin_url, portfolio_url)
     - Analytics fields (submission_location, admin_notified_at)
     - Phone normalization (phone_normalized)
   - Creates `applicant_documents` table
   - Creates `email_verification_log` table
   - **Note**: There are two identical files - both add the same enhancements

### Additional Tables

4. **002_jobs_table.sql**
   - Creates the `jobs` table for job listings

5. **20251119004405_create_local_seo_tables.sql**
   - Creates tables for local SEO (service_areas, local_testimonials, local_content)

6. **20251119010047_create_multilingual_content_tables.sql**
   - Creates tables for multilingual content support

7. **20251119040701_20251119040628_add_newsletter_sms_analytics_support.sql**
   - Adds newsletter and SMS notification fields to applicants table

8. **20251119140000_analytics_tracking.sql**
   - Creates analytics tracking tables (visitor_analytics, page_view_events, cookie_consent_log)

### Security Fixes

9. **20251119023435_fix_security_issues_corrected.sql**
   - Removes unused indexes
   - Consolidates RLS policies
   - Fixes function search_path issues

10. **20251119130000_fix_security_issues.sql**
    - Similar security fixes (may be duplicate)

11. **20251119130100_fix_security_issues_corrected.sql**
    - Final security fixes (consolidated version)

## Duplicate Migrations

The following migrations are duplicates and can be safely ignored (they use `IF NOT EXISTS` checks):

- `20251119001246_create_applicants_table.sql` = `20251119020909_create_applicants_table.sql`
- `20251119001305_create_resumes_storage_bucket.sql` = `20251119020940_create_resumes_storage_bucket.sql`
- `20251119021018_enhance_applicants_schema.sql` = `20251119120000_enhance_applicants_schema.sql`

## Current Database Schema

### Main Tables

1. **applicants** - Main applicant tracking table
2. **applicant_documents** - Additional documents per applicant
3. **email_verification_log** - Email verification audit trail
4. **jobs** - Job listings
5. **visitor_analytics** - Visitor tracking
6. **page_view_events** - Page view analytics
7. **cookie_consent_log** - Cookie consent tracking
8. **business_info** - Business information
9. **service_areas** - Service area definitions
10. **local_testimonials** - Location-specific testimonials
11. **local_content** - Location-specific content

## Recommendations

1. **Clean up duplicates**: Consider removing the older duplicate migration files to reduce confusion
2. **Migration order**: Migrations are designed to be idempotent (safe to run multiple times)
3. **Security**: All tables have RLS enabled with appropriate policies

