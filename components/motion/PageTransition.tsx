"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/animations/utils/reducedMotion";
import { DURATION, EASE } from "@/animations/core/tokens";

interface PageTransitionProps {
  children: React.ReactNode;
  routeKey?: string;
}

// PERF: Removed filter:blur from variants.
// blur() on a full-page container forces GPU layer promotion on the entire document
// subtree, which is prohibitively expensive on mobile and mid-range desktop.
// opacity + y is sufficient and compositor-only.
const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Page content transition wrapper.
 * Wrap individual page content (not the layout shell) with this.
 */
export function PageTransition({ children, routeKey }: PageTransitionProps) {
  const reduced = usePrefersReducedMotion();
  const v = reduced ? reducedVariants : variants;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        variants={v}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: reduced ? DURATION.fast : DURATION.page,
          ease: EASE.standard,
        }}
        // PERF: Do not set willChange on full-page containers — it creates a
        // permanent compositing layer for the entire document subtree.
        // Framer Motion manages willChange internally during animations.
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
