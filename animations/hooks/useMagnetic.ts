"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "@/animations/gsap";
import { shouldReduceMotion, isTouchDevice } from "@/animations/utils/reducedMotion";

interface UseMagneticOptions {
  /** How much the element moves toward the cursor (0 = none, 1 = full follow) */
  strength?: number;
  /** How quickly it returns on mouse leave */
  returnSpeed?: number;
}

/**
 * Magnetic hover pull effect.
 * GPU-only transform. Disabled on touch and reduced-motion.
 * Call in a "use client" component.
 */
export function useMagnetic<T extends HTMLElement>(options: UseMagneticOptions = {}) {
  const { strength = 0.3, returnSpeed = 0.4 } = options;
  const elementRef = useRef<T | null>(null);

  const handleMove = useCallback(
    (e: MouseEvent) => {
      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * strength;
      const dy = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: dx,
        y: dy,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    [strength]
  );

  const handleLeave = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: returnSpeed, ease: "elastic.out(1, 0.4)" });
  }, [returnSpeed]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || shouldReduceMotion() || isTouchDevice()) return;

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      // Reset position on cleanup
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [handleMove, handleLeave]);

  return elementRef;
}
