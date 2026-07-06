import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { showcaseRepository } from "@/services/showcaseRepository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/showcase", "/contact"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const projects = await showcaseRepository.getProjects();
  const projectRoutes = projects.map((project) => ({
    url: `${siteConfig.url}/showcase/${project.slug}`,
    lastModified: project.updatedAt || new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...routes, ...projectRoutes];
}
