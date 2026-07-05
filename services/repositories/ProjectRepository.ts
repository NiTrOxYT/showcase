/* eslint-disable @typescript-eslint/no-explicit-any */
import { readDb, writeDb } from "@/data/mock/db";
import type { Project } from "@/types/project";

export const ProjectRepository = {
  getAll(): Project[] {
    const db = readDb();
    return db.projects || [];
  },

  getById(id: string): Project | undefined {
    const projects = this.getAll();
    return projects.find((p) => p.id === id);
  },

  getBySlug(slug: string): Project | undefined {
    const projects = this.getAll();
    return projects.find((p) => p.slug === slug);
  },

  create(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
    const db = readDb();
    const newProject: Project = {
      ...project,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.projects = [...(db.projects || []), newProject];
    writeDb(db);
    return newProject;
  },

  update(id: string, updates: Partial<Project>): Project {
    const db = readDb();
    const index = db.projects.findIndex((p: any) => p.id === id);
    if (index === -1) throw new Error(`Project with ID ${id} not found.`);

    const updatedProject = {
      ...db.projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db.projects[index] = updatedProject;
    writeDb(db);
    return updatedProject;
  },

  delete(id: string): boolean {
    const db = readDb();
    const lengthBefore = db.projects.length;
    db.projects = db.projects.filter((p: any) => p.id !== id);
    writeDb(db);
    return db.projects.length < lengthBefore;
  },

  reorder(ids: string[]): Project[] {
    const db = readDb();
    const projectMap = new Map<string, any>(db.projects.map((p: any) => [p.id, p]));
    db.projects = ids.map((id, index) => {
      const project = projectMap.get(id);
      if (project) {
        project.order = index + 1;
        return project;
      }
      throw new Error(`Project ID ${id} not found in database.`);
    });
    writeDb(db);
    return db.projects;
  },

  search(query: string): Project[] {
    const projects = this.getAll();
    const q = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  },

  filter(status?: "Draft" | "Published", category?: string): Project[] {
    let projects = this.getAll();
    if (status) {
      projects = projects.filter((p) => p.status === status);
    }
    if (category && category.toLowerCase() !== "all") {
      projects = projects.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    return projects;
  },
};
