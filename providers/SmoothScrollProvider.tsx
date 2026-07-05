"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { syncLenisWithGSAP, ScrollTrigger } from "@/animations/gsap";
import { shouldReduceMotion } from "@/animations/utils/reducedMotion";

interface SmoothScrollContextType {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export const useLenis = () => useContext(SmoothScrollContext).lenis;

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion — use native scroll only.
    if (shouldReduceMotion()) return;

    const lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenisInstance;
    setTimeout(() => {
      setLenis(lenisInstance);
    }, 0);

    // Sync Lenis RAF with GSAP ticker — returns a cleanup function.
    const unsync = syncLenisWithGSAP(lenisInstance);

    // Keep ScrollTrigger positions accurate after Lenis ticks.
    lenisInstance.on("scroll", ScrollTrigger.update);

    return () => {
      unsync?.();
      lenisInstance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};
