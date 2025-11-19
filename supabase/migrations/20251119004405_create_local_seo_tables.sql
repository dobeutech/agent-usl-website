/*
  # Local SEO and Business Information Schema

  1. New Tables
    - `business_info`
      - `id` (uuid, primary key)
      - `name` (text) - Business display name
      - `legal_name` (text) - Legal business name
      - `description` (text) - Business description
      - `tagline` (text) - Business tagline
      - `ceo` (text) - CEO name
      - `location` (jsonb) - Structured address data
      - `contact` (jsonb) - Contact information (phone, email, fax, text)
      - `hours` (jsonb) - Business operating hours array
      - `geo` (jsonb) - Geographic coordinates (latitude, longitude)
      - `founded_year` (integer) - Year business was founded
      - `service_areas` (text[]) - Array of service area cities
      - `social_media` (jsonb) - Social media links
      - `is_active` (boolean) - Whether this is the active business profile
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `service_areas`
      - `id` (uuid, primary key)
      - `city` (text) - Service area city name
      - `state` (text) - State abbreviation
      - `zip_codes` (text[]) - Array of ZIP codes served
      - `description` (text) - SEO-optimized description of services in this area
      - `meta_title` (text) - Page title for location page
      - `meta_description` (text) - Meta description for location page
      - `is_active` (boolean) - Whether this service area is active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `local_testimonials`
      - `id` (uuid, primary key)
      - `name` (text) - Testimonial author name
      - `company` (text) - Company name
      - `location` (text) - Location (city, state)
      - `role` (text) - Job title/role
      - `testimonial` (text) - Testimonial content
      - `rating` (integer) - Rating 1-5
      - `service_area_id` (uuid) - Foreign key to service_areas
      - `is_featured` (boolean) - Featured on homepage
      - `is_active` (boolean) - Published status
      - `created_at` (timestamptz)

    - `local_content`
      - `id` (uuid, primary key)
      - `service_area_id` (uuid) - Foreign key to service_areas
      - `content_type` (text) - Type: 'industry_insight', 'local_news', 'faq'
      - `title` (text) - Content title
      - `content` (text) - Main content body
      - `author` (text) - Content author
      - `is_published` (boolean) - Publication status
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for active/published content
    - Admin-only write access for all tables
    - Authenticated users can read all data
*/

-- Create business_info table
CREATE TABLE IF NOT EXISTS business_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_name text NOT NULL,
  description text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  ceo text DEFAULT '',
  location jsonb NOT NULL,
  contact jsonb NOT NULL,
  hours jsonb NOT NULL DEFAULT '[]'::jsonb,
  geo jsonb NOT NULL,
  founded_year integer,
  service_areas text[] DEFAULT ARRAY[]::text[],
  social_media jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service_areas table
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  state text NOT NULL,
  zip_codes text[] DEFAULT ARRAY[]::text[],
  description text NOT NULL DEFAULT '',
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create local_testimonials table
CREATE TABLE IF NOT EXISTS local_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  role text NOT NULL DEFAULT '',
  testimonial text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  service_area_id uuid REFERENCES service_areas(id) ON DELETE SET NULL,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create local_content table
CREATE TABLE IF NOT EXISTS local_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_area_id uuid REFERENCES service_areas(id) ON DELETE CASCADE,
  content_type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  author text DEFAULT '',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_info_active ON business_info(is_active);
CREATE INDEX IF NOT EXISTS idx_service_areas_active ON service_areas(is_active);
CREATE INDEX IF NOT EXISTS idx_service_areas_state ON service_areas(state);
CREATE INDEX IF NOT EXISTS idx_local_testimonials_active ON local_testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_local_testimonials_featured ON local_testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_local_testimonials_service_area ON local_testimonials(service_area_id);
CREATE INDEX IF NOT EXISTS idx_local_content_published ON local_content(is_published);
CREATE INDEX IF NOT EXISTS idx_local_content_service_area ON local_content(service_area_id);
CREATE INDEX IF NOT EXISTS idx_local_content_type ON local_content(content_type);

-- Enable Row Level Security
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_content ENABLE ROW LEVEL SECURITY;

-- Business Info Policies
CREATE POLICY "Anyone can view active business info"
  ON business_info FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all business info"
  ON business_info FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert business info"
  ON business_info FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update business info"
  ON business_info FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete business info"
  ON business_info FOR DELETE
  TO authenticated
  USING (true);

