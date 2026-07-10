import React from "react";
import { cn } from "@/lib/cn";
import type { ProjectPhase } from "@/types/portal";

const PHASES: ProjectPhase[] = [
  "Planning", "Design", "Development", "Testing", "Review", "Launch", "Maintenance",
];

interface ProjectProgressBarProps {
  phase: ProjectPhase;
  progress: number;
  className?: string;
  showLabel?: boolean;
}

export function ProjectProgressBar({ phase, progress, className, showLabel = true }: ProjectProgressBarProps) {
  const phaseIndex = PHASES.indexOf(phase);
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            {phase}
          </span>
          <span className="font-mono text-xs text-muted">{clampedProgress}%</span>
        </div>
      )}

      {/* Phase track */}
      <div className="flex gap-1 mb-1">
        {PHASES.map((p, i) => (
          <div
            key={p}
            title={p}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-500",
              i < phaseIndex
                ? "bg-primary"
                : i === phaseIndex
                  ? "bg-primary/60"
                  : "bg-border/20"
            )}
          />
        ))}
      </div>

      {/* Milestone progress bar */}
      <div className="h-2 bg-border/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
