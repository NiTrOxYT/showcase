-- Supabase Database Schema for ANNEX website

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROJECTS TABLE ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Website',
    platform TEXT NOT NULL DEFAULT 'Web',
    cover_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'Draft',
    featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    client_name TEXT,
    industry TEXT,
    published_at TIMESTAMPTZ,
    created_by UUID,
    theme_color TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    gallery_layout TEXT DEFAULT 'grid',
    device_preview TEXT DEFAULT 'desktop',
    live_url TEXT,
    github_url TEXT,
    duration TEXT,
    team_size INTEGER,
    testimonial JSONB DEFAULT '{}'::jsonb,
    services JSONB DEFAULT '[]'::jsonb,
    deliverables JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    repository_visibility TEXT DEFAULT 'Private',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast searches and slug queries
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order);

-- ─── SETTINGS TABLE (SINGLETON) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    brand_name TEXT NOT NULL DEFAULT 'ANNEX',
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_description TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    instagram TEXT,
    linkedin TEXT,
    github TEXT,
    behance TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    meta_title TEXT,
    meta_description TEXT,
    default_og_image TEXT,
    analytics_id TEXT,
    theme TEXT NOT NULL DEFAULT 'dark',
    accent_color TEXT NOT NULL DEFAULT 'oklch(0.60 0.124 70.0)',
    default_locale TEXT NOT NULL DEFAULT 'en',
    contact_title TEXT DEFAULT 'Let''s build something exceptional.',
    contact_description TEXT DEFAULT 'Whether you want to discuss a new design brief, system architecture, or schedule an initial discovery call, we are here.',
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT singleton_check CHECK (id = 'global')
);

-- ─── NAVIGATION TABLE ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.navigation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    href TEXT NOT NULL,
    position TEXT NOT NULL DEFAULT 'header', -- 'header' or 'footer'
    visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    parent_id UUID REFERENCES public.navigation(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_navigation_sort_order ON public.navigation(sort_order);
CREATE INDEX IF NOT EXISTS idx_navigation_parent_id ON public.navigation(parent_id);

-- ─── AUTOMATIC UPDATED_AT TRIGGER ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_navigation_updated_at BEFORE UPDATE ON public.navigation FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── ROW LEVEL SECURITY (RLS) POLICIES ──────────────────────────────────────
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;

-- 1. Projects Policies
CREATE POLICY "Allow public read on published projects" ON public.projects
    FOR SELECT USING (status = 'Published' OR is_published = true);

CREATE POLICY "Allow authenticated read on all projects" ON public.projects
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated full write on projects" ON public.projects
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Settings Policies
CREATE POLICY "Allow public read on settings" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated update on settings" ON public.settings
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 3. Navigation Policies
CREATE POLICY "Allow public read on navigation" ON public.navigation
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full write on navigation" ON public.navigation
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ─── REALTIME CHANNELS ──────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.navigation;

-- ─── NEWSLETTER SUBSCRIBERS TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    source TEXT NOT NULL DEFAULT 'website_footer'
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON public.newsletter_subscribers(created_at);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON public.newsletter_subscribers
    FOR SELECT TO authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.newsletter_subscribers;

