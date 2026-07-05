"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { pageTransitions, pageTransitionsReduced } from "@/animations/variants/transitions";
import { usePrefersReducedMotion } from "@/animations/utils/reducedMotion";

interface PageWrapperProps {
  children: React.ReactNode;
  /** Unique key per route — triggers AnimatePresence on route change */
  routeKey: string;
}

/**
 * Wraps page content with Framer Motion AnimatePresence for route transitions.
 * Use in the marketing layout only. Admin routes skip this.
 */
export function PageWrapper({ children, routeKey }: PageWrapperProps) {
  const reduced = usePrefersReducedMotion();
  const variants = reduced ? pageTransitionsReduced : pageTransitions;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: "opacity, transform, filter" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
