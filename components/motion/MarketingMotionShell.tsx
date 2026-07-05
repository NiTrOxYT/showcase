"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { PageTransition } from "@/components/motion/PageTransition";

export function MarketingMotionShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <CursorFollower />
      <PageTransition routeKey={pathname}>
        {children}
      </PageTransition>
    </>
  );
}
