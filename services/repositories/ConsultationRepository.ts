import { createAdminClient } from "@/lib/supabase/server";

export interface ConsultationRequest {
  id: string;
  reference_id: string;
  name: string;
  phone: string;
  consultation_type: string;
  address: string | null;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  status: string;
  created_at: string;
}

export const ConsultationRepository = {
  async getAll(): Promise<ConsultationRequest[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("consultation_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ConsultationRepository] Error fetching all:", error);
      return [];
    }
    return data || [];
  },

  async updateStatus(id: string, status: string): Promise<boolean> {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("consultation_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("[ConsultationRepository] Error updating status:", error);
      return false;
    }
    return true;
  }
};
