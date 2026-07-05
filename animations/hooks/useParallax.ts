"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";
import { shouldReduceMotion, isTouchDevice } from "@/animations/utils/reducedMotion";

interface UseParallaxOptions {
  /** Scroll speed multiplier. Negative = opposite direction. Range: -0.5 to 0.5 */
  speed?: number;
  /** ScrollTrigger start position */
  start?: string;
  /** ScrollTrigger end position */
  end?: string;
}

/**
 * GPU-only (translateY) parallax scroll effect.
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
export function useParallax<T extends HTMLElement>(options: UseParallaxOptions = {}) {
  const { speed = 0.15, start = "top bottom", end = "bottom top" } = options;
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (
      !el ||
      shouldReduceMotion() ||
      isTouchDevice() ||
      (typeof window !== "undefined" && window.location.pathname.startsWith("/admin"))
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [speed, start, end]);

  return elementRef;
}
