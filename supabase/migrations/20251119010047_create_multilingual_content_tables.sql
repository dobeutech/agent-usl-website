/*
  # Create Multilingual Content Tables

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `author_name` (text)
      - `author_title` (text)
      - `company` (text, optional)
      - `rating` (integer, 1-5)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `display_order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `testimonial_translations`
      - `id` (uuid, primary key)
      - `testimonial_id` (uuid, foreign key)
      - `language` (text, en/es/fr)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `service_translations`
      - `id` (uuid, primary key)
      - `service_key` (text, unique per language)
      - `language` (text, en/es/fr)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (testimonials are public)
    - Add policies for authenticated admin write access

  3. Important Notes
    - Testimonials and service content will be stored in the database
    - Each testimonial can have translations in multiple languages
    - Services have static keys (temporary, permanent, contract-to-hire)
    - Admin dashboard will manage these multilingual contents
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_title text NOT NULL,
  company text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  image_url text,
  is_active boolean DEFAULT true NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS testimonial_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonial_id uuid NOT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
  language text NOT NULL CHECK (language IN ('en', 'es', 'fr')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(testimonial_id, language)
);

CREATE TABLE IF NOT EXISTS service_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_key text NOT NULL CHECK (service_key IN ('temporary', 'permanent', 'contract-to-hire')),
  language text NOT NULL CHECK (language IN ('en', 'es', 'fr')),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(service_key, language)
);

CREATE INDEX IF NOT EXISTS idx_testimonial_translations_testimonial_id 
  ON testimonial_translations(testimonial_id);

CREATE INDEX IF NOT EXISTS idx_testimonial_translations_language 
  ON testimonial_translations(language);

CREATE INDEX IF NOT EXISTS idx_service_translations_service_key 
  ON service_translations(service_key);

CREATE INDEX IF NOT EXISTS idx_service_translations_language 
  ON service_translations(language);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonials"
  ON testimonials
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view testimonial translations"
  ON testimonial_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM testimonials 
      WHERE testimonials.id = testimonial_translations.testimonial_id 
      AND testimonials.is_active = true
    )
  );

CREATE POLICY "Authenticated users can insert testimonial translations"
  ON testimonial_translations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonial translations"
  ON testimonial_translations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonial translations"
  ON testimonial_translations
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view service translations"
  ON service_translations
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert service translations"
  ON service_translations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update service translations"
  ON service_translations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete service translations"
  ON service_translations
  FOR DELETE
  TO authenticated
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'set_testimonials_updated_at'
  ) THEN
    CREATE TRIGGER set_testimonials_updated_at
      BEFORE UPDATE ON testimonials
      FOR EACH ROW
      EXECUTE FUNCTION moddatetime(updated_at);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'set_testimonial_translations_updated_at'
  ) THEN
    CREATE TRIGGER set_testimonial_translations_updated_at
      BEFORE UPDATE ON testimonial_translations
      FOR EACH ROW
      EXECUTE FUNCTION moddatetime(updated_at);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'set_service_translations_updated_at'
  ) THEN
    CREATE TRIGGER set_service_translations_updated_at
      BEFORE UPDATE ON service_translations
      FOR EACH ROW
      EXECUTE FUNCTION moddatetime(updated_at);
  END IF;
EXCEPTION
  WHEN undefined_function THEN
    NULL;
END $$;

INSERT INTO service_translations (service_key, language, title, description)
VALUES
  ('temporary', 'en', 'Temporary Staffing', 'Flexible workforce solutions for short-term projects, seasonal demands, and temporary coverage needs'),
  ('temporary', 'es', 'Personal Temporal', 'Soluciones flexibles de fuerza laboral para proyectos a corto plazo, demandas estacionales y necesidades de cobertura temporal'),
  ('temporary', 'fr', 'Personnel Temporaire', 'Solutions flexibles de main-d''œuvre pour les projets à court terme, les demandes saisonnières et les besoins de couverture temporaire'),
  ('permanent', 'en', 'Permanent Placement', 'Find the perfect long-term fit for your organization with our comprehensive recruitment services'),
  ('permanent', 'es', 'Colocación Permanente', 'Encuentre el ajuste perfecto a largo plazo para su organización con nuestros servicios integrales de reclutamiento'),
  ('permanent', 'fr', 'Placement Permanent', 'Trouvez l''adéquation parfaite à long terme pour votre organisation avec nos services de recrutement complets'),
  ('contract-to-hire', 'en', 'Contract-to-Hire', 'Evaluate candidates on the job before making a permanent hiring decision'),
  ('contract-to-hire', 'es', 'Contrato a Contratación', 'Evalúe candidatos en el trabajo antes de tomar una decisión de contratación permanente'),
  ('contract-to-hire', 'fr', 'Contrat à Embauche', 'Évaluez les candidats sur le terrain avant de prendre une décision d''embauche permanente')
ON CONFLICT (service_key, language) DO NOTHING;
