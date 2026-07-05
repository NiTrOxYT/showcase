"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { cardHover, itemReveal } from "@/animations/variants/transitions";
import { usePrefersReducedMotion } from "@/animations/utils/reducedMotion";

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay via parent container */
  staggerDelay?: number;
  /** Whether to apply scroll-reveal via itemReveal variant */
  withReveal?: boolean;
}

/**
 * Card wrapper with hover lift and optional scroll-reveal stagger.
 * Uses Framer Motion initial/whileInView for scroll, whileHover for interaction.
 */
export function MotionCard({
  children,
  className,
  withReveal = true,
}: MotionCardProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={cn(className)}>{children}</div>;
  }

  if (withReveal) {
    return (
      <motion.div
        className={cn(className)}
        variants={itemReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-5%" }}
        whileHover={cardHover.hover}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      initial={cardHover.rest}
      whileHover={cardHover.hover}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
