/**
 * Ready-made animation preset configs.
 * Import and spread into GSAP or Framer Motion calls.
 * All values reference tokens — never hardcoded.
 */
import { DURATION, EASE_GSAP, STAGGER, SCROLL_START } from "@/animations/core/tokens";

// ─── GSAP Scroll Reveal Presets ──────────────────────────────────────────────

export const SCROLL_REVEAL_FADE = {
  from: { opacity: 0 },
  to: {
    opacity: 1,
    duration: DURATION.slow,
    ease: EASE_GSAP.entrance,
  },
  scrollTrigger: {
    start: SCROLL_START.normal,
    toggleActions: "play none none none",
  },
} as const;

export const SCROLL_REVEAL_RISE = {
  from: { opacity: 0, y: 32 },
  to: {
    opacity: 1,
    y: 0,
    duration: DURATION.slow,
    ease: EASE_GSAP.standard,
  },
  scrollTrigger: {
    start: SCROLL_START.normal,
    toggleActions: "play none none none",
  },
} as const;

export const SCROLL_REVEAL_SCALE = {
  from: { opacity: 0, scale: 0.96 },
  to: {
    opacity: 1,
    scale: 1,
    duration: DURATION.slow,
    ease: EASE_GSAP.standard,
  },
  scrollTrigger: {
    start: SCROLL_START.normal,
    toggleActions: "play none none none",
  },
} as const;

// ─── Hover Presets ───────────────────────────────────────────────────────────

export const HOVER_LIFT = {
  y: -4,
  duration: DURATION.hover,
  ease: EASE_GSAP.hover,
} as const;

export const CARD_HOVER = {
  scale: 1.015,
  duration: DURATION.hover,
  ease: EASE_GSAP.hover,
} as const;

// ─── Stagger Config ──────────────────────────────────────────────────────────

export const STAGGER_TIGHT = {
  each: STAGGER.tight,
  ease: EASE_GSAP.standard,
} as const;

export const STAGGER_NORMAL = {
  each: STAGGER.normal,
  ease: EASE_GSAP.standard,
} as const;

export const STAGGER_LOOSE = {
  each: STAGGER.loose,
  ease: EASE_GSAP.standard,
} as const;
