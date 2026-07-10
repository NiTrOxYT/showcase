"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { DURATION, EASE } from "@/animations/core/tokens";
import { safeSrc } from "@/lib/images";
import type { NavigationItem } from "@/services/navigationRepository";

// ─── Nav links ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Services", href: "/services", num: "01" },
  { label: "Blog", href: "/blog", num: "02" },
  { label: "Work", href: "/showcase", num: "03" },
  { label: "About", href: "/#about", num: "04" },
  { label: "Contact", href: "/contact", num: "05" },
];

function isActiveLink(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  if (href === "/blog") return pathname.startsWith("/blog");
  if (href === "/services") return pathname.startsWith("/services");
  if (href === "/showcase") return pathname.startsWith("/showcase");
  return pathname === href;
}

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/annex-consultancy-880a18420/" },
  { label: "GitHub", href: "https://github.com/NiTrOxYT" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61558767534473" },
  { label: "Instagram", href: "https://www.instagram.com/annexconsultancy1/" },
];

// ─── Framer Motion variants ───────────────────────────────────────────────────
const panelVariants = {
  hidden: {
    opacity: 0,
    y: -12,
    filter: "blur(8px)",
    transition: { duration: DURATION.normal, ease: EASE.exit },
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.normal, ease: EASE.entrance },
  },
};

const linkStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const linkItem = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

const mobileSheetVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: DURATION.normal, ease: EASE.exit },
  },
  show: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASE.entrance },
  },
};

const mobileLinkStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const mobileLinkItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

