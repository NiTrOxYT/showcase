import { createAdminClient } from "@/lib/supabase/server";

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  position: string;
  visible: boolean;
  sort_order: number;
  parent_id: string | null;
  children?: NavigationItem[];
}

export const navigationRepository = {
  // Fetch nested tree layout for display
  async getNavigation(position = "header"): Promise<NavigationItem[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("navigation")
      .select("*")
      .eq("position", position)
      .eq("visible", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];

    const itemMap = new Map<string, NavigationItem>();
    const roots: NavigationItem[] = [];

    // Map rows to tree structures
    data.forEach((row) => {
      itemMap.set(row.id, {
        id: row.id,
        title: row.title,
        href: row.href,
        position: row.position,
        visible: row.visible,
        sort_order: row.sort_order,
        parent_id: row.parent_id,
        children: [],
      });
    });

    data.forEach((row) => {
      const mapped = itemMap.get(row.id);
      if (mapped) {
        if (row.parent_id) {
          const parent = itemMap.get(row.parent_id);
          if (parent && parent.children) {
            parent.children.push(mapped);
          } else {
            roots.push(mapped);
          }
        } else {
          roots.push(mapped);
        }
      }
    });

    return roots;
  },

  // Fetch flat list of all nodes for CMS editing
  async getAll(): Promise<NavigationItem[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("navigation")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data;
  },

  async create(item: Omit<NavigationItem, "id" | "updated_at">): Promise<NavigationItem> {
    const supabase = createAdminClient();
    const { children, ...dbPayload } = item as any;
    const { data, error } = await supabase
      .from("navigation")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create navigation item: ${error.message}`);
    }
    return data;
  },

  async update(id: string, updates: Partial<NavigationItem>): Promise<NavigationItem> {
    const supabase = createAdminClient();
    const { children, ...dbPayload } = updates as any;
    const { data, error } = await supabase
      .from("navigation")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update navigation item: ${error.message}`);
    }
    return data;
  },

  async delete(id: string): Promise<boolean> {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("navigation")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete navigation item: ${error.message}`);
    }
    return true;
  },

  async reorder(ids: string[]): Promise<boolean> {
    const supabase = createAdminClient();
    
    // Perform bulk updates of sort orders
    const promises = ids.map((id, index) =>
      supabase
        .from("navigation")
        .update({ sort_order: index + 1 })
        .eq("id", id)
    );

    const results = await Promise.all(promises);
    const failed = results.find((r) => r.error);
    if (failed) {
      throw new Error(`Failed to reorder navigation items: ${failed.error?.message}`);
    }

    return true;
  },
};
