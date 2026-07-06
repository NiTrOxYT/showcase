import { showcaseRepository } from "../showcaseRepository";
import type { Project } from "@/types/project";

// Server-side database repository layer for showcase projects connecting to Supabase
export const ProjectRepository = {
  async getAll(): Promise<Project[]> {
    return showcaseRepository.getProjects();
  },

  async getById(id: string): Promise<Project | undefined> {
    return showcaseRepository.getProjectById(id);
  },

  async getBySlug(slug: string): Promise<Project | undefined> {
    return showcaseRepository.getProjectBySlug(slug);
  },

  async create(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    return showcaseRepository.createProject(project);
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    return showcaseRepository.updateProject(id, updates);
  },

  async delete(id: string): Promise<boolean> {
    return showcaseRepository.deleteProject(id);
  },

  async reorder(ids: string[]): Promise<boolean> {
    return showcaseRepository.reorderProjects(ids);
  },

  async search(query: string): Promise<Project[]> {
    return showcaseRepository.searchProjects(query);
  },

  async filter(status?: "Draft" | "Published", category?: string): Promise<Project[]> {
    let projects = await showcaseRepository.getProjects();
    if (status) {
      projects = projects.filter((p) => p.status === status);
    }
    if (category && category.toLowerCase() !== "all") {
      projects = projects.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    return projects;
  },
};
