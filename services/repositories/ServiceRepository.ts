import { createAdminClient } from "@/lib/supabase/server";
import type { Service } from "@/types/service";

// Mapper to map database rows to Service models
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapRowToService(row: any): Service {
  return {
    id: row.id,
    title: row.title || "",
    slug: row.slug || "",
    shortDescription: row.short_description || "",
    heroTitle: row.hero_title || null,
    heroDescription: row.hero_description || null,
    seoTitle: row.seo_title || null,
    seoDescription: row.seo_description || null,
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    coverImage: row.cover_image || null,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    overview: row.overview || null,
    problem: row.problem && typeof row.problem === "object" ? row.problem : { title: "", description: "", points: [] },
    solution: row.solution && typeof row.solution === "object" ? row.solution : { title: "", description: "", points: [] },
    process: Array.isArray(row.process) ? row.process : [],
    technologies: Array.isArray(row.technologies) ? row.technologies : [],
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    faq: Array.isArray(row.faq) ? row.faq : [],
    ctaTitle: row.cta_title || null,
    ctaDescription: row.cta_description || null,
    featured: !!row.featured,
    sortOrder: row.sort_order || 0,
    status: row.status === "Published" ? "Published" : "Draft",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Mapper to map Service models back to database rows
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapServiceToRow(s: Partial<Service>): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = {};
  if (s.title !== undefined) row.title = s.title;
  if (s.slug !== undefined) row.slug = s.slug;
  if (s.shortDescription !== undefined) row.short_description = s.shortDescription;
  if (s.heroTitle !== undefined) row.hero_title = s.heroTitle;
  if (s.heroDescription !== undefined) row.hero_description = s.heroDescription;
  if (s.seoTitle !== undefined) row.seo_title = s.seoTitle;
  if (s.seoDescription !== undefined) row.seo_description = s.seoDescription;
  if (s.keywords !== undefined) row.keywords = s.keywords;
  if (s.coverImage !== undefined) row.cover_image = s.coverImage;
  if (s.gallery !== undefined) row.gallery = s.gallery;
  if (s.overview !== undefined) row.overview = s.overview;
  if (s.problem !== undefined) row.problem = s.problem;
  if (s.solution !== undefined) row.solution = s.solution;
  if (s.process !== undefined) row.process = s.process;
  if (s.technologies !== undefined) row.technologies = s.technologies;
  if (s.benefits !== undefined) row.benefits = s.benefits;
  if (s.deliverables !== undefined) row.deliverables = s.deliverables;
  if (s.faq !== undefined) row.faq = s.faq;
  if (s.ctaTitle !== undefined) row.cta_title = s.ctaTitle;
  if (s.ctaDescription !== undefined) row.cta_description = s.ctaDescription;
  if (s.featured !== undefined) row.featured = s.featured;
  if (s.sortOrder !== undefined) row.sort_order = s.sortOrder;
  if (s.status !== undefined) row.status = s.status;
  return row;
}

export const ServiceRepository = {
  async getAll(): Promise<Service[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching services:", error);
      return [];
    }
    return (data || []).map(mapRowToService);
  },

  async getPublished(): Promise<Service[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("status", "Published")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching published services:", error);
      return [];
    }
    return (data || []).map(mapRowToService);
  },

  async getBySlug(slug: string): Promise<Service | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error fetching service by slug:", error);
      return null;
    }
    return data ? mapRowToService(data) : null;
  },

  async getById(id: string): Promise<Service | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching service by ID:", error);
      return null;
    }
    return data ? mapRowToService(data) : null;
  },

  async create(service: Partial<Service>): Promise<Service | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const row = mapServiceToRow(service);
    const { data, error } = await supabase
      .from("services")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Error creating service:", error);
      return null;
    }
    return data ? mapRowToService(data) : null;
  },

  async update(id: string, updates: Partial<Service>): Promise<Service | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const row = mapServiceToRow(updates);
    const { data, error } = await supabase
      .from("services")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating service:", error);
      return null;
    }
    return data ? mapRowToService(data) : null;
  },

  async delete(id: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting service:", error);
      return false;
    }
    return true;
  },
};
