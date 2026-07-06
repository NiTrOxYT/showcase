-- ─── SUPABASE STORAGE SETUP ─────────────────────────────────────────────────
-- Run this in Supabase Dashboard → SQL Editor
-- Creates the site-assets bucket and sets Storage RLS policies.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create bucket (public = true so images can be served without auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  10485760,   -- 10 MB in bytes
  ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/svg+xml','image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS – anyone can read (bucket is public, but add policy for safety)
CREATE POLICY "Public read on site-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

-- 3. Only authenticated users (admins) can upload
CREATE POLICY "Authenticated upload to site-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

-- 4. Authenticated users can update (overwrite / rename)
CREATE POLICY "Authenticated update on site-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets');

-- 5. Authenticated users can delete
CREATE POLICY "Authenticated delete on site-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets');