// ─── Logo Image helper ───────────────────────────────────────────────────────
// height=36px desktop, 32px tablet, 26px mobile → ratio 1774:887 ≈ 2:1
function AnnexLogo({
  size = "desktop",
  priority = false,
  logoUrl,
  theme = "light",
}: {
  size?: "desktop" | "tablet" | "mobile";
  priority?: boolean;
  logoUrl?: string;
  theme?: "light" | "dark";
}) {
  const heights: Record<string, number> = { desktop: 36, tablet: 32, mobile: 26 };
  const h = heights[size];
  const w = h * 2; // 2:1 exact ratio
  return (
    <Image
      src={safeSrc(logoUrl) || "/images/logo.png"}
      alt="ANNEX"
      width={w}
      height={h}
      priority={priority}
      style={{
        width: w,
        height: h,
        objectFit: "contain",
        filter: theme === "dark" ? "invert(1) brightness(2)" : "none",
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const EMAIL = "support@annex-consultancy.com";
const ADDRESS = "Kolkata, India";

interface NavbarProps {
  navLinks?: NavigationItem[];
  logoUrl?: string;
  contactEmail?: string;
  contactAddress?: string;
  theme?: "light" | "dark";
}

interface FormattedNavLink {
  label: string;
  href: string;
  num: string;
  children: NavigationItem[];
}

export function Navbar({ navLinks, logoUrl, contactEmail, contactAddress, theme: themeProp }: NavbarProps = {}) {
  const email = contactEmail || EMAIL;
  const address = contactAddress || ADDRESS;
  const logo = logoUrl || "/images/logo.png";
  const pathname = usePathname() || "";

  const links: FormattedNavLink[] = (navLinks && navLinks.length > 0)
    ? navLinks.map((item, idx) => ({
      label: item.title,
      href: item.href,
      num: `0${idx + 1}`,
      children: item.children || [],
    }))
    : NAV_LINKS.map((item) => ({ ...item, children: [] }));

  let resolvedMenuTheme: "light" | "dark" = "light";
  if (themeProp) {
    resolvedMenuTheme = themeProp;
  } else if (typeof window !== "undefined") {
    const docTheme = document.documentElement.getAttribute("data-theme") || document.body.getAttribute("data-theme");
    if (docTheme === "dark" || docTheme === "light") {
      resolvedMenuTheme = docTheme as "light" | "dark";
    } else if (document.documentElement.classList.contains("dark")) {
      resolvedMenuTheme = "dark";
    } else if (window.location.pathname === "/book-call" || window.location.pathname.startsWith("/showcase")) {
      resolvedMenuTheme = "dark";
    }
  }

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);

  // PERF: lastScrollY in a ref — never in effect deps.
  // Putting it in deps caused a new addEventListener on every scroll tick.
  const lastScrollY = useRef(0);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Scroll hide/show ──────────────────────────────────────────────────────
  // PERF: Single setState call per scroll event (was 3 separate calls).
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const prev = lastScrollY.current;
      lastScrollY.current = y;
      setIsScrolled(y > 20);
      setIsVisible(!(y > prev && y > 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── ESC close ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setHoverOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Lock body scroll when menu is open ───────────────────────────────────
  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ── Focus trap: move focus to first link when menu opens ─────────────────
  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => firstLinkRef.current?.focus(), 300);
    }
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => {
    setMenuOpen(p => !p);
    setHoverOpen(false);
  }, []);

  // ── Hover panel: delayed open/close to prevent flicker ──────────────────
  const handleMenuMouseEnter = useCallback(() => {
    if (menuOpen) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoverOpen(true);
  }, [menuOpen]);
  const handleMenuMouseLeave = useCallback(() => {
    hoverTimer.current = setTimeout(() => setHoverOpen(false), 80);
  }, []);
  const handlePanelMouseEnter = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, []);
  const handlePanelMouseLeave = useCallback(() => {
    hoverTimer.current = setTimeout(() => setHoverOpen(false), 80);
  }, []);

  // ─── Shared bar padding / bg ───────────────────────────────────────────
  const headerTheme = isScrolled ? "light" : resolvedMenuTheme;
  const barBg = isScrolled ? "bg-white/85 backdrop-blur-xl border-b border-black/5 shadow-sm" : "bg-transparent";
  const barPy = isScrolled ? "py-4" : "py-6";

  const isButtonDark = (menuOpen ? resolvedMenuTheme === "light" : headerTheme === "light");
  const btnClasses = isButtonDark
    ? "bg-black text-white border-black hover:bg-black/85 focus-visible:ring-black/40"
    : "bg-white text-black border-white hover:bg-white/90 focus-visible:ring-white/40";
  const lineClasses = isButtonDark ? "bg-white" : "bg-black";

  return (
    <>
      {/* ══════════════════════════ NAVBAR BAR ══════════════════════════════ */}
      <header
        role="banner"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          isVisible ? "translate-y-0" : "-translate-y-full",
          barBg, barPy,
        )}
        style={{ paddingTop: `max(${isScrolled ? "16px" : "24px"}, env(safe-area-inset-top))` }}
      >
        <div className="w-full px-5 md:px-8 lg:px-12 max-w-[1600px] mx-auto flex items-center justify-between">

          {/* ── Logo ───────────────────────────────────────────── */}
          <Link
            href="/"
            className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded-md transition-opacity hover:opacity-75"
            aria-label="ANNEX — Home"
          >
            <span className="hidden md:block"><AnnexLogo size="desktop" priority logoUrl={logo} theme={headerTheme} /></span>
            <span className="hidden sm:block md:hidden"><AnnexLogo size="tablet" priority logoUrl={logo} theme={headerTheme} /></span>
            <span className="sm:hidden"><AnnexLogo size="mobile" priority logoUrl={logo} theme={headerTheme} /></span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Secondary CTA */}
            <Link
              href="/proposals"
              className={cn(
                "hidden md:inline-flex items-center justify-center px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-all duration-200 rounded-full border",
                headerTheme === "light"
                  ? "border-black text-black hover:bg-black hover:text-white"
                  : "border-white/20 text-white/90 hover:bg-white hover:text-black"
              )}
            >
              Get a Proposal
            </Link>

            {/* Primary CTA */}
            <Link
              href="/book-call"
              className={cn(
                "hidden md:inline-flex items-center justify-center px-4.5 py-2 text-[10px] font-mono uppercase tracking-widest font-bold transition-all duration-200 rounded-full border",
                headerTheme === "light"
                  ? "bg-black text-white border-black hover:bg-black/85"
                  : "bg-white text-black border-white hover:bg-white/90"
              )}
            >
              Book a Call
            </Link>

            {/* ── Menu trigger + hover preview (desktop only) ─────── */}
            <div
              className="relative"
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMenuMouseLeave}
            >
              <button
                ref={menuBtnRef}
                onClick={toggleMenu}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className={cn(
                  "relative inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-200",
                  "px-4 py-2 rounded-full border focus-visible:outline-none focus-visible:ring-2",
                  btnClasses
                )}
              >
                {/* Animated dot → X */}
                <span className="relative w-2.5 h-2.5 flex items-center justify-center shrink-0">
                  <span className={cn(
                    "absolute block w-2 h-[1.5px] transition-all duration-200",
                    lineClasses,
                    menuOpen ? "rotate-45 translate-y-0" : "-translate-y-[2.5px]"
                  )} />
                  <span className={cn(
                    "absolute block w-2 h-[1.5px] transition-all duration-200",
                    lineClasses,
                    menuOpen ? "-rotate-45 translate-y-0" : "translate-y-[2.5px]"
                  )} />
                </span>
                <span>{menuOpen ? "Close" : "Menu"}</span>
              </button>

              {/* ── Hover preview (desktop only) ────────────────── */}
              <AnimatePresence>
                {hoverOpen && !menuOpen && (
                  <motion.div
                    variants={panelVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    onMouseEnter={handlePanelMouseEnter}
                    onMouseLeave={handlePanelMouseLeave}
                    className={cn(
                      "hidden md:block absolute top-[calc(100%+10px)] right-0 w-44 backdrop-blur-2xl border rounded-2xl shadow-xl py-3 px-4 z-10",
                      resolvedMenuTheme === "dark"
                        ? "bg-neutral-900/90 border-white/12 shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
                        : "bg-white/90 border-black/8"
                    )}
                    role="menu"
                    aria-label="Quick navigation"
                  >
                    {links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        role="menuitem"
                        onClick={() => setHoverOpen(false)}
                        className={cn(
                          "block py-1.5 font-sans text-xs transition-colors duration-150 tracking-wide",
                          isActiveLink(link.href, pathname)
                            ? "text-primary font-bold"
                            : resolvedMenuTheme === "dark"
                              ? "text-white/70 hover:text-white"
                              : "text-black/70 hover:text-black"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════ DESKTOP PANEL ═══════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Click-outside backdrop (transparent) */}
            <div
              className="fixed inset-0 z-40"
              aria-hidden="true"
              onClick={closeMenu}
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className={cn(
                "hidden md:flex fixed z-50 flex-col gap-10",
                "top-[72px] left-5 lg:left-12",
                "w-[580px] lg:w-[640px]",
                "rounded-[28px]",
                resolvedMenuTheme === "dark"
                  ? "shadow-[0_24px_64px_rgba(0,0,0,0.4)]"
                  : "shadow-[0_24px_64px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)]",
                "p-10",
              )}
              style={{
                background: resolvedMenuTheme === "dark" ? "rgba(20,20,20,0.82)" : "rgba(255,255,255,0.75)",
                border: resolvedMenuTheme === "dark" ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.08)",
                backdropFilter: "blur(28px)",
              }}
            >
              {/* ── Two-column layout ──────────────────────────────── */}
              <div className="flex gap-12 items-start">

                {/* Left: Big nav links */}
                <motion.nav
                  variants={linkStagger}
                  initial="hidden"
                  animate="show"
                  className="flex-1 flex flex-col gap-1"
                  aria-label="Main navigation"
                >
                  {links.map((link, i) => (
                    <motion.div key={link.label} variants={linkItem}>
                      <Link
                        href={link.href}
                        ref={i === 0 ? firstLinkRef : undefined}
                        onClick={closeMenu}
                        className={cn(
                          "group relative flex items-baseline gap-3 py-2 pr-4",
                          "rounded-xl transition-colors duration-200",
                          resolvedMenuTheme === "dark"
                            ? "hover:bg-white/5 text-white focus-visible:ring-white/30"
                            : "hover:bg-black/4 text-black focus-visible:ring-black/30"
                        )}
                      >
                        <span className={cn(
                          "font-mono text-[9px] w-5 shrink-0 translate-y-[-1px]",
                          resolvedMenuTheme === "dark" ? "text-white/30" : "text-black/30"
                        )}>
                          {link.num}
                        </span>
                        <span
                          className={cn(
                            "font-display font-light tracking-[-0.04em] leading-none text-black",
                            "text-[48px] lg:text-[52px]",
                            resolvedMenuTheme === "dark" ? "text-white after:bg-white" : "text-black after:bg-black",
                            "relative after:absolute after:bottom-[6px] after:left-0 after:h-[1.5px]",
                            isActiveLink(link.href, pathname)
                              ? "after:w-full"
                              : "after:w-0 group-hover:after:w-full after:transition-all after:duration-300",
                            "group-hover:translate-x-1 transition-transform duration-200",
                          )}
                        >
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>

                {/* Right: Studio info */}
                <motion.aside
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.25, duration: DURATION.normal } }}
                  className="hidden lg:flex flex-col gap-4 pt-3 w-44 shrink-0"
                  aria-label="Studio information"
                >
                  <p className={cn(
                    "font-mono text-[9px] uppercase tracking-widest font-bold",
                    resolvedMenuTheme === "dark" ? "text-white/40" : "text-black/40"
                  )}>
                    Studio
                  </p>
                  <div className="flex flex-col gap-2">
                    <p className={cn(
                      "font-sans text-xs leading-relaxed",
                      resolvedMenuTheme === "dark" ? "text-white/70" : "text-black/70"
                    )}>
                      Independent Digital Studio
                    </p>
                    <p className={cn(
                      "font-sans text-xs",
                      resolvedMenuTheme === "dark" ? "text-white/50" : "text-black/50"
                    )}>
                      {address}
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className={cn(
                        "font-sans text-xs underline underline-offset-2 transition-colors duration-150",
                        resolvedMenuTheme === "dark" ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"
                      )}
                    >
                      {email}
                    </a>
                  </div>
                  <div className="pt-2 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
                      <p className={cn(
                        "font-mono text-[9px] uppercase tracking-wider",
                        resolvedMenuTheme === "dark" ? "text-white/50" : "text-black/50"
                      )}>
                        Accepting projects
                      </p>
                    </div>
                    <p className={cn(
                      "font-mono text-[9px] uppercase tracking-wider pl-3",
                      resolvedMenuTheme === "dark" ? "text-white/35" : "text-black/35"
                    )}>
                      Avg. reply &lt;24h
                    </p>
                  </div>
                </motion.aside>
              </div>

              {/* ── Bottom: Social links ──────────────────────────── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3, duration: DURATION.normal } }}
                className={cn(
                  "flex items-center gap-6 border-t pt-6",
                  resolvedMenuTheme === "dark" ? "border-white/12" : "border-black/8"
                )}
              >
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "font-mono text-[9px] uppercase tracking-widest transition-colors duration-150",
                      resolvedMenuTheme === "dark" ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
                    )}
                  >
                    {s.label}
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════ MOBILE SHEET ════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            variants={mobileSheetVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className={cn(
              "md:hidden fixed inset-0 z-[60] flex flex-col overflow-hidden",
              resolvedMenuTheme === "dark" ? "bg-neutral-950 text-white" : "bg-white text-black"
            )}
            style={{
              height: "100dvh",
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            {/* Mobile top bar */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <Link
                href="/"
                onClick={closeMenu}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-md transition-opacity hover:opacity-75"
                aria-label="ANNEX — Home"
              >
                <AnnexLogo size="mobile" priority logoUrl={logo} theme={resolvedMenuTheme} />
              </Link>

              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className={cn(
                  "w-11 h-11 flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2",
                  resolvedMenuTheme === "dark"
                    ? "border border-white/12 bg-white/5 hover:bg-white/10 focus-visible:ring-white/40"
                    : "border border-black/12 bg-black/4 hover:bg-black/8 focus-visible:ring-black/40"
                )}
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-none stroke-[1.5]" aria-hidden="true">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    strokeLinecap="round"
                    className={resolvedMenuTheme === "dark" ? "stroke-white" : "stroke-black"}
                  />
                </svg>
              </button>
            </div>

            {/* Mobile nav links */}
            <div className="flex-1 flex flex-col justify-center items-center px-8">
              <motion.nav
                variants={mobileLinkStagger}
                initial="hidden"
                animate="show"
                className="w-full flex flex-col items-center gap-2"
                aria-label="Main navigation"
              >
                {links.map((link, i) => (
                  <motion.div key={link.label} variants={mobileLinkItem} className="w-full flex flex-col items-center">
                    <Link
                      href={link.href}
                      ref={i === 0 ? firstLinkRef : undefined}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center justify-center w-full py-2 min-h-[48px]",
                        "font-display font-light text-[40px] leading-none tracking-[-0.04em]",
                        isActiveLink(link.href, pathname)
                          ? "text-primary font-medium"
                          : resolvedMenuTheme === "dark"
                            ? "text-white hover:text-white/60 focus-visible:ring-white/30"
                            : "text-black hover:text-black/50 focus-visible:ring-black/30",
                        "transition-colors duration-200 rounded-lg",
                      )}
                    >
                      {link.label}
                    </Link>
                    {link.children && link.children.length > 0 && (
                      <div className="flex flex-col items-center gap-1 mt-0.5 mb-2.5">
                        {link.children.map((child: NavigationItem) => (
                          <Link
                            key={child.title}
                            href={child.href}
                            onClick={closeMenu}
                            className={cn(
                              "font-mono text-xs py-1 flex items-center gap-1.5 transition-colors",
                              resolvedMenuTheme === "dark"
                                ? "text-neutral-400 hover:text-white"
                                : "text-neutral-500 hover:text-black"
                            )}
                          >
                            <span className="w-1 h-1 rounded-full bg-primary" />
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.nav>
            </div>

            {/* Mobile footer info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4, duration: DURATION.normal } }}
              className={cn(
                "flex flex-col items-center gap-4 px-8 pb-6 border-t pt-6",
                resolvedMenuTheme === "dark" ? "border-white/12" : "border-black/8"
              )}
              style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom, 0px))" }}
            >
              <div className="flex flex-col items-center gap-1">
                <a
                  href={`mailto:${email}`}
                  className={cn(
                    "font-sans text-xs transition-colors",
                    resolvedMenuTheme === "dark" ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black"
                  )}
                >
                  {email}
                </a>
                <span className={cn(
                  "font-sans text-xs",
                  resolvedMenuTheme === "dark" ? "text-white/35" : "text-black/35"
                )}>{address}</span>
              </div>
              <div className="flex items-center gap-5">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "font-mono text-[9px] uppercase tracking-widest transition-colors",
                      resolvedMenuTheme === "dark" ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
                    )}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
