import { createAdminClient } from "@/lib/supabase/server";

export interface RedirectRule {
  id: string;
  sourcePath: string;
  destinationPath: string;
  redirectType: number;
  reason?: string;
  createdAt: string;
}

interface RedirectRow {
  id: string;
  source_path: string;
  destination_path: string;
  redirect_type: number;
  reason: string | null;
  created_at: string;
}

export const RedirectRepository = {
  async getAll(): Promise<RedirectRule[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("redirects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching redirects:", error);
      return [];
    }
    return ((data as unknown) as RedirectRow[] || []).map((row) => ({
      id: row.id,
      sourcePath: row.source_path,
      destinationPath: row.destination_path,
      redirectType: row.redirect_type,
      reason: row.reason || "",
      createdAt: row.created_at,
    }));
  },

  async create(redirect: { sourcePath: string; destinationPath: string; redirectType: number; reason?: string }): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("redirects").insert({
      source_path: redirect.sourcePath,
      destination_path: redirect.destinationPath,
      redirect_type: redirect.redirectType,
      reason: redirect.reason,
    });
    if (error) {
      console.error("Error creating redirect:", error);
      return false;
    }
    return true;
  },

  async delete(id: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("redirects").delete().eq("id", id);
    if (error) {
      console.error("Error deleting redirect:", error);
      return false;
    }
    return true;
  },
};
