"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";
import { EASE_GSAP } from "@/animations/core/tokens";
import { shouldReduceMotion } from "@/animations/utils/reducedMotion";

interface UseTextRevealOptions {
  /**
   * "words" — stagger by word
   * "lines" — stagger by line (requires CSS line wrapping)
   */
  splitBy?: "words" | "chars";
  stagger?: number;
  start?: string;
}

/**
 * Scroll-driven text reveal by splitting into word spans.
 * Works with plain text content. 
 * Returns a ref to attach to the heading/paragraph element.
 */
export function useTextReveal<T extends HTMLElement>(
  options: UseTextRevealOptions = {}
) {
  const { splitBy = "words", stagger = 0.04, start = "top 85%" } = options;
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || shouldReduceMotion()) return;

    // Manual word/char split — no external SplitText dependency
    const original = el.innerHTML;
    const text = el.textContent ?? "";
    const units =
      splitBy === "words" ? text.split(" ") : text.split("");

    const separator = splitBy === "words" ? " " : "";
    el.innerHTML = units
      .map(
        (u) =>
          `<span style="display:inline-block;overflow:hidden"><span class="split-unit" style="display:inline-block">${u}</span></span>`
      )
      .join(separator);

    const spans = el.querySelectorAll<HTMLElement>(".split-unit");

    const ctx = gsap.context(() => {
      gsap.from(spans, {
        y: "101%",
        opacity: 0,
        duration: 0.65,
        ease: EASE_GSAP.standard,
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => {
      ctx.revert();
      el.innerHTML = original;
    };
  }, [splitBy, stagger, start]);

  return elementRef;
}
