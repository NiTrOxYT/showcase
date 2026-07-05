"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { useParallax } from "@/animations/hooks/useParallax";

interface ParallaxProps {
  children: React.ReactNode;
  /** Speed multiplier (-0.5 to 0.5). Positive = slow down, negative = reverse. */
  speed?: number;
  className?: string;
}

/**
 * Wraps content in a GPU-only parallax scroll container.
 * Auto-disabled on touch and reduced-motion via the hook.
 */
export function Parallax({ children, speed = 0.15, className }: ParallaxProps) {
  const ref = useParallax<HTMLDivElement>({ speed });

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
