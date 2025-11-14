# Supabase Setup Guide

This guide will help you set up Supabase for the Unique Staffing Professionals applicant system.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and anon key from Settings > API

## 2. Database Schema Setup

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create applicants table
CREATE TABLE applicants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position_interested TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  resume_url TEXT,
  resume_filename TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  notes TEXT
);

-- Create index on email for faster lookups
CREATE INDEX idx_applicants_email ON applicants(email);

-- Create index on status for filtering
CREATE INDEX idx_applicants_status ON applicants(status);

-- Create index on created_at for sorting
CREATE INDEX idx_applicants_created_at ON applicants(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert applicants (public form submission)
CREATE POLICY "Anyone can submit applications"
  ON applicants
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Authenticated users can view all applicants
CREATE POLICY "Authenticated users can view applicants"
  ON applicants
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can update applicants
CREATE POLICY "Authenticated users can update applicants"
  ON applicants
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 3. Storage Setup

Run the following SQL to create a storage bucket for resumes:

```sql
-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false);

-- Policy: Anyone can upload resumes
CREATE POLICY "Anyone can upload resumes"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'resumes');

-- Policy: Authenticated users can view resumes
CREATE POLICY "Authenticated users can view resumes"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'resumes');

-- Policy: Authenticated users can delete resumes
CREATE POLICY "Authenticated users can delete resumes"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes');
```

## 4. Create Admin User

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add User" > "Create new user"
3. Enter email and password for the admin account
4. Confirm the user's email in the dashboard

## 5. Environment Variables

Update the `.env` file in your project root with your Supabase credentials:

```
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 6. Testing

After setup, you should be able to:
- Submit applications through the public form
- Login to the admin dashboard with your admin credentials
- View, filter, and update applicant status
- Download resumes

## Security Notes

- The anon key is safe to expose in the frontend
- Row Level Security (RLS) ensures data protection
- Only authenticated users can view applicant data
- Public users can only submit applications
- Store resumes in a private bucket (public: false)
