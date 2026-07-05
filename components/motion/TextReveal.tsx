"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import { gsap } from "@/animations/gsap";
import { DURATION, EASE_GSAP } from "@/animations/core/tokens";
import { shouldReduceMotion } from "@/animations/utils/reducedMotion";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  splitBy?: "words" | "chars";
  stagger?: number;
  start?: string;
}

/**
 * Scroll-driven text reveal via clip-path word slide.
 * Each word slides up from behind a hidden overflow container.
 * Restores original HTML on cleanup to prevent memory leaks.
 */
export function TextReveal({
  children,
  className,
  as: Tag = "div",
  splitBy = "words",
  stagger = 0.04,
  start = "top 85%",
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || shouldReduceMotion()) return;

    const original = el.innerHTML;
    const units = splitBy === "words" ? children.split(" ") : children.split("");
    const separator = splitBy === "words" ? " " : "";

    el.innerHTML = units
      .map(
        (u) =>
          `<span style="display:inline-block;overflow:hidden;vertical-align:top"><span class="tr-unit" style="display:inline-block;will-change:transform,opacity">${u}</span></span>`
      )
      .join(separator);

    const spans = el.querySelectorAll<HTMLElement>(".tr-unit");

    const ctx = gsap.context(() => {
      gsap.from(spans, {
        y: "105%",
        opacity: 0,
        duration: DURATION.slow,
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
      if (el) el.innerHTML = original;
    };
  }, [children, splitBy, stagger, start]);

  return (
    // @ts-expect-error – dynamic tag
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
