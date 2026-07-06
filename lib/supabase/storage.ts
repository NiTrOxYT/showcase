/**
 * lib/supabase/storage.ts
 * Central Supabase Storage utility for the ANNEX portfolio.
 *
 * Single bucket: site-assets
 * Folders:
 *   logos/      – brand logos, favicons
 *   projects/   – cover images, OG images, thumbnails
 *   gallery/    – project gallery images
 *   uploads/    – misc / future media
 *
 * IMPORTANT: uploadImage() and deleteImage() require an authenticated Supabase
 * client instance (with an active session) to satisfy Storage RLS policies.
 * Pass the browser supabaseClient from @/lib/supabase/client – never create a
 * fresh anonymous client here, or the upload will be rejected by RLS.
 */

import { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "site-assets";

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ─── Error formatter ────────────────────────────────────────────────────────

function friendlyError(raw: string): string {
  const lower = raw.toLowerCase();

  if (lower.includes("bucket not found") || lower.includes("does not exist")) {
    return (
      `Supabase Storage bucket "${BUCKET}" could not be found. ` +
      `Please create the bucket in Supabase Dashboard → Storage and set it to Public.`
    );
  }
  if (lower.includes("payload too large") || lower.includes("file size")) {
    return "File too large. Maximum allowed size is 10 MB.";
  }
  if (lower.includes("mime") || lower.includes("content-type") || lower.includes("invalid format")) {
    return "Invalid file type. Allowed: PNG, JPEG, WebP, SVG.";
  }
  if (
    lower.includes("row-level security") ||
    lower.includes("rls") ||
    lower.includes("permission") ||
    lower.includes("unauthorized") ||
    lower.includes("403")
  ) {
    return (
      "Upload permission denied. You must be logged in as admin. " +
      "Check that Storage RLS policies exist on the site-assets bucket."
    );
  }
  if (lower.includes("network") || lower.includes("fetch") || lower.includes("timeout")) {
    return "Network error during upload. Check your connection and try again.";
  }
  return `Upload failed. Please try again. (${raw.slice(0, 120)})`;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: `Invalid file type "${file.type}". Allowed: PNG, JPEG, WebP, SVG.`,
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 10 MB.`,
    };
  }
  return { ok: true };
}

// ─── Core helpers ────────────────────────────────────────────────────────────

export interface UploadResult {
  ok: boolean;
  publicUrl?: string;
  path?: string;
  error?: string;
}

/**
 * Upload an image file to Supabase Storage.
 *
 * @param supabase - Authenticated Supabase client (from @/lib/supabase/client).
 *                   Must have an active session; otherwise Storage RLS will block.
 * @param file     - File object from an <input type="file"> element.
 * @param folder   - Subfolder inside site-assets.
 */
export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  folder: "logos" | "projects" | "gallery" | "uploads" = "uploads"
): Promise<UploadResult> {
  // 1. Validate before touching the network.
  const validation = validateImageFile(file);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  // 2. Build a unique path.
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const path = `${folder}/${uniqueName}`;

  try {
    // 3. Upload using the caller's authenticated client.
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return { ok: false, error: friendlyError(uploadError.message) };
    }

    // 4. Get permanent public URL.
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = data?.publicUrl;

    if (!publicUrl) {
      return {
        ok: false,
        error: "Upload succeeded but public URL could not be generated. Check bucket is set to Public.",
      };
    }

    return { ok: true, publicUrl, path };
  } catch (err: any) {
    return { ok: false, error: friendlyError(err?.message ?? "Unknown error") };
  }
}

/**
 * Delete a file from Supabase Storage.
 * @param supabase - Authenticated Supabase client.
 * @param path     - Relative path inside site-assets, e.g. "projects/abc123.jpg".
 */
export async function deleteImage(
  supabase: SupabaseClient,
  path: string
): Promise<{ ok: boolean; error?: string }> {
  if (!path) return { ok: false, error: "No path provided." };

  try {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) return { ok: false, error: friendlyError(error.message) };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: friendlyError(err?.message ?? "Unknown error") };
  }
}

/**
 * Get the public URL for an existing file (no auth needed – read-only).
 * @param supabase - Any Supabase client (anon is fine for public URLs).
 * @param path     - Relative path inside site-assets.
 */
export function getPublicUrl(supabase: SupabaseClient, path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data?.publicUrl ?? "";
}

export { BUCKET, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES };
