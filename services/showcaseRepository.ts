import { mockProjects } from "@/data/mock/projects";
import type { Project } from "@/types/project";

export const showcaseRepository = {
  getProjects(filter?: string, sortBy?: string): Project[] {
    let projects = mockProjects.filter((p) => p.status === "Published");

    // Dynamic Filter
    if (filter && filter.toLowerCase() !== "all") {
      projects = projects.filter(
        (p) => p.category.toLowerCase() === filter.toLowerCase() || p.type.toLowerCase() === filter.toLowerCase()
      );
    }

    // Sort
    if (sortBy) {
      switch (sortBy.toLowerCase()) {
        case "newest":
          projects.sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime());
          break;
        case "oldest":
          projects.sort((a, b) => new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime());
          break;
        case "alphabetical":
          projects.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "featured":
        default:
          projects.sort((a, b) => {
            if (a.featured !== b.featured) {
              return a.featured ? -1 : 1;
            }
            const aVal = a.featuredOrder ?? a.order;
            const bVal = b.featuredOrder ?? b.order;
            return aVal - bVal;
          });
          break;
      }
    } else {
      projects.sort((a, b) => {
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return a.order - b.order;
      });
    }

    return projects;
  },

  getProjectBySlug(slug: string): Project | undefined {
    return mockProjects.find((p) => p.slug === slug && p.status === "Published");
  },

  getRelatedProjects(slug: string, limit = 2): Project[] {
    const current = mockProjects.find((p) => p.slug === slug);
    if (!current) return [];

    const otherProjects = mockProjects.filter((p) => p.slug !== slug && p.status === "Published");

    const scored = otherProjects.map((p) => {
      let score = 0;

      // 1. Same category
      if (p.category === current.category) {
        score += 100;
      }

      // 2. Same industry
      if (p.industry === current.industry) {
        score += 50;
      }

      // 3. Shared technologies
      const currentTechNames = current.technologies.map((t) => t.name.toLowerCase());
      const pTechNames = p.technologies.map((t) => t.name.toLowerCase());
      const sharedTechCount = pTechNames.filter((name) => currentTechNames.includes(name)).length;
      score += sharedTechCount * 10;

      // 4. Featured projects
      if (p.featured) {
        score += 5;
      }

      return { project: p, score };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.project.order - b.project.order;
    });

    return scored.map((s) => s.project).slice(0, limit);
  },

  getUniqueCategories(): string[] {
    const published = mockProjects.filter((p) => p.status === "Published");
    const categories = published.map((p) => p.category);
    return Array.from(new Set(categories));
  },
};
