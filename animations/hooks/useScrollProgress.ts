"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, MotionValue } from "framer-motion";
import { useLenis } from "@/providers/SmoothScrollProvider";

/**
 * Tracks scroll progress from 0 (top) to 1 (bottom).
 * Returns a MotionValue<number> — no React re-renders on scroll.
 * Pass directly to Framer Motion's `style` prop (e.g. scaleX).
 *
 * PERF: Previously returned number via useState, which triggered a React
 * re-render on every scroll tick. MotionValue updates bypass React entirely.
 */
export function useScrollProgress(): MotionValue<number> {
  const progress = useMotionValue(0);
  const lenis = useLenis();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (lenis) {
      const handler = ({ progress: p }: { progress: number }) => {
        progress.set(p);
      };
      lenis.on("scroll", handler);
      return () => lenis.off("scroll", handler);
    }

    // Native fallback
    const handleScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = document.documentElement;
        const scrolled = el.scrollTop;
        const total = el.scrollHeight - el.clientHeight;
        progress.set(total > 0 ? scrolled / total : 0);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [lenis, progress]);

  return progress;
}
