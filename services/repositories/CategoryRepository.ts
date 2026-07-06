import { showcaseRepository } from "../showcaseRepository";

// Server-side Category repository layer querying unique categories dynamically from Supabase projects
export const CategoryRepository = {
  async getAll(): Promise<string[]> {
    return showcaseRepository.getCategories();
  },

  async create(name: string): Promise<string[]> {
    // Categories are inferred dynamically from project categories, so create is a no-op
    return showcaseRepository.getCategories();
  },

  async delete(name: string): Promise<string[]> {
    // Categories are deleted automatically when no projects reference them
    return showcaseRepository.getCategories();
  },
};
