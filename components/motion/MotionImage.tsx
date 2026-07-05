"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import { gsap } from "@/animations/gsap";
import { DURATION, EASE_GSAP } from "@/animations/core/tokens";
import { shouldReduceMotion } from "@/animations/utils/reducedMotion";

interface MotionImageProps {
  children: React.ReactNode;
  className?: string;
  /** Reveal style */
  variant?: "fade" | "rise" | "mask";
  delay?: number;
}

/**
 * Wraps an image (or any visual element) with a scroll-triggered reveal.
 * "mask" variant uses clip-path for a premium wipe effect.
 * No layout thrashing — GPU transforms only.
 */
export function MotionImage({
  children,
  className,
  variant = "rise",
  delay = 0,
}: MotionImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || shouldReduceMotion()) return;

    const from: gsap.TweenVars =
      variant === "mask"
        ? { clipPath: "inset(0 0 100% 0 round 4px)" }
        : variant === "rise"
        ? { opacity: 0, y: 24, scale: 0.98 }
        : { opacity: 0 };

    const to: gsap.TweenVars =
      variant === "mask"
        ? { clipPath: "inset(0 0 0% 0 round 4px)" }
        : { opacity: 1, y: 0, scale: 1 };

    const ctx = gsap.context(() => {
      gsap.fromTo(el, from, {
        ...to,
        delay,
        duration: DURATION.hero,
        ease: EASE_GSAP.standard,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [variant, delay]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}
