import React from "react";
import Link from "next/link";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { ProjectRepository } from "@/services/repositories/ProjectRepository";
import { CategoryRepository } from "@/services/repositories/CategoryRepository";
import { TechnologyRepository } from "@/services/repositories/TechnologyRepository";
import { ConversionRepository } from "@/services/repositories/ConversionRepository";
import {
  FileText,
  Activity,
  CloudLightning,
  Plus,
  Users,
  Calendar,
  BarChart2,
  Sparkles
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Query both showcase metrics and CRM telemetry in parallel
  const [projects, categoriesCount, technologiesCount, crmStats] = await Promise.all([
    ProjectRepository.getAll(),
    CategoryRepository.getAll().then((r) => r.length),
    TechnologyRepository.getAll().then((r) => r.length),
    ConversionRepository.getCRMStats(),
  ]);

  const publishedCount = projects.filter((p) => p.status === "Published").length;
  const draftCount = projects.filter((p) => p.status === "Draft").length;

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updatedAt || "").getTime() - new Date(a.updatedAt || "").getTime()
  );
  const lastUpdated = sortedProjects[0]?.updatedAt
    ? new Date(sortedProjects[0].updatedAt).toLocaleDateString()
    : "Never";

  const stats = [
    { label: "CRM Total Leads", value: crmStats.totalLeads, icon: Users, color: "text-primary" },
    { label: "New Leads Today", value: crmStats.leadsToday, icon: Sparkles, color: "text-emerald-500" },
    { label: "Active Proposals", value: crmStats.activeProposals, icon: FileText, color: "text-blue-500" },
    { label: "Scheduled Meetings", value: crmStats.upcomingMeetings, icon: Calendar, color: "text-amber-500" },
  ];

  return (
    <div className="flex flex-col gap-10 select-none">
      {/* Header section */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Portal Home ]
          </span>
          <Heading level={1} className="text-3xl font-black mt-2 tracking-tightest uppercase font-mono">
            OPERATING SYSTEM CONTROL
          </Heading>
          <Text className="text-muted/60 text-xs">
            Review site telemetry metrics, manage showcase database layers, and track Sales CRM pipeline.
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2 bg-primary text-background rounded hover:bg-primary/90 font-bold transition-all duration-300 shadow-lg"
          >
            <Plus className="w-3 h-3" /> New Project
          </Link>
        </div>
      </div>

      {/* Stats counters grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-lg border border-border/40 bg-surface/10 hover:border-border transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted/60 font-bold">
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl md:text-3xl font-mono font-bold mt-4 text-foreground">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Advanced Telemetry Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core telemetry details */}
        <div className="lg:col-span-2 p-6 rounded-lg border border-border/40 bg-surface/10 flex flex-col gap-6">
          <Heading level={3} className="text-sm font-mono uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border/10 pb-4">
            <Activity className="w-4 h-4 text-primary animate-pulse" /> Showcase Telemetry Overview
          </Heading>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">
                Showcase Projects
              </span>
              <span className="font-sans text-xs text-foreground/80 font-medium">
                {projects.length} entries ({publishedCount} Published, {draftCount} Drafts)
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">
                Taxonomy Categories
              </span>
              <span className="font-sans text-xs text-foreground/80 font-medium">
                {categoriesCount} categories declared
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">
                Stack Technologies
              </span>
              <span className="font-sans text-xs text-foreground/80 font-medium">
                {technologiesCount} libraries linked
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">
                Last Showcase Update
              </span>
              <span className="font-sans text-xs text-foreground/80 font-medium">
                {lastUpdated}
              </span>
            </div>
          </div>
        </div>

        {/* System parameters panel */}
        <div className="p-6 rounded-lg border border-border/40 bg-surface/10 flex flex-col gap-6">
          <Heading level={3} className="text-sm font-mono uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border/10 pb-4">
            <CloudLightning className="w-4 h-4 text-primary" /> Sales CRM Summary
          </Heading>

          <ul className="flex flex-col gap-4">
            <li className="flex justify-between items-center text-xs">
              <span className="font-mono text-muted/70">HOT QUALIFIED LEADS</span>
              <span className="font-sans text-[11px] font-bold text-red-400 uppercase">{crmStats.hotLeads} Leads</span>
            </li>
            <li className="flex justify-between items-center text-xs">
              <span className="font-mono text-muted/70">WARM QUALIFIED LEADS</span>
              <span className="font-sans text-[11px] font-bold text-amber-400 uppercase">{crmStats.warmLeads} Leads</span>
            </li>
            <li className="flex justify-between items-center text-xs">
              <span className="font-mono text-muted/70">AVERAGE LEAD BUDGET</span>
              <span className="font-sans text-[11px] font-bold text-emerald-400 uppercase">₹{crmStats.avgBudget.toLocaleString()}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CRM Recent Leads & activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads table */}
        <div className="lg:col-span-2 p-6 rounded-lg border border-border/40 bg-surface/10 flex flex-col gap-4">
          <Heading level={3} className="text-sm font-mono uppercase tracking-widest text-foreground border-b border-border/10 pb-4 flex justify-between items-center">
            <span>Recent Incoming CRM Leads</span>
            <Link href="/admin/leads" className="text-[10px] text-primary hover:underline uppercase tracking-widest">View Registry</Link>
          </Heading>
          
          {crmStats.recentLeads.length > 0 ? (
            <div className="flex flex-col divide-y divide-border/10">
              {crmStats.recentLeads.map((item: { id: string; full_name: string; company?: string; email: string; status: string }) => (
                <div key={item.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-bold text-foreground">{item.full_name}</span>
                    <span className="font-mono text-[9px] text-muted/50 uppercase mt-0.5">{item.company || item.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface border border-border/20 text-muted/70">
                      {item.status}
                    </span>
                    <Link
                      href={`/admin/leads/${item.id}`}
                      className="font-mono text-[9px] text-primary uppercase tracking-wider hover:underline"
                    >
                      Workspace
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="font-mono text-xs text-muted/50 py-4">No recent database operations logged.</span>
          )}
        </div>

        {/* Quick Operations Actions */}
        <div className="p-6 rounded-lg border border-border/40 bg-surface/10 flex flex-col gap-4">
          <Heading level={3} className="text-sm font-mono uppercase tracking-widest text-foreground border-b border-border/10 pb-4">
            Sales Actions
          </Heading>
          
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/leads"
              className="flex items-center justify-between p-3 rounded border border-border/20 hover:border-primary/40 hover:bg-surface/10 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted/60" />
                <span className="font-mono text-xs uppercase text-foreground">Lead registry Desk</span>
              </div>
              <span className="font-mono text-[9px] text-muted">→</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center justify-between p-3 rounded border border-border/20 hover:border-primary/40 hover:bg-surface/10 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted/60" />
                <span className="font-mono text-xs uppercase text-foreground">Meeting Schedule</span>
              </div>
              <span className="font-mono text-[9px] text-muted">→</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center justify-between p-3 rounded border border-border/20 hover:border-primary/40 hover:bg-surface/10 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-muted/60" />
                <span className="font-mono text-xs uppercase text-foreground">Analytics dashboard</span>
              </div>
              <span className="font-mono text-[9px] text-muted">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
