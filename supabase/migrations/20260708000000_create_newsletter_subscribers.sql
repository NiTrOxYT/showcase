-- Migration: Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    source TEXT NOT NULL DEFAULT 'website_footer'
);

-- Index for date-based sorting / query performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON public.newsletter_subscribers(created_at);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can sign up)
CREATE POLICY "Allow anonymous inserts" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow authenticated reads only
CREATE POLICY "Allow authenticated reads" ON public.newsletter_subscribers
    FOR SELECT TO authenticated USING (true);
