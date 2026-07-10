import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { getPortalSession } from "@/lib/supabase/middleware";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";
import { Heading } from "@/components/typography/Heading";
import { ProjectProgressBar } from "@/components/portal/ProjectProgressBar";
import { FolderKanban, ArrowRight } from "lucide-react";
import type { NextRequest } from "next/server";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

export default async function PortalProjectsPage() {
  const headersList = await headers();
  const cookiesHeader = headersList.get("cookie") || "";
  
  const mockReq = {
    cookies: {
      getAll: () => cookiesHeader.split(";").map((c) => {
        const [name, ...val] = c.trim().split("=");
        return { name, value: val.join("=") };
      })
    }
  } as unknown as NextRequest;

  const session = await getPortalSession(mockReq);
  if (!session) return null;

  const projects = await ClientPortalRepository.getProjects({ clientId: session.clientId });

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header */}
      <div>
        <Heading level={1}>My Projects</Heading>
        <p className="text-xs text-muted font-mono mt-1">Review active deliveries and sprint updates.</p>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/10 rounded-2xl bg-surface/10">
          <FolderKanban className="w-8 h-8 text-muted/40 mb-3" />
          <p className="text-muted font-mono text-xs text-center">No projects registered on this account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-surface/30 hover:bg-surface/50 border border-border/10 hover:border-primary/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-mono text-sm font-bold text-foreground">
                    {project.title}
                  </h3>
                  <span className={cn(
                    "text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
                    project.status === "Active" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    project.status === "Completed" && "bg-green-500/10 text-green-400 border-green-500/20",
                    project.status === "Paused" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    project.status === "Cancelled" && "bg-red-500/10 text-red-400 border-red-500/20"
                  )}>
                    {project.status}
                  </span>
                </div>

                <div className="mt-4">
                  <ProjectProgressBar
                    phase={project.current_phase}
                    progress={project.progress ?? 0}
                  />
                </div>
              </div>

              <div className="mt-6 border-t border-border/5 pt-4 flex justify-between items-center text-[10px] font-mono text-muted">
                <span>
                  Est. Completion: {project.estimated_completion ? new Date(project.estimated_completion).toLocaleDateString() : "TBD"}
                </span>
                <Link
                  href={`/portal/projects/${project.id}`}
                  className="flex items-center gap-1 text-primary hover:underline font-bold"
                >
                  Open Workspace
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
