"use client";

import React from "react";
import { cn } from "@/lib/cn";
import type { ProjectMilestone, MilestoneStatus } from "@/types/portal";
import { CheckCircle, Clock, AlertTriangle, XCircle, Circle } from "lucide-react";

const STATUS_CONFIG: Record<MilestoneStatus, {
  icon: React.ComponentType<{ className?: string }>;
  dotClass: string;
  labelClass: string;
  lineClass: string;
}> = {
  "Completed":  { icon: CheckCircle,    dotClass: "text-green-400",  labelClass: "text-foreground",     lineClass: "bg-green-400" },
  "In Progress":{ icon: Clock,          dotClass: "text-blue-400 animate-pulse", labelClass: "text-foreground", lineClass: "bg-blue-400/50" },
  "Delayed":    { icon: AlertTriangle,  dotClass: "text-amber-400",  labelClass: "text-amber-300",      lineClass: "bg-amber-400/30" },
  "Blocked":    { icon: XCircle,        dotClass: "text-red-400",    labelClass: "text-red-300",        lineClass: "bg-red-400/30" },
  "Upcoming":   { icon: Circle,         dotClass: "text-muted/40",   labelClass: "text-muted",          lineClass: "bg-border/20" },
};

interface MilestoneTimelineProps {
  milestones: ProjectMilestone[];
  className?: string;
}

export function MilestoneTimeline({ milestones, className }: MilestoneTimelineProps) {
  if (milestones.length === 0) {
    return (
      <div className="text-muted text-sm font-mono py-6 text-center">
        No milestones yet.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {milestones.map((ms, idx) => {
        const cfg = STATUS_CONFIG[ms.status];
        const Icon = cfg.icon;
        const isLast = idx === milestones.length - 1;

        return (
          <div key={ms.id} className="flex gap-4">
            {/* Icon + connector line */}
            <div className="flex flex-col items-center">
              <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", cfg.dotClass)} />
              {!isLast && (
                <div className={cn("w-px flex-1 mt-1 mb-1", cfg.lineClass)} style={{ minHeight: "2rem" }} />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-6", isLast && "pb-0")}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("font-mono text-sm font-semibold", cfg.labelClass)}>
                  {ms.title}
                </span>
                <span className={cn(
                  "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border",
                  ms.status === "Completed"   && "bg-green-500/10 text-green-400 border-green-500/20",
                  ms.status === "In Progress" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                  ms.status === "Delayed"     && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  ms.status === "Blocked"     && "bg-red-500/10 text-red-400 border-red-500/20",
                  ms.status === "Upcoming"    && "bg-border/10 text-muted border-border/20",
                )}>
                  {ms.status}
                </span>
              </div>
              {ms.description && (
                <p className="text-xs text-muted mt-1 leading-relaxed">{ms.description}</p>
              )}
              {ms.due_date && (
                <span className="text-[10px] font-mono text-muted/60 mt-1 block">
                  Due {new Date(ms.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
