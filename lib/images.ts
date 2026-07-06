/**
 * lib/images.ts
 * Central image utilities — URL validation, fallback, Cloudinary helpers.
 * All components must use this instead of passing raw URLs directly.
 */

// ─── Placeholder ─────────────────────────────────────────────────────────────

/** 1×1 transparent data URI — renders nothing, preserves layout, zero CLS */
const PLACEHOLDER_BLUR =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/** Solid dark placeholder shown while real image loads */
export const PLACEHOLDER_SRC = PLACEHOLDER_BLUR;

// ─── URL validation ──────────────────────────────────────────────────────────

const ALLOWED_PROTOCOLS = ["https:", "http:"];

export function isValidImageUrl(url: string | null | undefined): url is string {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return false;
  if (trimmed.startsWith("/")) return true; // relative paths OK
  try {
    const parsed = new URL(trimmed);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Return a safe image src — falls back to PLACEHOLDER_SRC if invalid.
 * Use this before passing any url to <Image> or <img>.
 */
export function safeSrc(url: string | null | undefined): string {
  return isValidImageUrl(url) ? url!.trim() : PLACEHOLDER_SRC;
}

// ─── Cloudinary helpers ───────────────────────────────────────────────────────

const CLOUDINARY_BASE = "https://res.cloudinary.com";

export function isCloudinaryUrl(url: string | null | undefined): boolean {
  if (!isValidImageUrl(url)) return false;
  return url!.startsWith(CLOUDINARY_BASE);
}

/**
 * Add Cloudinary image transformations to an existing URL.
 * Safe to call on non-Cloudinary URLs — returns them unchanged.
 *
 * @param url       Original URL stored in DB
 * @param transform Cloudinary transformation string, e.g. "w_1200,f_auto,q_auto"
 */
export function cloudinaryTransform(
  url: string | null | undefined,
  transform: string
): string {
  if (!isCloudinaryUrl(url)) return safeSrc(url);
  const safe = url!.trim();
  // Insert transformation after /upload/
  return safe.replace("/upload/", `/upload/${transform}/`);
}

// ─── Common presets ────────────────────────────────────────────────────────────

export const CL = {
  /** Project cover / hero — 1200px wide, auto format, quality 80 */
  cover: (url: string | null | undefined) =>
    cloudinaryTransform(url, "w_1200,f_auto,q_80"),
  /** Card thumbnail — 800px wide */
  thumbnail: (url: string | null | undefined) =>
    cloudinaryTransform(url, "w_800,f_auto,q_80"),
  /** Gallery image — 1600px wide */
  gallery: (url: string | null | undefined) =>
    cloudinaryTransform(url, "w_1600,f_auto,q_85"),
  /** Logo — 400px wide, lossless-ish */
  logo: (url: string | null | undefined) =>
    cloudinaryTransform(url, "w_400,f_auto,q_90"),
};
