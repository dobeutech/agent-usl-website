/*
  # Secure Storage Policies - Admin Only Delete

  ## Summary
  Updates storage RLS policies to restrict DELETE operations to admin users only.
  Addresses security concern: "Overly broad privileges - authenticated role has wide
  permission to modify storage objects without checking ownership or admin role."

  ## Changes
  1. Drop existing overly permissive DELETE policy
  2. Create new DELETE policy restricted to admin users (service_role)
  3. Add UPDATE policy for admin users only
  4. Keep INSERT for anon (application submissions)
  5. Keep SELECT for authenticated (admin viewing)

  ## Security Notes
  - Anonymous users can only INSERT (upload during application)
  - Authenticated users can only SELECT (view/download)
  - Only admin/service_role can DELETE or UPDATE
  - This prevents regular authenticated users from modifying others' uploads
*/

-- ============================================================================
-- 1. DROP EXISTING OVERLY PERMISSIVE POLICIES
-- ============================================================================

-- Drop the policy that allows any authenticated user to delete
DROP POLICY IF EXISTS "Authenticated users can delete resumes" ON storage.objects;

-- Drop any existing update policy if it exists
DROP POLICY IF EXISTS "Authenticated users can update resumes" ON storage.objects;

-- ============================================================================
-- 2. CREATE ADMIN-ONLY DELETE POLICY
-- ============================================================================

-- Only service_role (admin) can delete storage objects
-- In Supabase, service_role bypasses RLS, but we add this for clarity
-- For authenticated admins, we check if they have admin privileges
CREATE POLICY "Admin users can delete resumes"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('resumes', 'documents')
    AND (
      -- Check if user has admin role via auth.jwt() claim
      (auth.jwt() ->> 'role') = 'admin'
      OR
      -- Or check via a custom admin check (if you have an admins table)
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data ->> 'role' = 'admin'
      )
    )
  );

-- ============================================================================
-- 3. CREATE ADMIN-ONLY UPDATE POLICY
-- ============================================================================

CREATE POLICY "Admin users can update resumes"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('resumes', 'documents')
    AND (
      (auth.jwt() ->> 'role') = 'admin'
      OR
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data ->> 'role' = 'admin'
      )
    )
  );

-- ============================================================================
-- 4. ENSURE DOCUMENTS BUCKET EXISTS WITH SAME POLICIES
-- ============================================================================

-- Create documents bucket if not exists (for additional document types)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can upload documents (for application submissions)
CREATE POLICY IF NOT EXISTS "Anyone can upload documents"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'documents');

-- Policy: Authenticated users can view documents
CREATE POLICY IF NOT EXISTS "Authenticated users can view documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');
