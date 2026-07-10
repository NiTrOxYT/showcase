// types/portal.ts — Phase 6: Client Portal & Project Workspace

export type ClientStatus = "Active" | "Inactive" | "Churned";
export type ClientRole = "Client" | "Client Admin";
export type ProjectPhase = "Planning" | "Design" | "Development" | "Testing" | "Review" | "Launch" | "Maintenance";
export type DeliveryStatus = "Active" | "Paused" | "Completed" | "Cancelled";
export type MilestoneStatus = "Upcoming" | "In Progress" | "Completed" | "Delayed" | "Blocked";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";
export type TaskStatus = "Todo" | "In Progress" | "Done" | "Blocked";
export type PortalNotificationType = "project_update" | "new_comment" | "file_uploaded" | "milestone_completed" | "task_assigned";

export interface Client {
  id: string;
  company_name: string;
  primary_contact?: string | null;
  email: string;
  phone?: string | null;
  logo?: string | null;
  website?: string | null;
  linked_lead_id?: string | null;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
  // Joined
  delivery_projects?: DeliveryProject[];
  client_users?: ClientUser[];
}

export interface ClientUser {
  id: string;
  client_id: string;
  auth_user_id?: string | null;
  name: string;
  email: string;
  role: ClientRole;
  last_login?: string | null;
  created_at: string;
}

export interface DeliveryProject {
  id: string;
  client_id: string;
  title: string;
  slug: string;
  description?: string | null;
  current_phase: ProjectPhase;
  status: DeliveryStatus;
  // Progress calculated dynamically — not stored in DB
  progress?: number;
  start_date?: string | null;
  estimated_completion?: string | null;
  // Future-proof nullable fields
  invoice_id?: string | null;
  contract_id?: string | null;
  payment_status?: string | null;
  subscription_id?: string | null;
  repository_url?: string | null;
  staging_url?: string | null;
  production_url?: string | null;
  figma_url?: string | null;
  workspace_url?: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  client?: Client;
  milestones?: ProjectMilestone[];
  tasks?: ProjectTask[];
  files?: ProjectFile[];
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  status: MilestoneStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  milestone_id?: string | null;
  title: string;
  description?: string | null;
  assigned_to?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string | null;
  estimated_hours?: number | null;
  actual_hours?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  entity_type: string;
  entity_id: string;
  author_id?: string | null;
  author_type: "admin" | "client";
  author_name?: string | null;
  message: string;
  attachments: string[];
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  filename: string;
  bucket: string;
  path: string;
  mime: string;
  size_bytes: number;
  checksum?: string | null;
  uploaded_by?: string | null;
  version: number;
  created_at: string;
}

export interface ProjectActivity {
  id: string;
  project_id: string;
  actor: string;
  actor_type: "admin" | "client" | "system";
  action: string;
  entity?: string | null;
  entity_id?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ProposalTemplateSection {
  heading: string;
  body: string;
}

export interface ProposalTemplatePricingBlock {
  item: string;
  price: string;
  unit: string;
}

export interface ProposalTemplateTimeline {
  phase: string;
  duration: string;
}

export interface ProposalTemplateFAQ {
  question: string;
  answer: string;
}

export interface ProposalTemplate {
  id: string;
  title: string;
  description?: string | null;
  sections: ProposalTemplateSection[];
  pricing_blocks: ProposalTemplatePricingBlock[];
  deliverables: string[];
  timeline: ProposalTemplateTimeline[];
  faqs: ProposalTemplateFAQ[];
  terms: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PortalNotification {
  id: string;
  client_user_id: string;
  type: PortalNotificationType;
  title: string;
  description?: string | null;
  read: boolean;
  activity_id?: string | null;
  created_at: string;
}

// Resolved from Supabase session + client_users lookup
export interface PortalSession {
  authUserId: string;
  clientUserId: string;
  clientId: string;
  role: ClientRole;
  name: string;
  email: string;
}

// Analytics widget shape
export interface PortalAnalytics {
  activeClients: number;
  projectsInProgress: number;
  completedProjects: number;
  avgProjectDurationDays: number | null;
  leadConversionRate: number;
  returningClients: number;
  revenuePipeline: null; // placeholder — Phase 7
}
