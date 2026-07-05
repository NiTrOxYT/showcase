"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { DURATION, EASE_GSAP, SCROLL_START } from "@/animations/core/tokens";
import { shouldReduceMotion } from "@/animations/utils/reducedMotion";

export type SectionRevealVariant = "fade" | "rise" | "scale" | "mask";

interface UseSectionRevealOptions {
  variant?: SectionRevealVariant;
  delay?: number;
  start?: string;
}

/**
 * GSAP ScrollTrigger section reveal hook.
 * Content is visible at rest — animation enhances, never gates.
 */
export function useSectionReveal<T extends HTMLElement>(
  options: UseSectionRevealOptions = {}
) {
  const { variant = "rise", delay = 0, start = SCROLL_START.normal } = options;
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || shouldReduceMotion()) return;

    const from: gsap.TweenVars =
      variant === "rise"
        ? { opacity: 0, y: 32 }
        : variant === "scale"
        ? { opacity: 0, scale: 0.97 }
        : variant === "mask"
        ? { clipPath: "inset(0 0 100% 0)" }
        : { opacity: 0 };

    const to: gsap.TweenVars =
      variant === "mask"
        ? { clipPath: "inset(0 0 0% 0)" }
        : { opacity: 1, y: 0, scale: 1 };

    const ctx = gsap.context(() => {
      gsap.fromTo(el, from, {
        ...to,
        delay,
        duration: DURATION.slow,
        ease: EASE_GSAP.standard,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [variant, delay, start]);

  return elementRef;
}

void ScrollTrigger;
