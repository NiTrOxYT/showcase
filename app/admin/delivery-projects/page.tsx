import React from "react";
import Link from "next/link";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { FolderKanban, Search, ArrowUpRight } from "lucide-react";
import { ProjectProgressBar } from "@/components/portal/ProjectProgressBar";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    phase?: string;
  }>;
}

export default async function DeliveryProjectsAdminPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search ?? "";
  const status = resolvedParams.status ?? "";
  const phase = resolvedParams.phase ?? "";

  const projects = await ClientPortalRepository.getProjects({
    search: search || undefined,
    status: status || undefined,
    phase: phase || undefined,
  });

  const getStatusColor = (s: string) => {
    if (s === "Active") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (s === "Completed") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (s === "Paused") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-red-500/10 text-red-400 border-red-500/20"; // Cancelled
  };

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Project Delivery ]
          </span>
          <Heading level={1} className="mt-2">Managed Projects</Heading>
        </div>
      </div>

      {/* Toolbar */}
      <form method="GET" className="flex flex-wrap items-center gap-4 bg-surface/30 p-4 rounded-xl border border-border/10">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search projects..."
            className="w-full bg-background border border-border/10 rounded-lg py-2 pl-10 pr-4 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-mono"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select
            name="phase"
            defaultValue={phase}
            className="bg-background border border-border/10 rounded-lg py-2 px-3 text-xs text-muted focus:outline-none focus:border-primary/50 transition-all font-mono"
          >
            <option value="">All Phases</option>
            <option value="Planning">Planning</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Testing">Testing</option>
            <option value="Review">Review</option>
            <option value="Launch">Launch</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <select
            name="status"
            defaultValue={status}
            className="bg-background border border-border/10 rounded-lg py-2 px-3 text-xs text-muted focus:outline-none focus:border-primary/50 transition-all font-mono"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            type="submit"
            className="bg-primary text-background px-4 py-2 rounded-lg text-xs font-mono font-bold hover:opacity-90 transition-all"
          >
            Filter
          </button>
        </div>
      </form>

      {/* List */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/10 rounded-2xl bg-surface/10">
          <FolderKanban className="w-8 h-8 text-muted/40 mb-3" />
          <Text className="text-muted font-mono text-xs text-center">No active delivery projects found.</Text>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-surface/30 hover:bg-surface/50 border border-border/10 hover:border-primary/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-muted uppercase">
                      Client: {project.client?.company_name}
                    </span>
                    <h3 className="font-mono text-sm font-bold text-foreground group-hover:text-primary transition-colors mt-1">
                      {project.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <div className="mt-4">
                  <ProjectProgressBar
                    phase={project.current_phase}
                    progress={project.progress ?? 0}
                    showLabel={true}
                  />
                </div>
              </div>

              <div className="mt-6 border-t border-border/5 pt-4 flex justify-between items-center text-[10px] font-mono">
                <span className="text-muted">
                  Est. Completion: {project.estimated_completion ? new Date(project.estimated_completion).toLocaleDateString() : "TBD"}
                </span>
                <Link
                  href={`/admin/delivery-projects/${project.id}`}
                  className="flex items-center gap-1 text-primary hover:underline font-bold"
                >
                  Workspace
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
