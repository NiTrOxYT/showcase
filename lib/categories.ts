/**
 * Normalizes a category or filter string to a standard form.
 * Handles casing, spacing, plurals, and variations.
 */
export function normalizeCategory(cat: string): string {
  if (!cat) return "";
  const s = cat.trim().toLowerCase();
  if (s === "all") return "all";
  if (s === "mobile apps" || s === "mobile app" || s === "mobile") return "mobile app";
  if (s === "web apps" || s === "web app" || s === "web-app" || s === "webapp") return "web app";
  if (s === "websites" || s === "website" || s === "web" || s === "web-site") return "website";
  if (s === "dashboards" || s === "dashboard") return "dashboard";
  if (s === "landing pages" || s === "landing page") return "landing page";
  // fallback for singular/plural
  if (s.endsWith("s")) return s.slice(0, -1);
  return s;
}
