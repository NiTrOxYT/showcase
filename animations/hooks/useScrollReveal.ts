"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";
import { DURATION, EASE_GSAP } from "@/animations/core/tokens";
import { shouldReduceMotion } from "@/animations/utils/reducedMotion";

/**
 * Refactored useScrollReveal — uses tokens, respects reduced-motion.
 * Content is always visible at rest (no opacity-0 gate).
 */
export function useScrollReveal<T extends HTMLElement>({
  delay = 0,
  y = 28,
  duration = DURATION.slow,
  start = "top 85%",
}: {
  delay?: number;
  y?: number;
  duration?: number;
  start?: string;
} = {}) {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || shouldReduceMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          delay,
          duration,
          ease: EASE_GSAP.standard,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y, duration, start]);

  return elementRef;
}
