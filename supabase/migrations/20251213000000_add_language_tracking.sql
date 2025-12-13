/*
  # Add Language Tracking Support

  ## Overview
  This migration adds language preference tracking to capture which language
  users were viewing the site in when they submitted their application.
  All data is stored in English in the database, but we track the original
  language for analytics and communication preferences.

  ## Changes

  ### 1. Update Applicants Table
  - Add `preferred_language` (text) - The language code the user was using (en/es/fr)
  - Add `browser_language` (text) - The browser's detected language
  
  ### 2. Update Newsletter Subscriptions Table  
  - Add `preferred_language` (text) - Language preference for communications

  ### 3. Update Visitor Analytics Table
  - Add `page_language` (text) - Language of the page being viewed

  ## Notes
  - Language codes follow ISO 639-1 standard (en, es, fr)
  - All user-submitted text content is stored in the language it was submitted
  - Backend admin interface displays all data in English
  - Communication preferences can be used to send emails in preferred language
*/

-- Add language tracking to applicants table
ALTER TABLE applicants
ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS browser_language text;

-- Add comment for clarity
COMMENT ON COLUMN applicants.preferred_language IS 'Language code (en/es/fr) user selected when submitting application';
COMMENT ON COLUMN applicants.browser_language IS 'Browser-detected language from Accept-Language header';

-- Add language to newsletter subscriptions
ALTER TABLE newsletter_subscriptions
ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en';

COMMENT ON COLUMN newsletter_subscriptions.preferred_language IS 'Preferred language for email communications';

-- Add language to visitor analytics
ALTER TABLE visitor_analytics
ADD COLUMN IF NOT EXISTS page_language text DEFAULT 'en';

COMMENT ON COLUMN visitor_analytics.page_language IS 'Language version of page being viewed';

-- Create index for language-based queries
CREATE INDEX IF NOT EXISTS idx_applicants_preferred_language ON applicants(preferred_language);
CREATE INDEX IF NOT EXISTS idx_newsletter_preferred_language ON newsletter_subscriptions(preferred_language);

-- Add language to cookie consent log for GDPR compliance in different regions
ALTER TABLE cookie_consent_log
ADD COLUMN IF NOT EXISTS user_language text DEFAULT 'en';
