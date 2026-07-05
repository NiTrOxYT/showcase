"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/animations/utils/reducedMotion";
import { DURATION, EASE } from "@/animations/core/tokens";

interface PageTransitionProps {
  children: React.ReactNode;
  routeKey?: string;
}

const variants = {
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(2px)" },
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
        style={{ willChange: "opacity, transform, filter" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
