import React from "react";
import { MarketingMotionShell } from "@/components/motion/MarketingMotionShell";

/**
 * Marketing layout — wraps all marketing routes (/, /showcase, /showcase/[slug]).
 * Mounts the full motion system: custom cursor.
 * Admin routes have their own layout and never mount these.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarketingMotionShell>
      {children}
    </MarketingMotionShell>
  );
}
