import { createAdminClient } from "@/lib/supabase/server";

/* eslint-disable @typescript-eslint/no-explicit-any */
const getSupabase = () => createAdminClient() as any;

export interface Lead {
  id?: string;
  full_name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  website?: string | null;
  country?: string | null;
  company_size?: "Solo" | "2-10" | "11-50" | "51-200" | "200+" | null;
  budget?: string | null;
  timeline?: string | null;
  project_type?: "Business Website" | "SaaS" | "AI Automation" | "Mobile App" | "Internal Tool" | "UI/UX Design" | null;
  message?: string | null;
  lead_source?: string | null;
  lead_score?: number;
  qualification?: string;
  status?: "New" | "Reviewing" | "Contacted" | "Proposal Sent" | "Meeting Scheduled" | "Won" | "Lost" | "Archived";
  created_at?: string;
  updated_at?: string;
  clients?: { id: string }[];
}

export interface LeadNote {
  id?: string;
  lead_id: string;
  note: string;
  created_by?: string | null;
  created_at?: string;
}

export interface LeadTimeline {
  id?: string;
  lead_id: string;
  event_type: string;
  details?: Record<string, unknown>;
  created_at?: string;
}

export interface LeadFile {
  id?: string;
  lead_id: string;
  filename: string;
  storage_path: string;
  mime_type: string;
  size: number;
  created_at?: string;
}

export interface Booking {
  id?: string;
  lead_id: string;
  booking_type: "Discovery Call" | "Website Consultation" | "SaaS Consultation" | "AI Automation Consultation";
  requested_date: string;
  requested_time: string;
  timezone: string;
  status?: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  created_at?: string;
  updated_at?: string;
}

export interface ProposalRequest {
  id?: string;
  lead_id: string;
  project_summary: string;
  preferred_budget?: string | null;
  expected_start_date?: string | null;
  project_scope_summary?: string | null;
  estimated_duration?: string | null;
  project_priority?: string | null;
  status?: "Pending" | "Reviewing" | "Accepted" | "Rejected";
  created_at?: string;
  updated_at?: string;
}

export interface ConversionEvent {
  id?: string;
  event_type: string;
  page_url: string;
  referrer?: string | null;
  session_id?: string | null;
  details?: Record<string, unknown>;
  created_at?: string;
}

