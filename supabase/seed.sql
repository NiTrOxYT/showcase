-- SQL Seed file for ANNEX Supabase Database

-- ─── 1. SEED SETTINGS ────────────────────────────────────────────────────────
INSERT INTO public.settings (
    id, brand_name, hero_title, hero_subtitle, hero_description,
    email, phone, address, instagram, linkedin, github, behance,
    logo_url, favicon_url, meta_title, meta_description, default_og_image,
    analytics_id, theme, accent_color, default_locale, contact_title, contact_description
) VALUES (
    'global',
    'ANNEX',
    'Design that earns trust before words.',
    'Independent Digital Studio',
    'A bionic design studio combining raw engineering with cinematic motion to build websites your competitors wish they launched.',
    'hello@annex-consultancy.com',
    '+91 98765 43210',
    'Kolkata, India',
    'https://instagram.com/annex',
    'https://linkedin.com/company/annex',
    'https://github.com/annex',
    'https://behance.net/annex',
    '/images/logo.png',
    '/favicon.ico',
    'ANNEX Showcase — Bespoke Digital Studio',
    'Bespoke digital platforms built for scale.',
    '/images/og.jpg',
    'G-XXXXXXXXXX',
    'dark',
    'oklch(0.60 0.124 70.0)',
    'en',
    'Let''s build something exceptional.',
    'Whether you want to discuss a new design brief, system architecture, or schedule an initial discovery call, we are here.'
) ON CONFLICT (id) DO NOTHING;

