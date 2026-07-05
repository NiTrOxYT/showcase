"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { useSectionReveal, SectionRevealVariant } from "@/animations/hooks/useSectionReveal";

interface MotionSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  variant?: SectionRevealVariant;
  delay?: number;
  start?: string;
  className?: string;
}

/**
 * Drop-in section wrapper with scroll reveal.
 * Content is always visible at rest — animation is an enhancement.
 * Use as a direct replacement for <section> or <div> wrapping sections.
 */
export function MotionSection({
  children,
  as: Tag = "section",
  variant = "rise",
  delay,
  start,
  className,
  ...rest
}: MotionSectionProps) {
  const ref = useSectionReveal<HTMLElement>({ variant, delay, start });

  return (
    <Tag ref={ref} className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}
