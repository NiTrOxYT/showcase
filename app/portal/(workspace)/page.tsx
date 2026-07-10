import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { getPortalSession } from "@/lib/supabase/middleware";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";
import { Heading } from "@/components/typography/Heading";
import { ProjectProgressBar } from "@/components/portal/ProjectProgressBar";
import { MilestoneTimeline } from "@/components/portal/MilestoneTimeline";
import { FolderKanban, Calendar, History, ArrowRight } from "lucide-react";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export default async function PortalDashboardPage() {
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

  // Fetch client projects
  const projects = await ClientPortalRepository.getProjects({ clientId: session.clientId });

  // Fetch upcoming milestones across client projects
  const allMilestones = await Promise.all(
    projects.map((p) => ClientPortalRepository.getMilestones(p.id))
  );
  const upcomingMilestones = allMilestones
    .flat()
    .filter((m) => m.status !== "Completed")
    .slice(0, 5);

  // Fetch recent activity logs across client projects
  const allActivities = await Promise.all(
    projects.map((p) => ClientPortalRepository.getActivity(p.id))
  );
  const recentActivities = allActivities
    .flat()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Overview stats layout grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-surface/30 border border-border/10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">
            Active Projects
          </span>
          <p className="font-mono text-3xl font-bold mt-2 text-foreground">
            {projects.filter((p) => p.status === "Active").length}
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-surface/30 border border-border/10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">
            Upcoming Milestones
          </span>
          <p className="font-mono text-3xl font-bold mt-2 text-foreground">
            {upcomingMilestones.length}
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-surface/30 border border-border/10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">
            Pending Tasks
          </span>
          <p className="font-mono text-3xl font-bold mt-2 text-foreground">
            {projects.reduce((acc, p) => acc + (p.tasks?.filter((t) => t.status !== "Done").length ?? 0), 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left pane: projects progress */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-border/5 pb-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-foreground font-bold flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-primary" /> Active Deliveries
            </h3>
          </div>

          {projects.length === 0 ? (
            <div className="text-muted text-xs font-mono py-12 text-center border border-dashed border-border/10 rounded-xl">
              No projects linked to your portal profile.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-surface/30 border border-border/10 rounded-2xl p-6 hover:bg-surface/50 transition-all flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-mono text-sm font-bold text-foreground">{proj.title}</h4>
                      <p className="text-[10px] text-muted mt-0.5 font-mono">
                        Phase: {proj.current_phase} • Status: {proj.status}
                      </p>
                    </div>
                    <Link
                      href={`/portal/projects/${proj.id}`}
                      className="text-primary font-mono text-[10px] font-bold hover:underline flex items-center gap-1"
                    >
                      Workspace
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <ProjectProgressBar phase={proj.current_phase} progress={proj.progress ?? 0} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right pane: timeline activity and milestones */}
        <div className="flex flex-col gap-8">
          
          {/* Milestones Widget */}
          <div className="p-6 bg-surface/30 border border-border/10 rounded-2xl flex flex-col gap-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground font-bold border-b border-border/5 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Upcoming Deadlines
            </h4>
            <MilestoneTimeline milestones={upcomingMilestones} />
          </div>

          {/* Activity Widget */}
          <div className="p-6 bg-surface/30 border border-border/10 rounded-2xl flex flex-col gap-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground font-bold border-b border-border/5 pb-2 flex items-center gap-2">
              <History className="w-4 h-4 text-primary animate-pulse" /> Activity Feed
            </h4>
            
            {recentActivities.length === 0 ? (
              <p className="text-muted text-[10px] font-mono">No recent activity logs.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {recentActivities.map((act) => (
                  <div key={act.id} className="font-mono text-[10px] leading-relaxed border-b border-border/5 pb-3 last:border-0 last:pb-0">
                    <p className="font-bold text-foreground capitalize">{act.action.replace(/_/g, " ")}</p>
                    <p className="text-muted mt-0.5">{(act.metadata?.description as string) || "Project update logged"}</p>
                    <span className="text-[9px] text-muted/40 block mt-1">
                      {new Date(act.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
