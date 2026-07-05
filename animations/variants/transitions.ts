import type { Variants } from "framer-motion";
import { DURATION, EASE, STAGGER } from "@/animations/core/tokens";

// ─── Page Transitions ────────────────────────────────────────────────────────

export const pageTransitions: Variants = {
  initial: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: DURATION.page,
      ease: EASE.standard,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(2px)",
    transition: {
      duration: DURATION.fast * 2,
      ease: EASE.exit,
    },
  },
};

// Reduced-motion alternative — crossfade only
export const pageTransitionsReduced: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASE.standard },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASE.exit },
  },
};

// ─── Container / Stagger ────────────────────────────────────────────────────

export const containerReveal: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.normal,
      delayChildren: 0.05,
    },
  },
};

export const containerRevealTight: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.tight,
    },
  },
};

// ─── Item Reveals ────────────────────────────────────────────────────────────

export const itemReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.slow,
      ease: EASE.standard,
    },
  },
};

export const itemRevealFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASE.entrance,
    },
  },
};

export const itemRevealScale: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASE.standard,
    },
  },
};

// ─── Card Hover ──────────────────────────────────────────────────────────────

export const cardHover = {
  rest: { y: 0, transition: { duration: DURATION.hover, ease: EASE.hover } },
  hover: { y: -4, transition: { duration: DURATION.hover, ease: EASE.hover } },
};
