import type { MetadataRoute } from "next";
import { getSitemapData } from "@/lib/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapData();
}
