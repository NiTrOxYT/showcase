"use client";

import React, { useState } from "react";
import { 
  Building2, Users, FolderKanban, History, Mail, Phone, Globe, ExternalLink, Plus, RefreshCw, Key, FileText, CheckCircle,
  Briefcase, Calendar, CheckSquare, Paperclip, MessageSquare, Clock, ArrowUpRight, Play, AlertTriangle
} from "lucide-react";
import type { DeliveryProject, ProjectMilestone, Comment, ProjectActivity, PortalSession } from "@/types/portal";
import { ProjectProgressBar } from "@/components/portal/ProjectProgressBar";
import { MilestoneTimeline } from "@/components/portal/MilestoneTimeline";
import { FileCard } from "@/components/portal/FileCard";

interface PortalProjectWorkspaceClientProps {
  project: DeliveryProject;
  initialComments: Comment[];
  initialActivity: ProjectActivity[];
  session: PortalSession;
}

export function PortalProjectWorkspaceClient({ project, initialComments, initialActivity, session }: PortalProjectWorkspaceClientProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [activity] = useState<ProjectActivity[]>(initialActivity);
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "files" | "discussions" | "activity">("overview");

  // Comment Form
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const res = await fetch(`/api/delivery-projects/${project.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_type: "client",
          author_name: session.name,
          message: newComment.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment");
      const created = await res.json();
      setComments((prev) => [...prev, created]);
      setNewComment("");
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
          onClick={() => setActiveTab("files")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
            activeTab === "files" ? "bg-primary text-background font-bold" : "text-muted hover:text-foreground hover:bg-surface/50"
          }`}
        >
          <Paperclip className="w-4 h-4" />
          Deliverables ({project.files?.length ?? 0})
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
          <div className="flex flex-col gap-6 font-mono text-xs">
            <h3 className="text-sm font-bold text-foreground border-b border-border/5 pb-2">Workspace Profile</h3>
            
            {/* Dynamic Progress indicator */}
            <div className="bg-surface/30 p-4 rounded-xl border border-border/10">
              <ProjectProgressBar phase={project.current_phase} progress={project.progress ?? 0} />
            </div>

            {project.description && (
              <div className="flex flex-col gap-1.5 border-t border-border/5 pt-4">
                <label className="text-muted text-[10px] uppercase font-bold">Project Summary</label>
                <p className="text-foreground/90 leading-relaxed font-sans text-xs">{project.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/5 pt-6">
              <div className="flex items-center gap-3 text-muted">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted/50">START DATE</p>
                  <p className="text-foreground font-bold">{project.start_date ? new Date(project.start_date).toLocaleDateString() : "TBD"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted/50">EST. COMPLETION</p>
                  <p className="text-foreground font-bold">{project.estimated_completion ? new Date(project.estimated_completion).toLocaleDateString() : "TBD"}</p>
                </div>
              </div>
            </div>

            {/* External Integration Links */}
            {(project.figma_url || project.repository_url || project.staging_url || project.production_url) && (
              <>
                <h3 className="text-sm font-bold text-foreground border-b border-border/5 pt-4 pb-2">Workspace Deliveries Integrations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.figma_url && (
                    <a
                      href={project.figma_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-surface/30 hover:bg-surface/50 border border-border/10 rounded-xl transition-all"
                    >
                      <span>Figma Prototypes</span>
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </a>
                  )}

                  {project.repository_url && (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-surface/30 hover:bg-surface/50 border border-border/10 rounded-xl transition-all"
                    >
                      <span>Repository Links</span>
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </a>
                  )}

                  {project.staging_url && (
                    <a
                      href={project.staging_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-surface/30 hover:bg-surface/50 border border-border/10 rounded-xl transition-all"
                    >
                      <span>Staging Preview</span>
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </a>
                  )}

                  {project.production_url && (
                    <a
                      href={project.production_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-surface/30 hover:bg-surface/50 border border-border/10 rounded-xl transition-all"
                    >
                      <span>Production Domain</span>
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === "milestones" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-mono text-sm font-bold text-foreground border-b border-border/5 pb-2">Delivery Milestones</h3>
            <MilestoneTimeline milestones={project.milestones ?? []} />
          </div>
        )}

        {/* Files Tab */}
        {activeTab === "files" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-mono text-sm font-bold text-foreground border-b border-border/5 pb-2">Client Deliverables</h3>

            {(project.files?.length ?? 0) === 0 ? (
              <div className="text-muted text-xs font-mono py-8 text-center border border-dashed border-border/10 rounded-xl">
                No deliverables uploaded by ANNEX team yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.files?.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    showDelete={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === "discussions" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-mono text-sm font-bold text-foreground border-b border-border/5 pb-2">Project Discussion Board</h3>
            
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
                      comm.author_type === "client"
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
                placeholder="Type your message here..."
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
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-mono text-sm font-bold text-foreground border-b border-border/5 pb-2">Chronological project activity logs</h3>
            
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
