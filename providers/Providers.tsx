"use client";

import React from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { CursorProvider } from "@/providers/CursorProvider";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";

import { ExitIntentModal } from "@/components/ui/ExitIntentModal";
import { LiveActivityWidget } from "@/components/ui/LiveActivityWidget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <CursorProvider>
        <SmoothScrollProvider>
          {children}
          <ExitIntentModal />
          <LiveActivityWidget />
        </SmoothScrollProvider>
      </CursorProvider>
    </ThemeProvider>
  );
}
