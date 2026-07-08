"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";
import { useCursor } from "@/providers/CursorProvider";
import { useIsTouch, usePrefersReducedMotion } from "@/animations/utils/reducedMotion";

const SIZE_MAP: Record<string, number> = {
  default: 12,
  hover: 36,
  view: 80,
  open: 80,
  next: 60,
  prev: 60,
  drag: 48,
};

const LABEL_MAP: Record<string, string> = {
  view: "View",
  open: "Open",
  next: "Next",
  prev: "Prev",
  drag: "Drag",
};

/**
 * Premium custom cursor follower.
 * GSAP quickTo for lag-free smooth tracking.
 * Hidden on touch devices and when prefers-reduced-motion is active.
 * Mount once in the marketing layout.
 */
export function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { cursorType, cursorLabel } = useCursor();
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const [isAdmin, setIsAdmin] = React.useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        setIsAdmin(window.location.pathname.startsWith("/admin"));
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (isTouch || reduced || isAdmin || !cursorRef.current) return;

    const cursor = cursorRef.current;
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isTouch, reduced, isAdmin]);

  // Size transition on cursor type change
  useEffect(() => {
    if (!cursorRef.current || isTouch || reduced || isAdmin) return;
    const size = SIZE_MAP[cursorType] ?? 12;
    gsap.to(cursorRef.current, {
      width: size,
      height: size,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [cursorType, isTouch, reduced, isAdmin]);

  if (isTouch || reduced || isAdmin) return null;

  const label = cursorLabel || LABEL_MAP[cursorType] || null;
  const isLarge = ["view", "open", "next", "prev", "drag"].includes(cursorType);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: SIZE_MAP.default,
        height: SIZE_MAP.default,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
        willChange: "transform, width, height",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mixBlendMode: isLarge ? "normal" : "difference",
        // PERF: backdropFilter removed — blur on a GSAP-moved element re-applies
        // every frame, which is prohibitively expensive. Solid bg is equivalent visually.
        background: isLarge
          ? "oklch(0.08 0 0 / 0.88)"
          : "oklch(0.98 0.002 70.0)",
        border: isLarge ? "1px solid oklch(0.20 0.005 70.0)" : "none",
        transition: "background 0.3s, border 0.3s",
      }}
    >
      {label && (
        <span
          style={{
            fontSize: "10px",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "oklch(0.98 0.002 70.0)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
