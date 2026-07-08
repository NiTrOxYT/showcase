import { createAdminClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";
import { normalizeCategory } from "@/lib/categories";

// Convert Supabase database row to frontend Project model
export function mapRowToProject(row: any): Project {
  return {
    id: row.id,
    title: row.title || "",
    slug: row.slug || "",
    subtitle: row.excerpt || "",
    category: row.category || "Website",
    type: (row.category || "Website") as any,
    featured: !!row.featured,
    order: row.sort_order || 0,
    client: row.client_name || "",
    industry: row.industry || "",
    shortDescription: row.excerpt || "",
    fullDescription: row.description || "",
    technologies: Array.isArray(row.tech_stack) ? row.tech_stack : [],
    thumbnail: row.cover_image || "",
    coverImage: row.cover_image || "",
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    colors: {
      primary: row.theme_color || "oklch(0.60 0.124 70.0)",
      background: "oklch(0.08 0 0)",
    },
    liveUrl: row.live_url || "",
    githubUrl: row.github_url || "",
    completionDate: row.published_at ? new Date(row.published_at).toISOString().split("T")[0] : "",
    status: (row.status || "Draft") as any,
    featuredOrder: row.featuredOrder || (row.is_featured ? 1 : 0),
    tags: Array.isArray(row.tags) ? row.tags : [],
    services: Array.isArray(row.services) ? row.services : [],
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    platform: (row.platform || "Web") as any,
    duration: row.duration || "",
    teamSize: row.team_size || 1,
    repositoryVisibility: (row.repository_visibility || "Private") as any,
    livePreviewAvailable: !!row.live_url,
    caseStudyAvailable: true,
    thumbnailAlt: row.title || "",
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

// Convert frontend Project model to Supabase database row fields
export function mapProjectToRow(p: Partial<Project>): any {
  const row: any = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.subtitle !== undefined) row.excerpt = p.subtitle;
  if (p.category !== undefined) row.category = p.category;
  if (p.featured !== undefined) {
    row.featured = p.featured;
    row.is_featured = p.featured;
  }
  if (p.order !== undefined) row.sort_order = p.order;
  if (p.client !== undefined) row.client_name = p.client;
  if (p.industry !== undefined) row.industry = p.industry;
  if (p.shortDescription !== undefined) row.excerpt = p.shortDescription;
  if (p.fullDescription !== undefined) row.description = p.fullDescription;
  if (p.technologies !== undefined) row.tech_stack = p.technologies;
  if (p.coverImage !== undefined) row.cover_image = p.coverImage;
  if (p.thumbnail !== undefined && !p.coverImage) row.cover_image = p.thumbnail;
  if (p.gallery !== undefined) row.gallery = p.gallery;
  if (p.colors?.primary !== undefined) row.theme_color = p.colors.primary;
  if (p.liveUrl !== undefined) row.live_url = p.liveUrl;
  if (p.githubUrl !== undefined) row.github_url = p.githubUrl;
  if (p.completionDate !== undefined) {
    row.published_at = p.completionDate ? new Date(p.completionDate).toISOString() : null;
  }
  if (p.status !== undefined) {
    row.status = p.status;
    row.is_published = p.status === "Published";
  }
  if (p.tags !== undefined) row.tags = p.tags;
  if (p.services !== undefined) row.services = p.services;
  if (p.deliverables !== undefined) row.deliverables = p.deliverables;
  if (p.platform !== undefined) row.platform = p.platform;
  if (p.duration !== undefined) row.duration = p.duration;
  if (p.teamSize !== undefined) row.team_size = p.teamSize;
  if (p.repositoryVisibility !== undefined) row.repository_visibility = p.repositoryVisibility;
  return row;
}

export const showcaseRepository = {
  // Fetch active published projects
  async getProjects(filter?: string, sortBy?: string): Promise<Project[]> {
    const supabase = createAdminClient();
    let query = supabase.from("projects").select("*");

    const { data, error } = await query;
    if (error || !data) return [];

    let projects = data.map(mapRowToProject);

    // Filter projects locally with normalized categories
    if (filter && filter.trim().toLowerCase() !== "all") {
      const normFilter = normalizeCategory(filter);
      projects = projects.filter(
        (p) => normalizeCategory(p.category) === normFilter
      );
    }

    // Sort
    const sort = sortBy || "featured";
    switch (sort.toLowerCase()) {
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
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return a.order - b.order;
        });
        break;
    }

    return projects;
  },

  async getFeaturedProjects(): Promise<Project[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .or("featured.eq.true,is_featured.eq.true")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(mapRowToProject);
  },

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return undefined;
    return mapRowToProject(data);
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return undefined;
    return mapRowToProject(data);
  },

  async createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    const supabase = createAdminClient();
    const row = mapProjectToRow(project);
    const { data, error } = await supabase
      .from("projects")
      .insert([row])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
    return mapRowToProject(data);
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const supabase = createAdminClient();
    const row = mapProjectToRow(updates);
    const { data, error } = await supabase
      .from("projects")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }
    return mapRowToProject(data);
  },

  async deleteProject(id: string): Promise<boolean> {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
    return true;
  },

  async reorderProjects(ids: string[]): Promise<boolean> {
    const supabase = createAdminClient();
    const promises = ids.map((id, index) =>
      supabase
        .from("projects")
        .update({ sort_order: index + 1 })
        .eq("id", id)
    );

    const results = await Promise.all(promises);
    const failed = results.find((r) => r.error);
    if (failed) {
      throw new Error(`Failed to reorder projects: ${failed.error?.message}`);
    }
    return true;
  },

  async searchProjects(query: string): Promise<Project[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,category.ilike.%${query}%`);

    if (error || !data) return [];
    return data.map(mapRowToProject);
  },

  async getRelatedProjects(slug: string, limit = 2): Promise<Project[]> {
    const current = await this.getProjectBySlug(slug);
    if (!current) return [];

    const all = await this.getProjects();
    const otherProjects = all.filter((p) => p.slug !== slug && p.status === "Published");

    const scored = otherProjects.map((p) => {
      let score = 0;
      if (normalizeCategory(p.category) === normalizeCategory(current.category)) {
        score += 100;
      }
      if (p.industry === current.industry) {
        score += 50;
      }
      const currentTechNames = (current.technologies || []).map((t) => t.name.toLowerCase());
      const pTechNames = (p.technologies || []).map((t) => t.name.toLowerCase());
      const sharedTechCount = pTechNames.filter((name) => currentTechNames.includes(name)).length;
      score += sharedTechCount * 10;

      if (p.featured) {
        score += 5;
      }
      return { project: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.project).slice(0, limit);
  },

  async getLatestProjects(limit = 3): Promise<Project[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "Published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map(mapRowToProject);
  },

  async getCategories(): Promise<string[]> {
    const all = await this.getProjects();
    const categories = all.map((p) => p.category);
    
    const uniqueNormalized = new Set<string>();
    const result: string[] = [];
    
    for (const cat of categories) {
      const norm = normalizeCategory(cat);
      if (norm && !uniqueNormalized.has(norm)) {
        uniqueNormalized.add(norm);
        result.push(cat);
      }
    }
    return result;
  },
};
