"use client";

import React, { useState, useRef } from "react";
import { 
  Building2, Users, FolderKanban, History, Mail, Phone, Globe, ExternalLink, Plus, RefreshCw, Key, FileText, CheckCircle,
  Briefcase, Calendar, CheckSquare, Paperclip, MessageSquare, Clock, Trash2, ArrowUpRight, Upload, Play, AlertTriangle
} from "lucide-react";
import type { DeliveryProject, ProjectMilestone, ProjectTask, Comment, ProjectActivity, MilestoneStatus, TaskPriority, TaskStatus, ProjectPhase, DeliveryStatus } from "@/types/portal";
import { ProjectProgressBar } from "@/components/portal/ProjectProgressBar";
import { MilestoneTimeline } from "@/components/portal/MilestoneTimeline";
import { FileCard } from "@/components/portal/FileCard";
import { cn } from "@/lib/cn";

interface ProjectWorkspaceClientProps {
  project: DeliveryProject;
  initialComments: Comment[];
  initialActivity: ProjectActivity[];
}

export function ProjectWorkspaceClient({ project: initialProject, initialComments, initialActivity }: ProjectWorkspaceClientProps) {
  const [project, setProject] = useState<DeliveryProject>(initialProject);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [activity, setActivity] = useState<ProjectActivity[]>(initialActivity);
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "tasks" | "files" | "discussions" | "activity">("overview");

  // Forms states
  const [updatingProject, setUpdatingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    current_phase: project.current_phase,
    status: project.status,
    start_date: project.start_date ?? "",
    estimated_completion: project.estimated_completion ?? "",
    repository_url: project.repository_url ?? "",
    staging_url: project.staging_url ?? "",
    production_url: project.production_url ?? "",
    figma_url: project.figma_url ?? "",
  });

  // Milestone Form
  const [creatingMilestone, setCreatingMilestone] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({ title: "", description: "", due_date: "", status: "Upcoming" as MilestoneStatus });

  // Task Form
  const [creatingTask, setCreatingTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    milestone_id: "",
    assigned_to: "",
    priority: "Medium" as TaskPriority,
    status: "Todo" as TaskStatus,
    due_date: "",
    estimated_hours: "",
    actual_hours: "",
  });

  // File Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Comment Form
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdatingProject(true);
      const res = await fetch(`/api/delivery-projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });
      if (!res.ok) throw new Error("Failed to update project");
      const updated = await res.json();
      setProject((prev) => ({ ...prev, ...updated }));
      
      // Fetch fresh activity log
      const actRes = await fetch(`/api/delivery-projects/${project.id}/activity`);
      if (actRes.ok) setActivity(await actRes.json());
      
      alert("Project details updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update project details");
    } finally {
      setUpdatingProject(false);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const displayOrder = project.milestones?.length ?? 0;
      const res = await fetch(`/api/delivery-projects/${project.id}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...milestoneForm, display_order: displayOrder }),
      });
      if (!res.ok) throw new Error("Failed to create milestone");
      const created = await res.json();
      setProject((prev) => ({
        ...prev,
        milestones: [...(prev.milestones ?? []), created],
      }));
      setMilestoneForm({ title: "", description: "", due_date: "", status: "Upcoming" });
      setCreatingMilestone(false);
      
      // Refresh activity
      const actRes = await fetch(`/api/delivery-projects/${project.id}/activity`);
      if (actRes.ok) setActivity(await actRes.json());
    } catch (err) {
      console.error(err);
      alert("Failed to add milestone");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/delivery-projects/${project.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskForm,
          estimated_hours: taskForm.estimated_hours ? parseFloat(taskForm.estimated_hours) : null,
          actual_hours: taskForm.actual_hours ? parseFloat(taskForm.actual_hours) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const created = await res.json();
      setProject((prev) => ({
        ...prev,
        tasks: [...(prev.tasks ?? []), created],
      }));
      setTaskForm({
        title: "", description: "", milestone_id: "", assigned_to: "",
        priority: "Medium", status: "Todo", due_date: "", estimated_hours: "", actual_hours: "",
      });
      setCreatingTask(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploaded_by", "admin");

      const res = await fetch(`/api/delivery-projects/${project.id}/files`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("File upload failed");
      const record = await res.json();

      setProject((prev) => ({
        ...prev,
        files: [record, ...(prev.files ?? [])],
      }));

      // Refresh activity
      const actRes = await fetch(`/api/delivery-projects/${project.id}/activity`);
      if (actRes.ok) setActivity(await actRes.json());

    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileDelete = async (id: string) => {
    const res = await fetch(`/api/delivery-projects/${project.id}/files`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId: id }),
    });
    if (!res.ok) throw new Error("Delete failed");
    setProject((prev) => ({
      ...prev,
      files: (prev.files ?? []).filter((f) => f.id !== id),
    }));
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const res = await fetch(`/api/delivery-projects/${project.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_type: "admin",
          author_name: "ANNEX Admin",
          message: newComment.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment");
      const created = await res.json();
      setComments((prev) => [...prev, created]);
      setNewComment("");

      // Refresh activity
      const actRes = await fetch(`/api/delivery-projects/${project.id}/activity`);
      if (actRes.ok) setActivity(await actRes.json());
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Workspace Sidebar Tabs */}
      <div className="flex flex-col gap-2 bg-surface/30 p-4 rounded-xl border border-border/10 h-fit font-mono text-xs uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
            activeTab === "overview" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("milestones")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
            activeTab === "milestones" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Milestones ({project.milestones?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
            activeTab === "tasks" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Tasks ({project.tasks?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
            activeTab === "files" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <Paperclip className="w-4 h-4" />
          Files ({project.files?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab("discussions")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
            activeTab === "discussions" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Discussions ({comments.length})
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
            activeTab === "activity" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <History className="w-4 h-4" />
          Activity Log
        </button>
      </div>

      {/* Main panel */}
      <div className="lg:col-span-3 bg-surface/10 p-6 rounded-2xl border border-border/10">
        
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <form onSubmit={handleUpdateProject} className="flex flex-col gap-6 font-mono text-xs">
            <h3 className="text-sm font-bold text-foreground border-b border-border/5 pb-2">Workspace Profile</h3>
            
            {/* Dynamic Progress indicator */}
            <div className="bg-surface/30 p-4 rounded-xl border border-border/10">
              <ProjectProgressBar phase={project.current_phase} progress={project.progress ?? 0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] uppercase font-bold">Delivery Phase</label>
                <select
                  value={projectForm.current_phase}
                  onChange={(e) => setProjectForm({ ...projectForm, current_phase: e.target.value as ProjectPhase })}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50"
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
                <label className="text-muted text-[10px] uppercase font-bold">Project Status</label>
                <select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as DeliveryStatus })}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] uppercase font-bold">Start Date</label>
                <input
                  type="date"
                  value={projectForm.start_date}
                  onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] uppercase font-bold">Est. Completion</label>
                <input
                  type="date"
                  value={projectForm.estimated_completion}
                  onChange={(e) => setProjectForm({ ...projectForm, estimated_completion: e.target.value })}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-foreground border-b border-border/5 pt-4 pb-2">Workspace Deliveries Integrations (Future-Proof/Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] uppercase font-bold">Figma Workspace URL</label>
                <input
                  type="url"
                  placeholder="https://figma.com/file/..."
                  value={projectForm.figma_url}
                  onChange={(e) => setProjectForm({ ...projectForm, figma_url: e.target.value })}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] uppercase font-bold">Repository Link (GitHub/GitLab)</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={projectForm.repository_url}
                  onChange={(e) => setProjectForm({ ...projectForm, repository_url: e.target.value })}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] uppercase font-bold">Staging Preview Link</label>
                <input
                  type="url"
                  placeholder="https://staging.annex.agency"
                  value={projectForm.staging_url}
                  onChange={(e) => setProjectForm({ ...projectForm, staging_url: e.target.value })}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] uppercase font-bold">Production Domain URL</label>
                <input
                  type="url"
                  placeholder="https://clientwebsite.com"
                  value={projectForm.production_url}
                  onChange={(e) => setProjectForm({ ...projectForm, production_url: e.target.value })}
                  className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/5">
              <button
                type="submit"
                disabled={updatingProject}
                className="bg-primary text-background font-bold px-6 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-2"
              >
                {updatingProject && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Milestones Tab */}
        {activeTab === "milestones" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-border/5 pb-2">
              <h3 className="font-mono text-sm font-bold text-foreground">Delivery Milestones</h3>
              <button
                onClick={() => setCreatingMilestone(true)}
                className="bg-primary text-background px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Milestone
              </button>
            </div>

            {creatingMilestone && (
              <form onSubmit={handleCreateMilestone} className="bg-surface/30 p-4 rounded-xl border border-border/10 flex flex-col gap-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Milestone Title</label>
                    <input
                      type="text"
                      required
                      value={milestoneForm.title}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                      placeholder="e.g. Prototype sign-off"
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Due Date</label>
                    <input
                      type="date"
                      value={milestoneForm.due_date}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, due_date: e.target.value })}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Status</label>
                    <select
                      value={milestoneForm.status}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value as MilestoneStatus })}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                    <label className="text-muted text-[10px] uppercase font-bold">Description</label>
                    <textarea
                      value={milestoneForm.description}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                      placeholder="Milestone details..."
                      rows={2}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCreatingMilestone(false)}
                    className="border border-border/10 hover:bg-surface/50 text-muted px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-background font-bold px-4 py-2 rounded-lg hover:opacity-90"
                  >
                    Add Milestone
                  </button>
                </div>
              </form>
            )}

            <MilestoneTimeline milestones={project.milestones ?? []} />
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-border/5 pb-2">
              <h3 className="font-mono text-sm font-bold text-foreground">Sprint Tasks</h3>
              <button
                onClick={() => setCreatingTask(true)}
                className="bg-primary text-background px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Task
              </button>
            </div>

            {creatingTask && (
              <form onSubmit={handleCreateTask} className="bg-surface/30 p-4 rounded-xl border border-border/10 flex flex-col gap-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Task Title</label>
                    <input
                      type="text"
                      required
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      placeholder="e.g. Build auth UI components"
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Assignee</label>
                    <input
                      type="text"
                      value={taskForm.assigned_to}
                      onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                      placeholder="e.g. Developer Name"
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Associated Milestone</label>
                    <select
                      value={taskForm.milestone_id}
                      onChange={(e) => setTaskForm({ ...taskForm, milestone_id: e.target.value })}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    >
                      <option value="">None (Standalone Task)</option>
                      {project.milestones?.map((m) => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Priority</label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Status</label>
                    <select
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as TaskStatus })}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Due Date</label>
                    <input
                      type="date"
                      value={taskForm.due_date}
                      onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Est. Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={taskForm.estimated_hours}
                      onChange={(e) => setTaskForm({ ...taskForm, estimated_hours: e.target.value })}
                      placeholder="e.g. 8"
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted text-[10px] uppercase font-bold">Actual Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={taskForm.actual_hours}
                      onChange={(e) => setTaskForm({ ...taskForm, actual_hours: e.target.value })}
                      placeholder="e.g. 4"
                      className="bg-background border border-border/10 rounded-lg p-2 text-foreground focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCreatingTask(false)}
                    className="border border-border/10 hover:bg-surface/50 text-muted px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-background font-bold px-4 py-2 rounded-lg hover:opacity-90"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            {(project.tasks?.length ?? 0) === 0 ? (
              <div className="text-muted text-xs font-mono py-8 text-center border border-dashed border-border/10 rounded-xl">
                No tasks logged for this delivery project yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3 font-mono text-xs">
                {project.tasks?.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-surface/30 hover:bg-surface/50 border border-border/10 rounded-xl flex justify-between items-center gap-4"
                  >
                    <div>
                      <p className="font-bold text-foreground">{task.title}</p>
                      <div className="flex gap-2 text-[10px] text-muted mt-0.5">
                        <span>Assigned: {task.assigned_to || "Unassigned"}</span>
                        <span>•</span>
                        <span>Priority: {task.priority}</span>
                        {task.estimated_hours && (
                          <>
                            <span>•</span>
                            <span>{task.actual_hours ?? 0}h / {task.estimated_hours}h</span>
                          </>
                        )}
                      </div>
                    </div>

                    <span className={cn(
                      "text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border select-none",
                      task.status === "Done" && "bg-green-500/10 text-green-400 border-green-500/20",
                      task.status === "In Progress" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      task.status === "Blocked" && "bg-red-500/10 text-red-400 border-red-500/20",
                      task.status === "Todo" && "bg-border/10 text-muted border-border/20"
                    )}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Files Tab */}
        {activeTab === "files" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-border/5 pb-2">
              <h3 className="font-mono text-sm font-bold text-foreground">Project Deliverables</h3>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-primary text-background px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 select-none"
                >
                  {uploading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  Upload Deliverable
                </button>
              </div>
            </div>

            {(project.files?.length ?? 0) === 0 ? (
              <div className="text-muted text-xs font-mono py-8 text-center border border-dashed border-border/10 rounded-xl">
                No deliverables uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.files?.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    showDelete={true}
                    onDelete={handleFileDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === "discussions" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-mono text-sm font-bold text-foreground border-b border-border/5 pb-2">Client Discussion Board</h3>
            
            <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-2 no-scrollbar">
              {comments.length === 0 ? (
                <div className="text-muted text-xs font-mono py-8 text-center">
                  No conversation logs yet. Post the first comment to start discussions.
                </div>
              ) : (
                comments.map((comm) => (
                  <div
                    key={comm.id}
                    className={`p-4 rounded-xl border max-w-[85%] font-mono text-xs ${
                      comm.author_type === "admin"
                        ? "bg-primary/5 border-primary/10 ml-auto"
                        : "bg-surface/30 border-border/10 mr-auto"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4 mb-2 text-[9px] text-muted">
                      <span className="font-bold text-foreground">{comm.author_name || "N/A"}</span>
                      <span>{new Date(comm.created_at).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{comm.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="flex flex-col gap-3 font-mono text-xs border-t border-border/5 pt-4">
              <textarea
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Log internal note or reply to portal thread..."
                rows={3}
                className="bg-background border border-border/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-primary/50 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="bg-primary text-background font-bold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"
                >
                  {submittingComment && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Post Reply
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-mono text-sm font-bold text-foreground border-b border-border/5 pb-2">Structured Audit History Log</h3>
            
            {activity.length === 0 ? (
              <div className="text-muted text-xs font-mono py-8 text-center">
                No delivery history logged yet.
              </div>
            ) : (
              <div className="relative border-l border-border/10 pl-6 ml-3 flex flex-col gap-6">
                {activity.map((act) => (
                  <div key={act.id} className="relative font-mono text-xs">
                    {/* Indicator Dot */}
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
