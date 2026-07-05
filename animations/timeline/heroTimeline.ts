import { gsap, ScrollTrigger } from "@/animations/gsap";
import { DURATION, EASE_GSAP, STAGGER } from "@/animations/core/tokens";

/**
 * Hero entrance timeline.
 * Staggers: badge → heading → body → cta → image
 * Call inside a gsap.context() for auto-cleanup.
 *
 * @param container - The hero root element (scope for selectors)
 */
export function createHeroTimeline(container: Element) {
  const tl = gsap.timeline({ defaults: { ease: EASE_GSAP.standard } });
  const select = gsap.utils.selector(container);

  tl.from(select("[data-hero-badge]"), {
    opacity: 0,
    y: 16,
    duration: DURATION.normal,
  })
    .from(
      select("[data-hero-heading]"),
      {
        opacity: 0,
        y: 24,
        duration: DURATION.hero,
      },
      `-=${DURATION.normal * 0.5}`
    )
    .from(
      select("[data-hero-body]"),
      {
        opacity: 0,
        y: 16,
        duration: DURATION.slow,
      },
      `-=${DURATION.slow * 0.6}`
    )
    .from(
      select("[data-hero-cta]"),
      {
        opacity: 0,
        y: 12,
        duration: DURATION.normal,
      },
      `-=${DURATION.normal * 0.5}`
    )
    .from(
      select("[data-hero-image]"),
      {
        opacity: 0,
        scale: 0.98,
        duration: DURATION.hero,
      },
      `-=${DURATION.slow}`
    );

  return tl;
}

/**
 * Attach a scroll-driven parallax to the hero image.
 * Call inside a gsap.context() for auto-cleanup.
 *
 * @param imageEl - The image element to parallax
 * @param depth - Scroll depth multiplier (0.1–0.3 recommended)
 */
export function createHeroParallax(imageEl: Element, depth = 0.15) {
  return gsap.to(imageEl, {
    yPercent: depth * 100,
    ease: "none",
    scrollTrigger: {
      trigger: imageEl.closest("[data-hero-image]") ?? imageEl,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

/**
 * Section fade+rise reveal. Reusable for any section.
 */
export function createSectionReveal(el: Element, variant: "fade" | "rise" | "scale" = "rise") {
  const from =
    variant === "rise"
      ? { opacity: 0, y: 32 }
      : variant === "scale"
      ? { opacity: 0, scale: 0.97 }
      : { opacity: 0 };

  return gsap.from(el, {
    ...from,
    duration: DURATION.slow,
    ease: EASE_GSAP.standard,
    scrollTrigger: {
      trigger: el,
      start: "top 82%",
      toggleActions: "play none none none",
    },
  });
}

/**
 * Stagger reveal for a group of child elements.
 */
export function createStaggerReveal(
  parent: Element,
  childSelector: string,
  stagger: number = STAGGER.normal
) {
  return gsap.from(parent.querySelectorAll(childSelector), {
    opacity: 0,
    y: 24,
    duration: DURATION.slow,
    ease: EASE_GSAP.standard,
    stagger,
    scrollTrigger: {
      trigger: parent,
      start: "top 82%",
      toggleActions: "play none none none",
    },
  });
}

void ScrollTrigger; // ensure plugin is registered
