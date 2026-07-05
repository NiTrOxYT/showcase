"use client";

import { useEffect, useState } from "react";

/**
 * Check prefers-reduced-motion synchronously (safe for SSR — returns false server-side).
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * React hook — reactively tracks prefers-reduced-motion.
 * Returns true if the user prefers reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => shouldReduceMotion());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Returns true if the device is touch-primary (disables cursor, magnetic, parallax).
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/**
 * React hook — reactively tracks touch device status.
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => isTouchDevice());

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isTouch;
}
