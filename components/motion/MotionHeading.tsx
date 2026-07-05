"use client";

import React from "react";
import { motion } from "framer-motion";
import { containerReveal, itemReveal } from "@/animations/variants/transitions";
import { usePrefersReducedMotion } from "@/animations/utils/reducedMotion";

interface MotionHeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  /** Delay before the word stagger starts */
  delay?: number;
}

/**
 * Heading with word-stagger scroll reveal.
 * Splits text into word spans, staggers them in on scroll.
 * Falls back to a simple fade for reduced-motion.
 */
export function MotionHeading({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
}: MotionHeadingProps) {
  const reduced = usePrefersReducedMotion();

  // Reduced motion: simple fade
  if (reduced) {
    const El = motion[Tag];
    return (
      <El
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.4, delay }}
      >
        {children}
      </El>
    );
  }

  // Full motion: word stagger
  const words = typeof children === "string" ? children.split(" ") : null;

  if (!words) {
    // Non-string children: simple fade
    const El = motion[Tag];
    return (
      <El
        className={className}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </El>
    );
  }

  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      variants={containerReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delayChildren: delay }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={itemReveal}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
