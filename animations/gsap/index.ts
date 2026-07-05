/**
 * GSAP setup — central registration.
 * Import from here everywhere. Never call gsap.registerPlugin() in components.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register all plugins once, centrally, client-side only.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Prevent GSAP from accumulating lag when the tab is hidden and re-focused.
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger };

/**
 * Sync Lenis smooth-scroll with GSAP's ScrollTrigger.
 * Call once inside the SmoothScrollProvider after Lenis is initialized.
 * @param lenis - The active Lenis instance.
 */
export function syncLenisWithGSAP(lenis: { raf: (time: number) => void }) {
  if (typeof window === "undefined") return;

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tick);
  ScrollTrigger.refresh();

  return () => {
    gsap.ticker.remove(tick);
  };
}
