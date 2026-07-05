"use client";

import React from "react";
import { useMagnetic } from "@/animations/hooks/useMagnetic";

interface MagneticProps {
  children: React.ReactElement;
  /** Magnetic pull strength (0–1) */
  strength?: number;
  returnSpeed?: number;
  disabled?: boolean;
}

/**
 * HOC wrapper that applies magnetic hover pull to its child element.
 * Disabled on touch devices and prefers-reduced-motion automatically.
 * Only accepts a single element child.
 */
export function Magnetic({
  children,
  strength = 0.25,
  returnSpeed = 0.5,
  disabled = false,
}: MagneticProps) {
  const ref = useMagnetic<HTMLDivElement>({ strength, returnSpeed });

  if (disabled) return children;

  return (
    <div ref={ref} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
