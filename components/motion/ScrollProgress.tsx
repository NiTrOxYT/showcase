"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollProgress } from "@/animations/hooks/useScrollProgress";

/**
 * Thin scroll progress bar fixed at the top of the viewport.
 * Only mount this on /showcase/[slug] pages.
 * Uses amber brand primary color.
 *
 * PERF: scaleX now receives a MotionValue directly — Framer Motion
 * reads it without touching React. Zero re-renders on scroll.
 */
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 100,
        transformOrigin: "left",
        scaleX: progress,
        background: "var(--primary)",
        willChange: "transform",
      }}
    />
  );
}
