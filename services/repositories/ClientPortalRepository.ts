import { createAdminClient } from "@/lib/supabase/server";
import type {
  Client,
  ClientUser,
  DeliveryProject,
  ProjectMilestone,
  ProjectTask,
  Comment,
  ProjectFile,
  ProjectActivity,
  ProposalTemplate,
  PortalNotification,
  PortalSession,
  PortalAnalytics,
} from "@/types/portal";

/* eslint-disable @typescript-eslint/no-explicit-any */
const getSupabase = () => createAdminClient() as any;

// ============================================================
// Clients
// ============================================================

export const ClientPortalRepository = {
  // --- Clients ---

  async getClients(filters?: { search?: string; status?: string }): Promise<Client[]> {
    const sb = getSupabase();
    let q = sb
      .from("clients")
      .select("*, client_users(id), delivery_projects(id, status)")
      .order("created_at", { ascending: false });

    if (filters?.search) {
      q = q.or(`company_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    if (filters?.status) {
      q = q.eq("status", filters.status);
    }

    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async getClientById(id: string): Promise<Client | null> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("clients")
      .select(`
        *,
        client_users(*),
        delivery_projects(*, project_milestones(id, status))
      `)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async createClient(data: Omit<Client, "id" | "created_at" | "updated_at">): Promise<Client> {
    const sb = getSupabase();
    const { data: created, error } = await sb
      .from("clients")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return created;
  },

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    const sb = getSupabase();
    const { data: updated, error } = await sb
      .from("clients")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return updated;
  },

  async convertLeadToClient(leadId: string): Promise<{ client: Client; project: DeliveryProject }> {
    const sb = getSupabase();

    // Fetch lead data
    const { data: lead, error: leadErr } = await sb
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();
    if (leadErr) throw leadErr;

    // Create client
    const { data: client, error: clientErr } = await sb
      .from("clients")
      .insert({
        company_name: lead.company || lead.full_name,
        primary_contact: lead.full_name,
        email: lead.email,
        phone: lead.phone ?? null,
        website: lead.website ?? null,
        linked_lead_id: leadId,
        status: "Active",
      })
      .select()
      .single();
    if (clientErr) throw clientErr;

    // Create first delivery project
    const slug = `${(lead.company || lead.full_name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-project`;
    const { data: project, error: projErr } = await sb
      .from("delivery_projects")
      .insert({
        client_id: client.id,
        title: `${lead.company || lead.full_name} — ${lead.project_type ?? "Project"}`,
        slug,
        description: lead.message ?? null,
        current_phase: "Planning",
        status: "Active",
      })
      .select()
      .single();
    if (projErr) throw projErr;

    // Mark lead as Won (in case it wasn't)
    await sb.from("leads").update({ status: "Won" }).eq("id", leadId);

    // Log activity
    await sb.from("project_activity").insert({
      project_id: project.id,
      actor: "system",
      actor_type: "system",
      action: "project_created",
      entity: "delivery_project",
      entity_id: project.id,
      metadata: { lead_id: leadId, company_name: client.company_name },
    });

    return { client, project };
  },

  // --- Client Users ---

  async getClientUsers(clientId: string): Promise<ClientUser[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("client_users")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async createClientUser(data: Omit<ClientUser, "id" | "created_at">): Promise<ClientUser> {
    const sb = getSupabase();
    const { data: created, error } = await sb
      .from("client_users")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return created;
  },

  async updateClientUser(id: string, data: Partial<ClientUser>): Promise<ClientUser> {
    const sb = getSupabase();
    const { data: updated, error } = await sb
      .from("client_users")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return updated;
  },

  // Resolve session from Supabase auth uid
  async resolvePortalSession(authUserId: string): Promise<PortalSession | null> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("client_users")
      .select("id, client_id, role, name, email, status")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    if (error || !data || data.status !== "active") return null;
    return {
      authUserId,
      clientUserId: data.id,
      clientId: data.client_id,
      role: data.role,
      name: data.name,
      email: data.email,
    };
  },

  // --- Delivery Projects ---

  async getProjects(filters?: {
    clientId?: string;
    status?: string;
    phase?: string;
    search?: string;
  }): Promise<DeliveryProject[]> {
    const sb = getSupabase();
    let q = sb
      .from("delivery_projects")
      .select("*, client:clients(id, company_name, logo), project_milestones(id, status)")
      .order("created_at", { ascending: false });

    if (filters?.clientId) q = q.eq("client_id", filters.clientId);
    if (filters?.status) q = q.eq("status", filters.status);
    if (filters?.phase) q = q.eq("current_phase", filters.phase);
    if (filters?.search) q = q.ilike("title", `%${filters.search}%`);

    const { data, error } = await q;
    if (error) throw error;

    // Compute progress dynamically
    return (data ?? []).map((p: any) => {
      const milestones = p.project_milestones ?? [];
      const total = milestones.length;
      const done = milestones.filter((m: any) => m.status === "Completed").length;
      return { ...p, progress: total > 0 ? Math.round((done / total) * 100) : 0 };
    });
  },

  async getProjectById(id: string): Promise<DeliveryProject | null> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("delivery_projects")
      .select(`
        *,
        client:clients(*),
        project_milestones(*),
        project_tasks(*),
        project_files(*)
      `)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const milestones = data.project_milestones ?? [];
    const total = milestones.length;
    const done = milestones.filter((m: any) => m.status === "Completed").length;
    return { ...data, progress: total > 0 ? Math.round((done / total) * 100) : 0 };
  },

  async createProject(data: Omit<DeliveryProject, "id" | "created_at" | "updated_at" | "progress">): Promise<DeliveryProject> {
    const sb = getSupabase();
    const { data: created, error } = await sb
      .from("delivery_projects")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return { ...created, progress: 0 };
  },

  async updateProject(id: string, data: Partial<DeliveryProject>): Promise<DeliveryProject> {
    const sb = getSupabase();
    const { progress: _p, client: _c, milestones: _m, tasks: _t, files: _f, ...payload } = data as any;
    const { data: updated, error } = await sb
      .from("delivery_projects")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    // Log activity if status or phase changed
    if (payload.status) {
      await sb.from("project_activity").insert({
        project_id: id, actor: "admin", actor_type: "admin",
        action: "status_changed", entity: "delivery_project", entity_id: id,
        metadata: { new_status: payload.status },
      });
    }
    if (payload.current_phase) {
      await sb.from("project_activity").insert({
        project_id: id, actor: "admin", actor_type: "admin",
        action: "phase_changed", entity: "delivery_project", entity_id: id,
        metadata: { new_phase: payload.current_phase },
      });
    }

    return { ...updated, progress: 0 };
  },

  // --- Milestones ---

  async getMilestones(projectId: string): Promise<ProjectMilestone[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("project_milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async createMilestone(data: Omit<ProjectMilestone, "id" | "created_at" | "updated_at">): Promise<ProjectMilestone> {
    const sb = getSupabase();
    const { data: created, error } = await sb
      .from("project_milestones")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return created;
  },

  async updateMilestone(id: string, data: Partial<ProjectMilestone>): Promise<ProjectMilestone> {
    const sb = getSupabase();
    const { data: updated, error } = await sb
      .from("project_milestones")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    // Log activity on completion
    if (data.status === "Completed") {
      await sb.from("project_activity").insert({
        project_id: updated.project_id, actor: "admin", actor_type: "admin",
        action: "milestone_completed", entity: "milestone", entity_id: id,
        metadata: { title: updated.title, description: `Milestone "${updated.title}" marked complete` },
      });
    }

    return updated;
  },

  async reorderMilestones(projectId: string, orderedIds: string[]): Promise<void> {
    const sb = getSupabase();
    await Promise.all(
      orderedIds.map((milestoneId, index) =>
        sb.from("project_milestones")
          .update({ display_order: index })
          .eq("id", milestoneId)
          .eq("project_id", projectId)
      )
    );
  },

  async deleteMilestone(id: string): Promise<void> {
    const sb = getSupabase();
    const { error } = await sb.from("project_milestones").delete().eq("id", id);
    if (error) throw error;
  },

  // --- Tasks ---

  async getTasks(projectId: string, filters?: { status?: string; milestoneId?: string }): Promise<ProjectTask[]> {
    const sb = getSupabase();
    let q = sb.from("project_tasks").select("*").eq("project_id", projectId).order("created_at", { ascending: true });
    if (filters?.status) q = q.eq("status", filters.status);
    if (filters?.milestoneId) q = q.eq("milestone_id", filters.milestoneId);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async createTask(data: Omit<ProjectTask, "id" | "created_at" | "updated_at">): Promise<ProjectTask> {
    const sb = getSupabase();
    const { data: created, error } = await sb.from("project_tasks").insert(data).select().single();
    if (error) throw error;
    if (data.assigned_to) {
      await sb.from("project_activity").insert({
        project_id: data.project_id, actor: "admin", actor_type: "admin",
        action: "task_assigned", entity: "task", entity_id: created.id,
        metadata: { title: created.title, assigned_to: data.assigned_to },
      });
    }
    return created;
  },

  async updateTask(id: string, data: Partial<ProjectTask>): Promise<ProjectTask> {
    const sb = getSupabase();
    const { data: updated, error } = await sb.from("project_tasks").update(data).eq("id", id).select().single();
    if (error) throw error;
    return updated;
  },

  async deleteTask(id: string): Promise<void> {
    const sb = getSupabase();
    const { error } = await sb.from("project_tasks").delete().eq("id", id);
    if (error) throw error;
  },

  // --- Files ---

  async getFiles(projectId: string): Promise<ProjectFile[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("project_files")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async createFileRecord(data: Omit<ProjectFile, "id" | "created_at">): Promise<ProjectFile> {
    const sb = getSupabase();
    const { data: created, error } = await sb.from("project_files").insert(data).select().single();
    if (error) throw error;
    // Log activity
    await sb.from("project_activity").insert({
      project_id: data.project_id, actor: data.uploaded_by ?? "admin", actor_type: "admin",
      action: "file_uploaded", entity: "file", entity_id: created.id,
      metadata: { filename: data.filename, mime: data.mime, size: data.size_bytes, description: `File "${data.filename}" uploaded` },
    });
    return created;
  },

  async deleteFileRecord(id: string): Promise<void> {
    const sb = getSupabase();
    // Fetch record first to get storage path
    const { data: file } = await sb.from("project_files").select("bucket, path").eq("id", id).single();
    if (file) {
      await sb.storage.from(file.bucket).remove([file.path]);
    }
    const { error } = await sb.from("project_files").delete().eq("id", id);
    if (error) throw error;
  },

  async getSignedDownloadUrl(bucket: string, path: string): Promise<string> {
    const sb = getSupabase();
    const { data, error } = await sb.storage.from(bucket).createSignedUrl(path, 3600);
    if (error) throw error;
    return data.signedUrl;
  },

  // --- Comments ---

  async getComments(entityType: string, entityId: string): Promise<Comment[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("comments")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async addComment(data: Omit<Comment, "id" | "created_at">): Promise<Comment> {
    const sb = getSupabase();
    const { data: created, error } = await sb.from("comments").insert(data).select().single();
    if (error) throw error;
    // Log activity if on a project
    if (data.entity_type === "delivery_project") {
      await sb.from("project_activity").insert({
        project_id: data.entity_id, actor: data.author_name ?? "Unknown", actor_type: data.author_type,
        action: "comment_added", entity: "comment", entity_id: created.id,
        metadata: { preview: data.message.slice(0, 100), description: `New comment from ${data.author_name ?? "a team member"}` },
      });
    }
    return created;
  },

  // --- Activity ---

  async getActivity(projectId: string): Promise<ProjectActivity[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("project_activity")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async logActivity(data: Omit<ProjectActivity, "id" | "created_at">): Promise<void> {
    const sb = getSupabase();
    const { error } = await sb.from("project_activity").insert(data);
    if (error) throw error;
  },

  // --- Notifications ---

  async getNotifications(clientUserId: string, unreadOnly = false): Promise<PortalNotification[]> {
    const sb = getSupabase();
    let q = sb
      .from("portal_notifications")
      .select("*")
      .eq("client_user_id", clientUserId)
      .order("created_at", { ascending: false });
    if (unreadOnly) q = q.eq("read", false);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async markRead(id: string): Promise<void> {
    const sb = getSupabase();
    const { error } = await sb.from("portal_notifications").update({ read: true }).eq("id", id);
    if (error) throw error;
  },

  async markAllRead(clientUserId: string): Promise<void> {
    const sb = getSupabase();
    const { error } = await sb
      .from("portal_notifications")
      .update({ read: true })
      .eq("client_user_id", clientUserId)
      .eq("read", false);
    if (error) throw error;
  },

  // --- Proposal Templates ---

  async getProposalTemplates(): Promise<ProposalTemplate[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("proposal_templates")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getProposalTemplateById(id: string): Promise<ProposalTemplate | null> {
    const sb = getSupabase();
    const { data, error } = await sb.from("proposal_templates").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },

  async createProposalTemplate(data: Omit<ProposalTemplate, "id" | "created_at" | "updated_at">): Promise<ProposalTemplate> {
    const sb = getSupabase();
    const { data: created, error } = await sb.from("proposal_templates").insert(data).select().single();
    if (error) throw error;
    return created;
  },

  async updateProposalTemplate(id: string, data: Partial<ProposalTemplate>): Promise<ProposalTemplate> {
    const sb = getSupabase();
    const { data: updated, error } = await sb.from("proposal_templates").update(data).eq("id", id).select().single();
    if (error) throw error;
    return updated;
  },

  async deleteProposalTemplate(id: string): Promise<void> {
    const sb = getSupabase();
    const { error } = await sb.from("proposal_templates").delete().eq("id", id);
    if (error) throw error;
  },

  // --- Analytics ---

  async getPortalAnalytics(): Promise<PortalAnalytics> {
    const sb = getSupabase();

    const [
      { count: activeClients },
      { count: projectsInProgress },
      { count: completedProjects },
      { data: allProjects },
      { data: allLeads },
    ] = await Promise.all([
      sb.from("clients").select("*", { count: "exact", head: true }).eq("status", "Active"),
      sb.from("delivery_projects").select("*", { count: "exact", head: true }).eq("status", "Active"),
      sb.from("delivery_projects").select("*", { count: "exact", head: true }).eq("status", "Completed"),
      sb.from("delivery_projects").select("start_date, estimated_completion, status"),
      sb.from("leads").select("status"),
    ]);

    // Avg project duration (days) from completed projects
    const completedWithDates = (allProjects ?? []).filter(
      (p: any) => p.status === "Completed" && p.start_date && p.estimated_completion
    );
    const avgDuration = completedWithDates.length > 0
      ? completedWithDates.reduce((sum: number, p: any) => {
          const days = (new Date(p.estimated_completion).getTime() - new Date(p.start_date).getTime()) / 86400000;
          return sum + days;
        }, 0) / completedWithDates.length
      : null;

    const leads = allLeads ?? [];
    const wonLeads = leads.filter((l: any) => l.status === "Won").length;
    const conversionRate = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0;

    // Returning clients = clients with more than 1 completed project
    const { data: returningData } = await sb
      .from("delivery_projects")
      .select("client_id")
      .eq("status", "Completed");
    const clientCounts = (returningData ?? []).reduce((acc: Record<string, number>, r: any) => {
      acc[r.client_id] = (acc[r.client_id] ?? 0) + 1;
      return acc;
    }, {});
    const returningClients = Object.values(clientCounts).filter((c) => (c as number) > 1).length;

    return {
      activeClients: activeClients ?? 0,
      projectsInProgress: projectsInProgress ?? 0,
      completedProjects: completedProjects ?? 0,
      avgProjectDurationDays: avgDuration !== null ? Math.round(avgDuration) : null,
      leadConversionRate: conversionRate,
      returningClients,
      revenuePipeline: null,
    };
  },
};
