import { showcaseRepository } from "../showcaseRepository";
import type { Technology } from "@/types/project";

// Server-side Technology repository layer querying unique libraries dynamically from Supabase projects
export const TechnologyRepository = {
  async getAll(): Promise<Technology[]> {
    const projects = await showcaseRepository.getProjects();
    const techMap = new Map<string, Technology>();

    projects.forEach((p) => {
      if (Array.isArray(p.technologies)) {
        p.technologies.forEach((t) => {
          if (t && t.name) {
            techMap.set(t.name.toLowerCase(), t);
          }
        });
      }
    });

    return Array.from(techMap.values());
  },

  async create(tech: Technology): Promise<Technology[]> {
    // Technologies are defined dynamically within project tech_stack schemas
    return this.getAll();
  },

  async delete(name: string): Promise<Technology[]> {
    return this.getAll();
  },
};
