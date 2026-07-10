import { siteConfig } from "@/config/site";
import { showcaseRepository } from "@/services/showcaseRepository";

export interface SitemapItem {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export async function getSitemapData(): Promise<SitemapItem[]> {
  const routes = ["", "/showcase", "/services", "/book-call"].map((route) => ({
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

  // Blog routes
  let blogRoutes: SitemapItem[] = [{ url: `${siteConfig.url}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 }];
  try {
    const { BlogRepository } = await import("@/services/repositories/BlogRepository");
    const [posts, categories, tags] = await Promise.all([
      BlogRepository.getPublishedPosts(),
      BlogRepository.getAllCategories(),
      BlogRepository.getAllTags(),
    ]);
    blogRoutes = [
      ...blogRoutes,
      ...posts.map((p) => ({
        url: `${siteConfig.url}/blog/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: p.featured ? 0.8 : 0.65,
      })),
      ...categories.map((c) => ({
        url: `${siteConfig.url}/blog/category/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
      ...tags.map((t) => ({
        url: `${siteConfig.url}/blog/tag/${t.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.4,
      })),
    ];
  } catch (err) {
    console.error("Sitemap blog routes query error:", err);
  }
  
  let serviceRoutes: SitemapItem[] = [];
  try {
    const { ServiceRepository } = await import("@/services/repositories/ServiceRepository");
    const services = await ServiceRepository.getPublished();
    serviceRoutes = services.map((s) => ({
      url: `${siteConfig.url}/services/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Sitemap service routes query error:", err);
  }

  const locationRoutes: SitemapItem[] = []; // Fill dynamically in future locations releases

  return [...routes, ...projectRoutes, ...blogRoutes, ...serviceRoutes, ...locationRoutes];
}