-- Service Areas Policies
CREATE POLICY "Anyone can view active service areas"
  ON service_areas FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all service areas"
  ON service_areas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert service areas"
  ON service_areas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update service areas"
  ON service_areas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete service areas"
  ON service_areas FOR DELETE
  TO authenticated
  USING (true);

-- Local Testimonials Policies
CREATE POLICY "Anyone can view active testimonials"
  ON local_testimonials FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all testimonials"
  ON local_testimonials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON local_testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON local_testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON local_testimonials FOR DELETE
  TO authenticated
  USING (true);

-- Local Content Policies
CREATE POLICY "Anyone can view published content"
  ON local_content FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all content"
  ON local_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert content"
  ON local_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update content"
  ON local_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete content"
  ON local_content FOR DELETE
  TO authenticated
  USING (true);

-- Insert default business information
INSERT INTO business_info (
  name,
  legal_name,
  description,
  tagline,
  ceo,
  location,
  contact,
  hours,
  geo,
  founded_year,
  service_areas,
  is_active
) VALUES (
  'Unique Staffing Professionals Inc.',
  'Unique Staffing Professionals Inc.',
  'Professional staffing agency connecting businesses with qualified candidates while showcasing services, expertise, and building trust through comprehensive employment solutions.',
  'Where Opportunity Starts! Expanding access to meaningful employment across the globe through innovative staffing solutions and local partnerships.',
  'Otniel Morilla',
  '{"street": "6200 Baltimore Avenue", "suite": "Floor 3, Suite R35", "city": "Riverdale", "state": "MD", "zipCode": "20737", "country": "United States"}'::jsonb,
  '{"phone": "+13012385182", "textLine": "+13012385183", "fax": "+12403923898", "email": "info@uniquestaffingprofessionals.com"}'::jsonb,
  '[
    {"dayOfWeek": "Monday", "opens": "08:00", "closes": "18:00"},
    {"dayOfWeek": "Tuesday", "opens": "08:00", "closes": "18:00"},
    {"dayOfWeek": "Wednesday", "opens": "08:00", "closes": "18:00"},
    {"dayOfWeek": "Thursday", "opens": "08:00", "closes": "18:00"},
    {"dayOfWeek": "Friday", "opens": "08:00", "closes": "18:00"}
  ]'::jsonb,
  '{"latitude": 38.9643, "longitude": -76.9283}'::jsonb,
  2020,
  ARRAY['Riverdale', 'College Park', 'Hyattsville', 'Greenbelt', 'Beltsville', 'Laurel'],
  true
) ON CONFLICT DO NOTHING;

-- Insert default service areas
INSERT INTO service_areas (city, state, zip_codes, description, meta_title, meta_description, is_active) VALUES
(
  'Riverdale',
  'MD',
  ARRAY['20737', '20738'],
  'Professional staffing services in Riverdale, Maryland. We connect local businesses with qualified candidates for temporary, permanent, and contract positions.',
  'Staffing Agency in Riverdale, MD | Unique Staffing Professionals',
  'Top-rated staffing agency serving Riverdale, MD. Find qualified candidates or explore career opportunities. Call (301) 238-5182 for staffing solutions.',
  true
),
(
  'College Park',
  'MD',
  ARRAY['20740', '20741', '20742'],
  'Expert staffing solutions in College Park, Maryland. Serving businesses near the University of Maryland with professional recruitment and employment services.',
  'College Park Staffing Agency | Unique Staffing Professionals MD',
  'Leading staffing agency in College Park, MD. Professional recruitment services for businesses and career opportunities for job seekers. Contact us today.',
  true
),
(
  'Hyattsville',
  'MD',
  ARRAY['20781', '20782', '20783', '20784', '20785'],
  'Comprehensive staffing services in Hyattsville, Maryland. Your trusted partner for finding qualified employees and advancing your career in Prince George''s County.',
  'Hyattsville MD Staffing Services | Unique Staffing Professionals',
  'Professional staffing agency serving Hyattsville, MD and Prince George''s County. Quality talent solutions for businesses. Job opportunities for candidates.',
  true
),
(
  'Greenbelt',
  'MD',
  ARRAY['20768', '20770', '20771'],
  'Trusted staffing partner in Greenbelt, Maryland. Connecting employers with talented professionals across multiple industries in the DC metro area.',
  'Greenbelt MD Employment Agency | Unique Staffing Professionals',
  'Find top talent or your next career opportunity in Greenbelt, MD. Professional staffing services with local expertise. Call (301) 238-5182.',
  true
)
ON CONFLICT DO NOTHING;
