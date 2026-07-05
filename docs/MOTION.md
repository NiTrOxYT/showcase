# Motion Design System — ANNEX

Single source of truth for all motion decisions.
Read this before writing any animation code.

---

## Motion Philosophy

> The visitor should remember how smooth, refined, and effortless the website felt — not individual animations.

Motion communicates craftsmanship. Every animation must earn its place.

**Motion should feel**: Calm · Premium · Intentional · Confident · Natural  
**Motion should never feel**: Flashy · Bouncy · Cartoon · Over-animated · Distracting

---

## Animation Governance (5-Point Check)

Every animation must satisfy **all five** before shipping:

1. **Improves usability** — guides attention, clarifies state, or aids navigation
2. **Supports storytelling** — reinforces the ANNEX narrative
3. **Maintains performance** — GPU-only transforms, no layout thrashing
4. **Respects accessibility** — reduced-motion alternative exists
5. **Matches design language** — calm, premium, intentional

Fail any criterion → **cut the animation**.

---

## Animation Tokens

Source: `animations/core/tokens.ts`

**Never hardcode durations, easings, stagger, or delays in components. Import from tokens.**

### Duration Scale

| Token | Value | Use |
|---|---|---|
| `DURATION.fast` | 0.15s | Tooltips, micro-feedback |
| `DURATION.hover` | 0.20s | Hover states |
| `DURATION.normal` | 0.40s | Nav, badge reveals |
| `DURATION.slow` | 0.70s | Section reveals, cards |
| `DURATION.hero` | 1.00s | Hero entrance, images |
| `DURATION.page` | 0.50s | Page transitions |

### Easing Curves

| Token | Cubic-Bezier | GSAP | Use |
|---|---|---|---|
| `EASE.standard` | `[0.16, 1, 0.3, 1]` | `power3.out` | Default entrance |
| `EASE.entrance` | `[0.22, 1, 0.36, 1]` | `power2.out` | Scroll reveals |
| `EASE.exit` | `[0.4, 0, 1, 1]` | `power2.in` | Exit / fade-out |
| `EASE.hover` | `[0.25, 0.46, 0.45, 0.94]` | `power1.inOut` | Hover transitions |

No bounce. No elastic. No spring (exception: magnetic return uses mild elastic as UI feedback only).

### Stagger Timing

| Token | Value | Use |
|---|---|---|
| `STAGGER.tight` | 0.04s | Dense card grids |
| `STAGGER.normal` | 0.08s | Nav links, list items |
| `STAGGER.loose` | 0.14s | Spaced featured items |

---

## Motion Budget

Motion is a finite resource. Rules:

- **One major animation at a time.** No overlapping entrances.
- **Never animate already-visible content.**
- **Hover animations complete within 150–250ms.**
- **Scroll reveals run once per element.** No replay on scroll-up.
- **No dozens of simultaneous card animations.** Stagger tightly or group-reveal.
- Clarity always wins over spectacle.
- If motion competes for attention → cut it.

---

## Motion Scope (Route-Aware)

| Feature | Marketing (`/`, `/showcase`, `/showcase/[slug]`) | Admin (`/admin/*`) |
|---|---|---|
| Lenis smooth scroll | ✅ Enabled | ❌ Disabled |
| Custom cursor | ✅ Enabled | ❌ Disabled |
| Magnetic interactions | ✅ Enabled | ❌ Disabled |
| Parallax | ✅ Enabled | ❌ Disabled |
| Page transitions | ✅ Full blur+fade | ❌ None |
| Scroll reveals | ✅ Full | ✅ Lite only |
| Hover / focus / feedback | ✅ Full | ✅ Full |
| ScrollProgress | `/showcase/[slug]` only | ❌ Never |

---

## Scroll Rules

- **ScrollTrigger `start`**: Use `SCROLL_START` tokens (`top 80%` default).
- **`toggleActions`**: Always `"play none none none"` — reveals run once only.
- **Content visible at rest**: Never gate content behind animation. `from` states are additive enhancements; elements must be accessible and visible without JS.
- **GSAP context**: Always create animations inside `gsap.context()`. Call `ctx.revert()` in `useEffect` cleanup.
- **Lenis + GSAP sync**: Use `syncLenisWithGSAP()` from `animations/gsap`. Call once in `SmoothScrollProvider`.

---

## Cursor States