-- ─── 2. SEED NAVIGATION ──────────────────────────────────────────────────────
-- Insert primary navigation nodes
INSERT INTO public.navigation (id, title, href, position, visible, sort_order, parent_id)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Work', '/showcase', 'header', true, 1, NULL),
  ('22222222-2222-2222-2222-222222222222', 'About', '/#about', 'header', true, 2, NULL),
  ('33333333-3333-3333-3333-333333333333', 'Contact', '/#contact', 'header', true, 3, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert nested navigation examples under 'Work' or others if desired
-- We can showcase nested links: e.g. "Services" under "About" or specialized category links under "Work"
INSERT INTO public.navigation (title, href, position, visible, sort_order, parent_id)
VALUES
  ('Case Studies', '/showcase?filter=all', 'header', true, 1, '11111111-1111-1111-1111-111111111111'),
  ('Websites', '/showcase?filter=website', 'header', true, 2, '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- ─── 3. SEED PROJECTS ────────────────────────────────────────────────────────
INSERT INTO public.projects (
    id, title, slug, excerpt, description, category, platform,
    cover_image, gallery, tech_stack, status, featured, sort_order,
    seo_title, seo_description, client_name, industry, published_at,
    theme_color, is_featured, is_published, gallery_layout, device_preview,
    live_url, github_url, duration, team_size, testimonial, services, deliverables, tags, repository_visibility
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'EcoSphere Dashboard',
    'ecosphere-dashboard',
    'High-end telemetry dashboard visualizing environmental sustainability metrics globally.',
    'EcoSphere brings real-time environmental analysis to the enterprise scale. By compiling telemetry feeds from global sensors, the dashboard maps thermal deviations, ocean currents, and localized emissions indicators. The dashboard utilizes WebGL maps and custom charting tools, delivering high data density with zero interface stutter.',
    'Dashboard',
    'Web',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    '[
        {"id": "g1_1", "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", "alt": "EcoSphere central analytics landing viewport showing global maps", "device": "desktop", "title": "Global Overview Tab", "order": 1},
        {"id": "g1_2", "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80", "alt": "EcoSphere telemetry cards displayed on mobile device screen layout", "device": "mobile", "title": "Mobile Dashboard View", "order": 2}
    ]'::jsonb,
    '[
        {"name": "Next.js", "category": "Framework", "website": "https://nextjs.org"},
        {"name": "React", "category": "Library", "website": "https://react.dev"},
        {"name": "GSAP", "category": "Animation", "website": "https://greensock.com"},
        {"name": "Tailwind CSS", "category": "Styling", "website": "https://tailwindcss.com"},
        {"name": "Supabase", "category": "Database", "website": "https://supabase.com"}
    ]'::jsonb,
    'Published',
    true,
    1,
    'EcoSphere Dashboard — Environmental Analytics',
    'High-end telemetry dashboard visualizing environmental sustainability metrics.',
    'EcoSphere Inc.',
    'Environmental Technology',
    '2026-04-12T10:00:00Z',
    'oklch(0.60 0.124 70.0)',
    true,
    true,
    'grid',
    'desktop',
    'https://ecosphere.example.com',
    'https://github.com/annex/ecosphere',
    '4 Months',
    3,
    '{"quote": "ANNEX delivered a dashboard that doesn''t just display data—it tells a story. Performance and visuals are both top-tier.", "author": "Sarah Jenkins", "role": "VP of Product, EcoSphere"}'::jsonb,
    '["Strategy", "Interface Design", "Frontend Engineering", "Database Architectures"]'::jsonb,
    '["Telemetry Dashboard", "SVG Data Maps", "Supabase Database Configs"]'::jsonb,
    '["Telemetry", "Real-time", "Analytics", "SaaS"]'::jsonb,
    'Public'
), (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Aura Commerce',
    'aura-commerce',
    'Minimalist fashion retail site utilizing premium motion design and editorial typography.',
    'Aura Label requires digital presentation matching their physical designs. We built a custom headless storefront with instant page shifts, responsive image layouts, and fluid hover-activated cart sliders. Utilizing Next.js Server Components, Aura serves high-resolution photos under 50kb and maintains top Core Web Vitals rankings.',
    'Website',
    'Web',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    '[
        {"id": "g2_1", "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80", "alt": "Aura commerce product listings layout highlighting warm textures", "device": "browser", "title": "Product Listing Page", "order": 1},
        {"id": "g2_2", "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80", "alt": "Aura cart details responsive mockup view", "device": "mobile", "title": "Mobile Shopping View", "order": 2}
    ]'::jsonb,
    '[
        {"name": "Next.js", "category": "Framework", "website": "https://nextjs.org"},
        {"name": "React", "category": "Library", "website": "https://react.dev"},
        {"name": "Framer Motion", "category": "Animation", "website": "https://motion.dev"},
        {"name": "Tailwind CSS", "category": "Styling", "website": "https://tailwindcss.com"}
    ]'::jsonb,
    'Published',
    true,
    2,
    'Aura Commerce — Headless Storefront',
    'Minimalist luxury fashion storefront with sub-second page transitions.',
    'Aura Label',
    'Luxury Fashion',
    '2026-05-20T12:00:00Z',
    'oklch(0.60 0.124 70.0)',
    true,
    true,
    'grid',
    'desktop',
    'https://aura.example.com',
    'https://github.com/annex/aura',
    '3 Months',
    2,
    '{"quote": "Our online home now feels like our physical stores—calm, bespoke, and beautifully crafted down to the pixel.", "author": "Marcus Vance", "role": "Founder, Aura Label"}'::jsonb,
    '["Brand Strategy", "Visual Design", "Frontend Engineering"]'::jsonb,
    '["Headless E-Commerce System", "Custom Cart Systems", "Lenis Smooth Scroll Tuning"]'::jsonb,
    '["E-Commerce", "Headless storefront", "Fashion", "Luxury"]'::jsonb,
    'Private'
), (
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'Apex Mobile Application',
    'apex-mobile-app',
    'Sleek iOS and Android mobile app providing real-time biomechanics and workout logs.',
    'Apex provides fitness analytics using wearables sensor feeds. We designed and built a mobile application featuring highly interactive graphs, haptic feedback hooks, offline sync capabilities, and instant loading profiles. Built with React Native and custom native modules.',
    'Mobile App',
    'Mobile',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80',
    '[
        {"id": "g3_1", "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80", "alt": "Apex app workout progress screen layout showing activity charts", "device": "mobile", "title": "Biometric Workout Chart", "order": 1}
    ]'::jsonb,
    '[
        {"name": "React Native", "category": "Framework", "website": "https://reactnative.dev"},
        {"name": "TypeScript", "category": "Language", "website": "https://typescriptlang.org"},
        {"name": "Tailwind CSS", "category": "Styling", "website": "https://tailwindcss.com"}
    ]'::jsonb,
    'Published',
    true,
    3,
    'Apex Mobile App — Wearable Tracking',
    'Biomechanics and workout logs fitness tracker app.',
    'Apex Fitness Labs',
    'Health & Fitness',
    '2026-03-05T08:00:00Z',
    'oklch(0.60 0.124 70.0)',
    true,
    true,
    'grid',
    'mobile',
    '',
    '',
    '5 Months',
    4,
    '{}'::jsonb,
    '["Product Design", "Mobile App Development", "Native Integrations"]'::jsonb,
    '["iOS App Store Build", "Android Play Store Build", "Wearable API Sync Modules"]'::jsonb,
    '["Mobile App", "React Native", "Biomechanics", "Wearables"]'::jsonb,
    'Private'
), (
    'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
    'Zenith Business Platform',
    'zenith-platform',
    'Custom SaaS business tool managing dynamic pipeline metrics and resources.',
    'Zenith brings structure to distributed corporate resources. By integrating project feeds, resource schedules, and financial projections into one database, Zenith simplifies complex planning decisions and avoids spreadsheets duplication. Custom tables, filters, and dynamic pipelines operate synchronously with Postgres backends.',
    'Web App',
    'Web',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    '[
        {"id": "g4_1", "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", "alt": "Zenith platform pipeline tracking view showing data columns", "device": "laptop", "title": "Pipeline Dashboard Layout", "order": 1}
    ]'::jsonb,
    '[
        {"name": "Next.js", "category": "Framework", "website": "https://nextjs.org"},
        {"name": "React", "category": "Library", "website": "https://react.dev"},
        {"name": "Supabase", "category": "Database", "website": "https://supabase.com"},
        {"name": "Tailwind CSS", "category": "Styling", "website": "https://tailwindcss.com"}
    ]'::jsonb,
    'Published',
    false,
    4,
    'Zenith Business Platform — SaaS',
    'Custom SaaS business system for enterprise metrics.',
    'Zenith Global LLC',
    'Enterprise Management',
    '2026-06-01T09:00:00Z',
    'oklch(0.60 0.124 70.0)',
    false,
    true,
    'grid',
    'desktop',
    'https://zenith.example.com',
    '',
    '6 Months',
    5,
    '{}'::jsonb,
    '["Database Schema Design", "Frontend Engineering", "API Services Customization"]'::jsonb,
    '["Zenith Platform Frontend Build", "Supabase Relational Database Setup"]'::jsonb,
    '["SaaS", "Enterprise", "Pipeline Management", "Resource Planning"]'::jsonb,
    'Private'
) ON CONFLICT (id) DO NOTHING;
