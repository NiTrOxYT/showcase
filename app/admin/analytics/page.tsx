import React from "react";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { ConversionRepository } from "@/services/repositories/ConversionRepository";
import { BarChart3, TrendingUp, DollarSign, Calendar, Users, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsAdminPage() {
  const stats = await ConversionRepository.getCRMStats();

  const executiveStats = [
    { label: "Total CRM Leads", value: stats.totalLeads, desc: "Cumulative database count", icon: Users, color: "text-primary" },
    { label: "New Leads Today", value: stats.leadsToday, desc: "Logged since midnight", icon: TrendingUp, color: "text-emerald-500" },
    { label: "New Leads This Week", value: stats.leadsThisWeek, desc: "Logged in past 7 days", icon: Activity, color: "text-blue-500" },
    { label: "New Leads This Month", value: stats.leadsThisMonth, desc: "Logged in current month", icon: Activity, color: "text-indigo-500" },
    { label: "Hot Leads", value: stats.hotLeads, desc: "Score >= 80% (High Priority)", icon: Users, color: "text-red-500" },
    { label: "Warm Leads", value: stats.warmLeads, desc: "Score 50% - 79%", icon: Users, color: "text-amber-500" },
    { label: "Cold Leads", value: stats.coldLeads, desc: "Score < 50%", icon: Users, color: "text-slate-500" },
    { label: "Average Budget Estimate", value: stats.avgBudget ? `₹${stats.avgBudget.toLocaleString()}` : "N/A", desc: "Averaged across responses", icon: DollarSign, color: "text-emerald-400" },
  ];

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Portal Telemetry ]
          </span>
          <Heading level={1} className="text-3xl font-black mt-2 tracking-tightest uppercase font-mono flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" /> CRM Analytics
          </Heading>
          <Text className="text-muted/60 text-xs">
            Inspect conversion funnel details, lead distributions, and verified browser activity streams.
          </Text>
        </div>
      </div>

      {/* Grid: Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {executiveStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-lg border border-border/30 bg-surface/10 hover:border-border/60 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-mono font-bold mt-3 text-foreground">
                {stat.value}
              </p>
              <span className="text-[10px] text-muted/40 font-sans mt-1 block">
                {stat.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grid details: Charts/Histograms and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Funnel Widget */}
        <div className="lg:col-span-2 p-6 border border-border/30 bg-surface/10 rounded-lg flex flex-col gap-5">
          <Heading level={3} className="text-xs font-mono uppercase tracking-widest text-foreground border-b border-border/10 pb-3 font-bold">
            Conversion Funnel Analysis
          </Heading>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-muted/70">TOTAL LEADS CAPTURED</span>
                <span className="font-mono font-bold">{stats.totalLeads}</span>
              </div>
              <div className="w-full bg-surface/30 h-2.5 rounded-full overflow-hidden border border-border/10">
                <div className="bg-primary h-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-muted/70">PROPOSALS REQUESTED (RFPs)</span>
                <span className="font-mono font-bold">{stats.activeProposals}</span>
              </div>
              <div className="w-full bg-surface/30 h-2.5 rounded-full overflow-hidden border border-border/10">
                <div className="bg-blue-500 h-full" style={{ width: `${stats.totalLeads > 0 ? (stats.activeProposals / stats.totalLeads) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-muted/70">UPCOMING CONSULTATIONS</span>
                <span className="font-mono font-bold">{stats.upcomingMeetings}</span>
              </div>
              <div className="w-full bg-surface/30 h-2.5 rounded-full overflow-hidden border border-border/10">
                <div className="bg-emerald-500 h-full" style={{ width: `${stats.totalLeads > 0 ? (stats.upcomingMeetings / stats.totalLeads) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Sources breakdown */}
        <div className="p-6 border border-border/30 bg-surface/10 rounded-lg flex flex-col gap-4">
          <Heading level={3} className="text-xs font-mono uppercase tracking-widest text-foreground border-b border-border/10 pb-3 font-bold">
            Lead source Distribution
          </Heading>
          <ul className="flex flex-col gap-3 font-mono text-xs">
            <li className="flex justify-between items-center">
              <span className="text-muted/75">RFP SUBMISSIONS</span>
              <span className="text-foreground/90 font-bold">{stats.activeProposals}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-muted/75">CONSULTATION SLOTS</span>
              <span className="text-foreground/90 font-bold">{stats.upcomingMeetings}</span>
            </li>
            <li className="flex justify-between items-center border-t border-border/5 pt-2">
              <span className="text-muted/50">DIRECT SEARCH / ORGANIC</span>
              <span className="text-muted/50 font-bold">REST</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Grid details: Recent Events Log stream */}
      <div className="p-6 border border-border/30 bg-surface/10 rounded-lg flex flex-col gap-5">
        <Heading level={3} className="text-xs font-mono uppercase tracking-widest text-foreground border-b border-border/10 pb-3 font-bold flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary animate-pulse" /> Verified conversion Activity Log Stream
        </Heading>
        {stats.recentEvents && stats.recentEvents.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            {stats.recentEvents.map((ev: { id: string; event_type: string; page_url: string; created_at: string }) => (
              <div key={ev.id} className="flex justify-between items-center text-xs p-3 bg-background/50 border border-border/10 rounded">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-foreground">{ev.event_type}</span>
                  <span className="text-[10px] font-mono text-muted/50 truncate max-w-sm">{ev.page_url}</span>
                </div>
                <span className="font-mono text-[10px] text-muted/40 uppercase">
                  {new Date(ev.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="font-mono text-xs text-muted/50 py-4">No tracking operations logged in the telemetry cache.</span>
        )}
      </div>

    </div>
  );
}