Managed by `CursorProvider`. Use `useCursor()` hook in components.

| State | Size | Visual | Label |
|---|---|---|---|
| `default` | 12px | White dot (blend: difference) | — |
| `hover` | 36px | Expanded white dot | — |
| `view` | 80px | Dark glass circle | "View" |
| `open` | 80px | Dark glass circle | "Open" |
| `next` | 60px | Dark glass circle | "Next" |
| `prev` | 60px | Dark glass circle | "Prev" |
| `drag` | 48px | Dark glass circle | "Drag" |

Cursor is hidden on touch devices (`useIsTouch`) and when `prefers-reduced-motion` is set.

---

## Hover Rules

- Hover state must complete within **150–250ms** (`DURATION.hover` = 0.20s).
- Only animate `transform` and `opacity`. Never `box-shadow`, `border`, `background` in GSAP hover.
- Use CSS transitions for simple color/background hover — no GSAP needed.
- Use GSAP for magnetic, lift, scale effects.
- Magnetic: disable on touch (`isTouchDevice()`) and reduced-motion.

---

## GSAP Guidelines

### Registration
All plugins are registered once in `animations/gsap/index.ts`. **Never call `gsap.registerPlugin()` in components.**

### Context
```ts
useEffect(() => {
  const ctx = gsap.context(() => {
    // all GSAP code here
  }, containerRef);
  return () => ctx.revert(); // ← required
}, []);
```

### Allowed Properties (GPU-composited only)
- `transform` (translateX, translateY, translateZ, scale, rotate)
- `opacity`
- `filter: blur()` — use sparingly
- `clip-path`

### Banned Properties (cause layout thrashing)
- `width`, `height`, `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `box-shadow` animation

### Timelines
- `heroTimeline.ts` — hero entrance sequence
- `navTimeline.ts` — menu open/close

---

## Framer Motion Guidelines

Use Framer Motion for:
- Declarative scroll reveals (`whileInView`)
- Page transitions (`AnimatePresence`)
- Simple hover states with variant maps
- Stagger containers

Use GSAP for:
- Imperative scroll-driven animations (parallax, scrub)
- Cursor tracking (`quickTo`)
- Complex sequences (hero timeline)
- Magnetic effects

### Variant naming
- `initial` / `animate` / `exit` — page transitions
- `hidden` / `show` — scroll reveals
- `rest` / `hover` — hover states

---

## Accessibility Rules

### Reduced Motion Matrix

| Feature | `prefers-reduced-motion: reduce` |
|---|---|
| Lenis smooth scroll | Disabled — native scroll |
| Parallax | Disabled |
| Magnetic effects | Disabled |
| Page transitions | Crossfade only (no blur/translate) |
| Stagger reveals | Instant visibility |
| ScrollTrigger | Elements visible at rest |
| Custom cursor | Disabled |
| Navigation | Fully usable — no motion dependency |

### Implementation
- `shouldReduceMotion()` — synchronous check (safe for initial render)
- `usePrefersReducedMotion()` — reactive hook
- `useIsTouch()` — disables cursor/magnetic on touch devices
- CSS fallback in `globals.css` kills all CSS animations/transitions when `prefers-reduced-motion: reduce`

---

## Performance Rules

1. GPU transforms only — `transform` and `opacity`.
2. No layout thrashing — measure once, animate once.
3. `ctx.revert()` on every GSAP `useEffect`.
4. Destroy Intersection Observers and event listeners on unmount.
5. No duplicate timelines — create once, reuse.
6. `gsap.ticker.lagSmoothing(0)` — prevents GSAP lag on hidden tabs.
7. `willChange: "transform, opacity"` only on actively animating elements, remove after animation.
8. Lazy-initialize expensive timelines (only when viewport triggers).

---

## Animation Checklist

Before shipping any animation:

- [ ] Passes governance 5-point check
- [ ] Uses token values — no hardcoded durations/easings
- [ ] Has reduced-motion alternative
- [ ] Content visible at rest (no opacity:0 gate)
- [ ] GSAP: ctx.revert() in cleanup
- [ ] Observers/listeners destroyed on unmount
- [ ] Disabled on touch if relevant (magnetic, parallax, cursor)
- [ ] No layout-triggering properties animated
- [ ] Runs within motion budget (no overlap with other major animations)
- [ ] `pnpm tsc --noEmit` clean after adding
