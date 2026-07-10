"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, Users, FolderKanban, History, Mail, Phone, Globe, ExternalLink, Plus, RefreshCw, Key, FileText, CheckCircle
} from "lucide-react";
import type { Client, ProjectActivity, DeliveryProject } from "@/types/portal";
import { MilestoneTimeline } from "@/components/portal/MilestoneTimeline";

interface ClientWorkspaceProps {
  client: Client;
  timeline: ProjectActivity[];
}

export function ClientWorkspace({ client: initialClient, timeline }: ClientWorkspaceProps) {
  const [client, setClient] = useState<Client>(initialClient);
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "users" | "timeline">("overview");
  
  // Projects states
  const [creatingProject, setCreatingProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", current_phase: "Planning", start_date: "", estimated_completion: "" });

  // User states
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Client" });
  const [inviting, setInviting] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = `${newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
      const res = await fetch("/api/delivery-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: client.id,
          slug,
          status: "Active",
          ...newProject,
        }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const project = await res.json();
      
      setClient((prev) => ({
        ...prev,
        delivery_projects: [...(prev.delivery_projects ?? []), project],
      }));
      setNewProject({ title: "", description: "", current_phase: "Planning", start_date: "", estimated_completion: "" });
      setCreatingProject(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create delivery project");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setInviting(true);
      // Calls admin user creation flow
      const res = await fetch("/api/admin/blog/authors", { // reuse existing users utility if exists or a helper endpoint.
        // Wait, let's look at how client users can be created. We will write an API route for this.
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: client.id,
          ...newUser,
        }),
      });
      
      // Let's create an endpoint POST /api/clients/[id]/users for creating portal users
      const inviteRes = await fetch(`/api/clients/${client.id}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!inviteRes.ok) {
        const errData = await inviteRes.json();
        throw new Error(errData.error || "Failed to create user");
      }
      
      const createdUser = await inviteRes.json();
      setClient((prev) => ({
        ...prev,
        client_users: [...(prev.client_users ?? []), createdUser],
      }));
      setNewUser({ name: "", email: "", role: "Client" });
      setCreatingUser(false);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to create portal user";
      alert(msg);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar navigation tabs */}
      <div className="flex flex-col gap-2 bg-surface/30 p-4 rounded-xl border border-border/10 h-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all ${
            activeTab === "overview" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all ${
            activeTab === "projects" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          Projects ({client.delivery_projects?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all ${
            activeTab === "users" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <Users className="w-4 h-4" />
          Portal Users ({client.client_users?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider text-left transition-all ${
            activeTab === "timeline" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <History className="w-4 h-4" />
          Timeline
        </button>
      </div>

      {/* Main Workspace Workspace Contents */}
      <div className="lg:col-span-3 bg-surface/10 p-6 rounded-2xl border border-border/10">
        
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-mono text-sm font-bold text-foreground border-b border-border/5 pb-2">Client Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 font-mono text-xs text-muted">
                <Building2 className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted/50">COMPANY NAME</p>
                  <p className="text-foreground font-bold">{client.company_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-muted">
                <Users className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted/50">PRIMARY CONTACT</p>
                  <p className="text-foreground font-bold">{client.primary_contact || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-muted">
                <Mail className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted/50">EMAIL ADDRESS</p>
                  <p className="text-foreground font-bold">{client.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-muted">
                <Phone className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted/50">PHONE NUMBER</p>
                  <p className="text-foreground font-bold">{client.phone || "N/A"}</p>
                </div>
              </div>

              {client.website && (
                <div className="flex items-center gap-3 font-mono text-xs text-muted col-span-1 md:col-span-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted/50">WEBSITE</p>
                    <a
                      href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-bold inline-flex items-center gap-1"
                    >
                      {client.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-border/5 pb-2">
              <h3 className="font-mono text-sm font-bold text-foreground">Delivery Projects</h3>
              <button
                onClick={() => setCreatingProject(true)}
                className="bg-primary text-background px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                New Project
              </button>
            </div>

            {creatingProject && (
              <form onSubmit={handleCreateProject} className="bg-surface/30 p-4 rounded-xl border border-border/10 flex flex-col gap-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Project Title</label>
                    <input
                      type="text"
                      required
                      value={newProject.title}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Website Redesign"
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Phase</label>
                    <select
                      value={newProject.current_phase}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, current_phase: e.target.value }))}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50"
                    >
                      <option value="Planning">Planning</option>
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Testing">Testing</option>
                      <option value="Review">Review</option>
                      <option value="Launch">Launch</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Start Date</label>
                    <input
                      type="date"
                      value={newProject.start_date}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, start_date: e.target.value }))}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Estimated Completion</label>
                    <input
                      type="date"
                      value={newProject.estimated_completion}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, estimated_completion: e.target.value }))}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                    <label className="text-muted text-[10px] uppercase font-bold">Description</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Project details..."
                      rows={3}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCreatingProject(false)}
                    className="border border-border/10 hover:bg-surface/50 text-muted px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-background font-bold px-4 py-2 rounded-lg hover:opacity-90"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            )}

            {(client.delivery_projects?.length ?? 0) === 0 ? (
              <div className="text-muted text-xs font-mono py-8 text-center border border-dashed border-border/10 rounded-xl">
                No active projects for this client yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {client.delivery_projects?.map((proj: DeliveryProject) => (
                  <div
                    key={proj.id}
                    className="flex justify-between items-center p-4 bg-surface/30 hover:bg-surface/50 border border-border/10 rounded-xl transition-all"
                  >
                    <div className="font-mono text-xs">
                      <p className="font-bold text-foreground">{proj.title}</p>
                      <p className="text-[10px] text-muted mt-0.5">Phase: {proj.current_phase} • Status: {proj.status}</p>
                    </div>
                    {/* Workspace details redirect or edit */}
                    <Link
                      href={`/admin/delivery-projects/${proj.id}`}
                      className="bg-surface border border-border/10 hover:border-primary/20 text-muted hover:text-foreground text-[10px] font-mono px-3 py-1.5 rounded-lg transition-all"
                    >
                      Open Workspace
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-border/5 pb-2">
              <h3 className="font-mono text-sm font-bold text-foreground">Portal Accounts</h3>
              <button
                onClick={() => setCreatingUser(true)}
                className="bg-primary text-background px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add User
              </button>
            </div>

            {creatingUser && (
              <form onSubmit={handleCreateUser} className="bg-surface/30 p-4 rounded-xl border border-border/10 flex flex-col gap-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="john@company.com"
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    >
                      <option value="Client">Client (Read/Comment)</option>
                      <option value="Client Admin">Client Admin (Invite/Full Access)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCreatingUser(false)}
                    className="border border-border/10 hover:bg-surface/50 text-muted px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="bg-primary text-background font-bold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"
                  >
                    {inviting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    Create Portal User
                  </button>
                </div>
              </form>
            )}

            {(client.client_users?.length ?? 0) === 0 ? (
              <div className="text-muted text-xs font-mono py-8 text-center border border-dashed border-border/10 rounded-xl">
                No portal users configured. Add one to enable portal access.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {client.client_users?.map((usr) => (
                  <div
                    key={usr.id}
                    className="flex justify-between items-center p-4 bg-surface/30 border border-border/10 rounded-xl"
                  >
                    <div className="font-mono text-xs">
                      <p className="font-bold text-foreground">{usr.name}</p>
                      <p className="text-[10px] text-muted mt-0.5">{usr.email} • {usr.role}</p>
                    </div>
                    {usr.auth_user_id ? (
                      <span className="text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 select-none">
                        <CheckCircle className="w-3 h-3" />
                        Activated
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 select-none">
                        <Key className="w-3 h-3 animate-pulse" />
                        Pending Auth
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-mono text-sm font-bold text-foreground border-b border-border/5 pb-2">Client Lifecycle Timeline</h3>
            
            {timeline.length === 0 ? (
              <div className="text-muted text-xs font-mono py-8 text-center">
                No activity recorded on this client yet.
              </div>
            ) : (
              <div className="relative border-l border-border/10 pl-6 ml-3 flex flex-col gap-6">
                {timeline.map((act) => (
                  <div key={act.id} className="relative font-mono text-xs">
                    {/* Indicator dot */}
                    <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-4 border-background" />
                    
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <p className="font-bold text-foreground capitalize">
                        {act.action.replace(/_/g, " ")}
                      </p>
                      <span className="text-[10px] text-muted">
                        {new Date(act.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted mt-1">
                      By {act.actor} ({act.actor_type})
                    </p>
                    {typeof act.metadata?.description === "string" && (
                      <p className="text-xs text-muted/80 mt-1.5 leading-relaxed bg-surface/20 p-2 rounded-lg border border-border/5">
                        {act.metadata.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
