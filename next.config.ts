import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ── Cloudinary (primary media host) ──────────────────────────────────
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // ── Supabase Storage (fallback / legacy uploads) ──────────────────────
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
      // ── Development / placeholder services ───────────────────────────────
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
    ],
  },
};

export default nextConfig;