export const ConversionRepository = {
  // ============================================================
  // Leads CRUD
  // ============================================================
  async createLead(lead: Lead, serviceIds?: string[]): Promise<Lead | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("leads")
      .insert(lead)
      .select()
      .single();

    if (error) {
      console.error("[ConversionRepository] Error creating lead:", error);
      throw new Error(`Database error on 'leads' table creation: ${error.message} (Code: ${error.code})`);
    }

    if (data && serviceIds && serviceIds.length > 0) {
      const mappings = serviceIds.map((serviceId) => ({
        lead_id: data.id,
        service_id: serviceId,
      }));
      const { error: mappingError } = await supabase
        .from("lead_services")
        .insert(mappings);

      if (mappingError) {
        console.error("[ConversionRepository] Error mapping services to lead:", mappingError);
        throw new Error(`Database error on 'lead_services' table mapping: ${mappingError.message} (Code: ${mappingError.code})`);
      }
    }

    return data;
  },

  async getLeads(filters?: {
    search?: string;
    status?: string;
    qualification?: string;
  }): Promise<Lead[]> {
    const supabase = getSupabase();
    let query = supabase.from("leads").select("*");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.qualification) {
      query = query.eq("qualification", filters.qualification);
    }
    if (filters?.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,company.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("[ConversionRepository] Error fetching leads:", error);
      return [];
    }
    return data || [];
  },

  async getLeadById(id: string) {
    const supabase = getSupabase();
    
    // Fetch lead, lead_services (with services details), notes, timeline, files, bookings, and proposal requests in parallel
    const [leadRes, servicesRes, notesRes, timelineRes, filesRes, bookingsRes, proposalsRes] = await Promise.all([
      supabase.from("leads").select("*").eq("id", id).single(),
      supabase.from("lead_services").select("service_id, services(id, title, slug)").eq("lead_id", id),
      supabase.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
      supabase.from("lead_timeline").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
      supabase.from("lead_files").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
      supabase.from("proposal_requests").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    ]);

    if (leadRes.error) {
      console.error("[ConversionRepository] Error fetching lead by id:", leadRes.error);
      return null;
    }

    return {
      ...leadRes.data,
      services: servicesRes.data?.map((s: { services: unknown }) => s.services) || [],
      notes: notesRes.data || [],
      timeline: timelineRes.data || [],
      files: filesRes.data || [],
      bookings: bookingsRes.data || [],
      proposals: proposalsRes.data || [],
    };
  },

  async updateLeadStatus(id: string, status: string): Promise<boolean> {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("[ConversionRepository] Error updating lead status:", error);
      return false;
    }
    return true;
  },

  // ============================================================
  // Notes & Timeline
  // ============================================================
  async addLeadNote(note: LeadNote): Promise<LeadNote | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("lead_notes")
      .insert(note)
      .select()
      .single();

    if (error) {
      console.error("[ConversionRepository] Error adding note:", error);
      return null;
    }

    // Insert to timeline
    await supabase.from("lead_timeline").insert({
      lead_id: note.lead_id,
      event_type: "Note Added",
      details: { note_id: data.id, excerpt: note.note.substring(0, 50) },
    });

    return data;
  },

  async addTimelineEvent(timeline: LeadTimeline): Promise<boolean> {
    const supabase = getSupabase();
    const { error } = await supabase.from("lead_timeline").insert(timeline);
    if (error) {
      console.error("[ConversionRepository] Error adding timeline event:", error);
      return false;
    }
    return true;
  },

  // ============================================================
  // Bookings
  // ============================================================
  async createBooking(booking: Booking): Promise<Booking | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bookings")
      .insert(booking)
      .select()
      .single();

    if (error) {
      console.error("[ConversionRepository] Error creating booking:", error);
      throw new Error(`Database error on 'bookings' table creation: ${error.message} (Code: ${error.code})`);
    }

    // Add timeline
    await supabase.from("lead_timeline").insert({
      lead_id: booking.lead_id,
      event_type: "Booking Requested",
      details: { booking_id: data.id, type: booking.booking_type, date: booking.requested_date },
    });

    return data;
  },

  async getBookings(): Promise<(Booking & { lead: Lead })[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bookings")
      .select("*, lead:leads(*, clients(id))")
      .order("requested_date", { ascending: true })
      .order("requested_time", { ascending: true });

    if (error) {
      console.error("[ConversionRepository] Error fetching bookings:", error);
      return [];
    }
    return data || [];
  },

  async updateBookingStatus(id: string, status: string): Promise<boolean> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select("lead_id, requested_date")
      .single();

    if (error) {
      console.error("[ConversionRepository] Error updating booking status:", error);
      return false;
    }

    if (data) {
      await supabase.from("lead_timeline").insert({
        lead_id: data.lead_id,
        event_type: "Lead Updated",
        details: { change: "Booking status updated", status, requested_date: data.requested_date },
      });
    }

    return true;
  },

  // ============================================================
  // Proposals
  // ============================================================
  async createProposalRequest(proposal: ProposalRequest): Promise<ProposalRequest | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("proposal_requests")
      .insert(proposal)
      .select()
      .single();

    if (error) {
      console.error("[ConversionRepository] Error creating proposal request:", error);
      throw new Error(`Database error on 'proposal_requests' table creation: ${error.message} (Code: ${error.code})`);
    }

    // Add timeline
    await supabase.from("lead_timeline").insert({
      lead_id: proposal.lead_id,
      event_type: "Proposal Requested",
      details: { proposal_id: data.id, budget: proposal.preferred_budget },
    });

    return data;
  },

  async getProposalRequests(): Promise<(ProposalRequest & { lead: Lead })[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("proposal_requests")
      .select("*, lead:leads(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ConversionRepository] Error fetching proposals:", error);
      return [];
    }
    return data || [];
  },

  async updateProposalStatus(id: string, status: string): Promise<boolean> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("proposal_requests")
      .update({ status })
      .eq("id", id)
      .select("lead_id")
      .single();

    if (error) {
      console.error("[ConversionRepository] Error updating proposal status:", error);
      return false;
    }

    if (data) {
      await supabase.from("lead_timeline").insert({
        lead_id: data.lead_id,
        event_type: "Status Changed",
        details: { change: "Proposal status updated", status },
      });
    }

    return true;
  },

  // ============================================================
  // File Logging
  // ============================================================
  async createLeadFile(file: LeadFile): Promise<LeadFile | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("lead_files")
      .insert(file)
      .select()
      .single();

    if (error) {
      console.error("[ConversionRepository] Error creating lead file record:", error);
      throw new Error(`Database error on 'lead_files' table creation: ${error.message} (Code: ${error.code})`);
    }

    // Add timeline
    await supabase.from("lead_timeline").insert({
      lead_id: file.lead_id,
      event_type: "File Uploaded",
      details: { file_id: data.id, filename: file.filename },
    });

    return data;
  },

  // ============================================================
  // Analytics Logging
  // ============================================================
  async logConversionEvent(event: ConversionEvent): Promise<boolean> {
    const supabase = getSupabase();
    const { error } = await supabase.from("conversion_events").insert(event);
    if (error) {
      console.error("[ConversionRepository] Error logging conversion event:", error);
      return false;
    }
    return true;
  },

  // ============================================================
  // CRM Executive Statistics & Analytics Dashboard queries
  // ============================================================
  async getCRMStats() {
    const supabase = getSupabase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfToday = today.toISOString();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfThisWeek = startOfWeek.toISOString();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfThisMonth = startOfMonth.toISOString();

    const [
      totalLeadsRes,
      leadsTodayRes,
      leadsWeekRes,
      leadsMonthRes,
      hotLeadsRes,
      warmLeadsRes,
      coldLeadsRes,
      activeProposalsRes,
      upcomingMeetingsRes,
      recentLeadsRes,
      recentEventsRes,
    ] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startOfToday),
      supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startOfThisWeek),
      supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startOfThisMonth),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("qualification", "Hot"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("qualification", "Warm"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("qualification", "Cold"),
      supabase.from("proposal_requests").select("id", { count: "exact", head: true }).eq("status", "Pending"),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "Confirmed").gte("requested_date", startOfToday.split("T")[0]),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("conversion_events").select("*").order("created_at", { ascending: false }).limit(10),
    ]);

    // Average budget (rough calculations by reading text values or return 0 as placeholder)
    const { data: budgetData } = await supabase.from("leads").select("budget");
    let totalBudgetSum = 0;
    let budgetCount = 0;
    budgetData?.forEach((row: { budget: string | null }) => {
      const nums = row.budget?.replace(/[^0-9]/g, "");
      if (nums) {
        totalBudgetSum += parseInt(nums, 10);
        budgetCount++;
      }
    });
    const avgBudget = budgetCount > 0 ? Math.round(totalBudgetSum / budgetCount) : 0;

    return {
      totalLeads: totalLeadsRes.count || 0,
      leadsToday: leadsTodayRes.count || 0,
      leadsThisWeek: leadsWeekRes.count || 0,
      leadsThisMonth: leadsMonthRes.count || 0,
      hotLeads: hotLeadsRes.count || 0,
      warmLeads: warmLeadsRes.count || 0,
      coldLeads: coldLeadsRes.count || 0,
      activeProposals: activeProposalsRes.count || 0,
      upcomingMeetings: upcomingMeetingsRes.count || 0,
      avgBudget,
      recentLeads: recentLeadsRes.data || [],
      recentEvents: recentEventsRes.data || [],
    };
  }
};
