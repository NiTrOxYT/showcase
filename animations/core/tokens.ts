/**
 * Animation Tokens
 * Single source of truth for all motion values.
 * Never hardcode durations, easings, or stagger values in components.
 */

// Duration scale (seconds)
export const DURATION = {
  instant: 0,
  fast: 0.15,
  normal: 0.4,
  slow: 0.7,
  hero: 1.0,
  page: 0.5,
  hover: 0.2,
} as const;

// Easing curves [x1, y1, x2, y2] cubic-bezier
export const EASE = {
  standard: [0.16, 1, 0.3, 1] as [number, number, number, number],   // expo-out
  entrance: [0.22, 1, 0.36, 1] as [number, number, number, number],  // quart-out
  exit: [0.4, 0, 1, 1] as [number, number, number, number],          // quart-in
  hover: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number], // mild overshoot for UI feedback only
} as const;

// GSAP string easings
export const EASE_GSAP = {
  standard: "power3.out",
  entrance: "power2.out",
  exit: "power2.in",
  hover: "power1.inOut",
} as const;

// Stagger timing (seconds between child elements)
export const STAGGER = {
  tight: 0.04,
  normal: 0.08,
  loose: 0.14,
} as const;

// Scroll trigger positions
export const SCROLL_START = {
  early: "top 90%",
  normal: "top 80%",
  late: "top 65%",
  center: "center 80%",
} as const;

// Framer Motion transition presets
export const FM_TRANSITION = {
  standard: {
    duration: DURATION.normal,
    ease: EASE.standard,
  },
  entrance: {
    duration: DURATION.slow,
    ease: EASE.entrance,
  },
  hover: {
    duration: DURATION.hover,
    ease: EASE.hover,
  },
  page: {
    duration: DURATION.page,
    ease: EASE.standard,
  },
} as const;
