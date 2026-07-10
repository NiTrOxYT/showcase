import { siteConfig } from "@/config/site";
import { showcaseRepository } from "@/services/showcaseRepository";

export interface SitemapItem {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export async function getSitemapData(): Promise<SitemapItem[]> {
  const routes = ["", "/showcase", "/book-call"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const projects = await showcaseRepository.getProjects();
  const projectRoutes = projects.map((project) => ({
    url: `${siteConfig.url}/showcase/${project.slug}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Placeholders for future sitemap modules (Blogs, Services, Locations)
  const blogRoutes: SitemapItem[] = []; // Fill dynamically in future blog releases
  const serviceRoutes: SitemapItem[] = []; // Fill dynamically in future services releases
  const locationRoutes: SitemapItem[] = []; // Fill dynamically in future locations releases

  return [...routes, ...projectRoutes, ...blogRoutes, ...serviceRoutes, ...locationRoutes];
}
