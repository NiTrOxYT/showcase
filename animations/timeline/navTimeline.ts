import { gsap } from "@/animations/gsap";
import { DURATION, EASE_GSAP, STAGGER } from "@/animations/core/tokens";

/**
 * Fullscreen menu open timeline.
 * Animates the backdrop in, then staggers nav links.
 *
 * @param backdrop - The fullscreen menu overlay element
 * @param links - Array of nav link elements
 */
export function createMenuOpenTimeline(backdrop: Element, links: Element[]) {
  const tl = gsap.timeline({ defaults: { ease: EASE_GSAP.standard } });

  tl.fromTo(
    backdrop,
    { opacity: 0 },
    { opacity: 1, duration: DURATION.normal, pointerEvents: "auto" }
  ).from(
    links,
    {
      opacity: 0,
      y: 20,
      duration: DURATION.slow,
      stagger: STAGGER.normal,
    },
    `-=${DURATION.normal * 0.4}`
  );

  return tl;
}

/**
 * Fullscreen menu close timeline.
 */
export function createMenuCloseTimeline(backdrop: Element) {
  return gsap.to(backdrop, {
    opacity: 0,
    duration: DURATION.normal,
    ease: EASE_GSAP.exit,
    pointerEvents: "none",
  });
}
