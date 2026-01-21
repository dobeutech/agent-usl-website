-- Configure 'resumes' and 'documents' buckets for secure public upload + admin access

-- 1. Resumes Bucket (ensure private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false) 
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. Documents Bucket (ensure private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false) 
ON CONFLICT (id) DO UPDATE SET public = false;

-- 3. Policies for Resumes (Drop/Recreate to ensure correctness)
DROP POLICY IF EXISTS "Anyone can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resumes" ON storage.objects;

-- Allow both anonymous (public applicants) and authenticated (admins) to upload
CREATE POLICY "Anyone can upload resumes"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can view resumes"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can update resumes"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can delete resumes"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes');

-- 4. Policies for Documents (Drop/Recreate)
DROP POLICY IF EXISTS "Anyone can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;

-- Allow both anonymous (public applicants) and authenticated (admins) to upload
CREATE POLICY "Anyone can upload documents"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can view documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can update documents"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can delete documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documents');
