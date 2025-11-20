-- Analytics and Cookie Consent Tracking
-- Run this in Supabase SQL Editor

-- Visitor Analytics Table
CREATE TABLE IF NOT EXISTS public.visitor_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    visitor_id TEXT NOT NULL,
    ip_address INET,
    country TEXT,
    region TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    screen_resolution TEXT,
    referrer_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    landing_page TEXT,
    session_duration INTEGER,
    pages_visited INTEGER DEFAULT 0
);

-- Page View Events Table
CREATE TABLE IF NOT EXISTS public.page_view_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    visitor_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    page_title TEXT,
    time_on_page INTEGER,
    scroll_depth INTEGER,
    referrer TEXT,
    exit_page BOOLEAN DEFAULT false
);

-- Cookie Consent Log Table
CREATE TABLE IF NOT EXISTS public.cookie_consent_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    visitor_id TEXT NOT NULL UNIQUE,
    consent_essential BOOLEAN DEFAULT true NOT NULL,
    consent_analytics BOOLEAN DEFAULT false NOT NULL,
    consent_marketing BOOLEAN DEFAULT false NOT NULL,
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_visitor_id ON public.visitor_analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_created_at ON public.visitor_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_page_view_events_visitor_id ON public.page_view_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_view_events_created_at ON public.page_view_events(created_at);
CREATE INDEX IF NOT EXISTS idx_cookie_consent_visitor_id ON public.cookie_consent_log(visitor_id);

-- Enable RLS
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_view_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cookie_consent_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only authenticated admin users can view analytics
CREATE POLICY "Authenticated users can view visitor analytics"
    ON public.visitor_analytics
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view page view events"
    ON public.page_view_events
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view cookie consent log"
    ON public.cookie_consent_log
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow anonymous users to insert their own analytics
CREATE POLICY "Anyone can insert visitor analytics"
    ON public.visitor_analytics
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Anyone can insert page view events"
    ON public.page_view_events
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Anyone can insert cookie consent"
    ON public.cookie_consent_log
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Anyone can update their own cookie consent"
    ON public.cookie_consent_log
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Update trigger for cookie consent
CREATE TRIGGER cookie_consent_updated_at_trigger
    BEFORE UPDATE ON public.cookie_consent_log
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.visitor_analytics IS 'Stores comprehensive visitor analytics data for CCPA-compliant tracking';
COMMENT ON TABLE public.page_view_events IS 'Tracks individual page view events with engagement metrics';
COMMENT ON TABLE public.cookie_consent_log IS 'Logs user cookie consent preferences per CCPA requirements';

