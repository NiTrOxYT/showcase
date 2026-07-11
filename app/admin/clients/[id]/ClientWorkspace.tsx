"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, Users, FolderKanban, History, Mail, Phone, Globe, ExternalLink, Plus, RefreshCw, Key, FileText, CheckCircle,
  Trash2, Pencil, Power, X, ShieldAlert, AlertTriangle, Copy, Check
} from "lucide-react";
import type { Client, ProjectActivity, DeliveryProject, ClientUser } from "@/types/portal";
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

  // Portal Users states
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Client" });
  const [tempPassword, setTempPassword] = useState("");
  const [inviting, setInviting] = useState(false);

  // Success view for created credentials
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; temp_pass: string } | null>(null);

  // User Actions states
  const [editingUser, setEditingUser] = useState<ClientUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "Client" });
  const [updatingUser, setUpdatingUser] = useState(false);

  const [resettingUser, setResettingUser] = useState<ClientUser | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState<string | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);

  const [deletingUser, setDeletingUser] = useState<ClientUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Copy helper state
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure at least one capital and symbol
    return pass + "A1!";
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch(`/api/clients/${client.id}/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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

  const openAddUserForm = () => {
    setNewUser({ name: "", email: "", role: "Client" });
    setTempPassword(generatePassword());
    setCreatedCredentials(null);
    setCreatingUser(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setInviting(true);
      const res = await fetch(`/api/clients/${client.id}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newUser,
          password: tempPassword,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create user");
      }
      
      const created = await res.json();
      setCreatedCredentials({
        email: newUser.email,
        temp_pass: created.temp_password || tempPassword,
      });
      setCreatingUser(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to create portal user");
    } finally {
      setInviting(false);
    }
  };

  const openEditModal = (usr: ClientUser) => {
    setEditingUser(usr);
    setEditForm({ name: usr.name, email: usr.email, role: usr.role });
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      setUpdatingUser(true);
      const res = await fetch(`/api/clients/${client.id}/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update user");
      }

      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update user");
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleToggleStatus = async (usr: ClientUser) => {
    try {
      const res = await fetch(`/api/clients/${client.id}/users/${usr.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_status" }),
      });

      if (!res.ok) throw new Error("Failed to toggle status");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle user status");
    }
  };

  const handleResetPassword = async () => {
    if (!resettingUser) return;
    try {
      setResettingPassword(true);
      const res = await fetch(`/api/clients/${client.id}/users/${resettingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_password" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to reset password");
      }

      const data = await res.json();
      setResetNewPassword(data.temp_password);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/clients/${client.id}/users/${deletingUser.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete portal user");
    } finally {
      setDeleting(false);
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
          Portal Users ({users.length || client.client_users?.length || 0})
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
                onClick={openAddUserForm}
                className="bg-primary text-background px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add User
              </button>
            </div>

            {/* Created credentials copy modal banner */}
            {createdCredentials && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 font-mono text-xs text-foreground flex flex-col gap-3">
                <div className="flex justify-between items-center pb-2 border-b border-primary/10">
                  <span className="font-bold text-primary uppercase tracking-wider">Credentials Generated Successfully</span>
                  <button onClick={() => setCreatedCredentials(null)} className="text-muted hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted/70 uppercase">Email</span>
                  <span className="text-foreground font-bold">{createdCredentials.email}</span>
                </div>
                <div className="flex flex-col gap-1 relative">
                  <span className="text-[10px] text-muted/70 uppercase">Temporary Password</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-bold font-mono tracking-wide bg-background/50 px-2 py-1 rounded border border-border/5">{createdCredentials.temp_pass}</span>
                    <button
                      onClick={() => handleCopy(`Email: ${createdCredentials.email}\nPassword: ${createdCredentials.temp_pass}`)}
                      className="p-1.5 bg-background hover:bg-surface border border-border/10 rounded text-muted hover:text-foreground transition-all flex items-center gap-1.5 text-[10px]"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy All"}
                    </button>
                  </div>
                </div>
                <p className="text-[9px] text-muted/50 mt-1 uppercase tracking-wide">Provide these details to the client. Email delivery is not automated.</p>
              </div>
            )}

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
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50"
                    >
                      <option value="Client">Client (Read/Comment)</option>
                      <option value="Client Admin">Client Admin (Invite/Full Access)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Temporary Password</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        placeholder="Password"
                        className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50 flex-1 font-mono tracking-wide"
                      />
                      <button
                        type="button"
                        onClick={() => setTempPassword(generatePassword())}
                        className="bg-surface hover:bg-surface/80 border border-border/10 rounded-lg px-3 text-[10px] uppercase font-mono font-bold text-muted hover:text-foreground transition-all shrink-0"
                      >
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
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

            {loadingUsers ? (
              <div className="flex justify-center py-8 text-xs text-muted font-mono items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading portal accounts...
              </div>
            ) : users.length === 0 ? (
              <div className="text-muted text-xs font-mono py-8 text-center border border-dashed border-border/10 rounded-xl">
                No portal users configured. Add one to enable portal access.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {users.map((usr) => (
                  <div
                    key={usr.id}
                    className="flex justify-between items-center p-4 bg-surface/30 border border-border/10 rounded-xl"
                  >
                    <div className="font-mono text-xs flex-1 min-w-0 pr-4">
                      <p className="font-bold text-foreground truncate">{usr.name}</p>
                      <p className="text-[10px] text-muted mt-0.5 truncate">{usr.email} • {usr.role}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Status badge */}
                      {usr.status === "disabled" ? (
                        <span className="text-[9px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 select-none font-bold uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3" />
                          Disabled
                        </span>
                      ) : usr.auth_user_id ? (
                        <span className="text-[9px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 select-none font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 select-none font-bold uppercase tracking-wider">
                          <Key className="w-3 h-3 animate-pulse" />
                          Pending Auth
                        </span>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 border-l border-border/10 pl-3">
                        <button
                          onClick={() => openEditModal(usr)}
                          className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-lg text-muted transition-all"
                          title="Edit User"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setResettingUser(usr)}
                          className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-lg text-muted transition-all"
                          title="Reset Password"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(usr)}
                          className={`p-1.5 rounded-lg transition-all ${
                            usr.status === "disabled"
                              ? "hover:bg-green-500/10 text-green-400"
                              : "hover:bg-red-500/10 text-red-400"
                          }`}
                          title={usr.status === "disabled" ? "Enable User" : "Disable User"}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(usr)}
                          className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg text-muted transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
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

      {/* ─── MODALS & DIALOGS (ANNEX Styling) ─── */}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-surface/95 border border-border/10 p-6 rounded-2xl flex flex-col gap-5 font-mono text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-border/5 pb-3">
              <span className="font-bold text-foreground text-sm uppercase tracking-wider">Edit Portal User</span>
              <button onClick={() => setEditingUser(null)} className="text-muted hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleEditUser} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] uppercase font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] uppercase font-bold">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] uppercase font-bold">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="Client">Client (Read/Comment)</option>
                  <option value="Client Admin">Client Admin (Invite/Full Access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-border/5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="border border-border/10 hover:bg-surface/50 text-muted px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingUser}
                  className="bg-primary text-background font-bold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"
                >
                  {updatingUser && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-surface/95 border border-border/10 p-6 rounded-2xl flex flex-col gap-4 font-mono text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-border/5 pb-3">
              <span className="font-bold text-foreground text-sm uppercase tracking-wider">Reset User Password</span>
              <button
                onClick={() => {
                  setResettingUser(null);
                  setResetNewPassword(null);
                }}
                className="text-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetNewPassword ? (
              <div className="flex flex-col gap-3 mt-2">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 font-bold text-center">
                  Password Reset Completed!
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <span className="text-[10px] text-muted/70 uppercase">New Temporary Password</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-bold font-mono tracking-wide bg-background/50 px-2 py-1 rounded border border-border/5 flex-1">{resetNewPassword}</span>
                    <button
                      onClick={() => handleCopy(resetNewPassword)}
                      className="p-1.5 bg-background hover:bg-surface border border-border/10 rounded text-muted hover:text-foreground transition-all flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setResettingUser(null);
                    setResetNewPassword(null);
                  }}
                  className="bg-primary text-background font-bold p-2.5 rounded-lg hover:opacity-90 w-full mt-4"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-muted/80 leading-relaxed font-sans text-xs">
                  Are you sure you want to regenerate the credentials for <span className="font-bold text-foreground font-mono">{resettingUser.name}</span>? This will instantly lock them out and generate a new temporary password.
                </p>
                <div className="flex justify-end gap-2 pt-2 border-t border-border/5">
                  <button
                    onClick={() => setResettingUser(null)}
                    className="border border-border/10 hover:bg-surface/50 text-muted px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={resettingPassword}
                    className="bg-primary text-background font-bold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"
                  >
                    {resettingPassword && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-surface/95 border border-border/10 p-6 rounded-2xl flex flex-col gap-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border/5 pb-3">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="font-bold text-foreground text-sm uppercase tracking-wider">Delete Portal Account</span>
            </div>
            
            <p className="text-muted/80 leading-relaxed font-sans text-xs">
              Are you sure you want to permanently delete the portal account for <span className="font-bold text-foreground font-mono">{deletingUser.name}</span> ({deletingUser.email})?
            </p>
            <p className="text-red-400 font-bold bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
              WARNING: This will delete their database profile and permanently de-provision them from Supabase Auth. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/5">
              <button
                onClick={() => setDeletingUser(null)}
                className="border border-border/10 hover:bg-surface/50 text-muted px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
              >
                {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
