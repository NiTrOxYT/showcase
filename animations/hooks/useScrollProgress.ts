"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/providers/SmoothScrollProvider";

/**
 * Tracks scroll progress from 0 (top) to 1 (bottom).
 * Uses Lenis when available, falls back to native scroll event.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const lenis = useLenis();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (lenis) {
      const handler = ({ progress: p }: { progress: number }) => {
        setProgress(p);
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
        setProgress(total > 0 ? scrolled / total : 0);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [lenis]);

  return progress;
}
