"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { DURATION, EASE } from "@/animations/core/tokens";
import { safeSrc } from "@/lib/images";

// ─── Nav links ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Work",      href: "/showcase",  num: "01" },
  { label: "About",     href: "/#about",    num: "02" },
  { label: "Contact",   href: "/#contact",  num: "03" },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn",  href: "https://linkedin.com/company/annex" },
  { label: "GitHub",    href: "https://github.com/annex" },
  { label: "Behance",   href: "https://behance.net/annex" },
  { label: "Instagram", href: "https://instagram.com/annex" },
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
  show:   { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE.entrance } },
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
  show:   { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.entrance } },
};

// ─── Logo Image helper ───────────────────────────────────────────────────────
// height=36px desktop, 32px tablet, 26px mobile → ratio 1774:887 ≈ 2:1
function AnnexLogo({ size = "desktop", priority = false, logoUrl }: { size?: "desktop" | "tablet" | "mobile"; priority?: boolean; logoUrl?: string }) {
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
      style={{ width: w, height: h, objectFit: "contain" }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const EMAIL   = "hello@annex-consultancy.com";
const ADDRESS = "Kolkata, India";

interface NavbarProps {
  navLinks?: any[];
  logoUrl?: string;
  contactEmail?: string;
  contactAddress?: string;
}

export function Navbar({ navLinks, logoUrl, contactEmail, contactAddress }: NavbarProps = {}) {
  const email   = contactEmail || EMAIL;
  const address = contactAddress || ADDRESS;
  const logo    = logoUrl || "/images/logo.png";

  const links: any[] = (navLinks && navLinks.length > 0)
    ? navLinks.map((item, idx) => ({
        label: item.title,
        href: item.href,
        num: `0${idx + 1}`,
        children: item.children || [],
      }))
    : NAV_LINKS.map((item) => ({ ...item, children: [] }));

  const [isScrolled,  setIsScrolled]  = useState(false);
  const [isVisible,   setIsVisible]   = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [hoverOpen,   setHoverOpen]   = useState(false);

  const menuBtnRef  = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const hoverTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);


  // ── Scroll hide/show ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
      setIsVisible(!(y > lastScrollY && y > 100));
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

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
      document.body.style.top      = `-${scrollY}px`;
      document.body.style.left     = "0";
      document.body.style.right    = "0";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top      = "";
      document.body.style.left     = "";
      document.body.style.right    = "";
      document.body.style.overflow = "";
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top      = "";
      document.body.style.left     = "";
      document.body.style.right    = "";
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
  const handleMenuMouseEnter = () => {
    if (menuOpen) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoverOpen(true);
  };
  const handleMenuMouseLeave = () => {
    hoverTimer.current = setTimeout(() => setHoverOpen(false), 80);
  };
  const handlePanelMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };
  const handlePanelMouseLeave = () => {
    hoverTimer.current = setTimeout(() => setHoverOpen(false), 80);
  };

  // ─── Shared bar padding / bg ───────────────────────────────────────────
  const barBg   = isScrolled ? "bg-white/85 backdrop-blur-xl border-b border-black/5 shadow-sm" : "bg-transparent";
  const barPy   = isScrolled ? "py-4" : "py-6";

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
            <span className="hidden md:block"><AnnexLogo size="desktop" priority logoUrl={logo} /></span>
            <span className="hidden sm:block md:hidden"><AnnexLogo size="tablet" priority logoUrl={logo} /></span>
            <span className="sm:hidden"><AnnexLogo size="mobile" priority logoUrl={logo} /></span>
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
                "px-4 py-2 rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40",
                menuOpen
                  ? "bg-black text-white border-black"
                  : "bg-black text-white border-black hover:bg-black/85",
              )}
            >
              {/* Animated dot → X */}
              <span className="relative w-2.5 h-2.5 flex items-center justify-center shrink-0">
                <span className={cn(
                  "absolute block w-2 h-[1.5px] bg-white transition-all duration-200",
                  menuOpen ? "rotate-45 translate-y-0" : "-translate-y-[2.5px]"
                )} />
                <span className={cn(
                  "absolute block w-2 h-[1.5px] bg-white transition-all duration-200",
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
                  className="hidden md:block absolute top-[calc(100%+10px)] right-0 w-44 bg-white/90 backdrop-blur-2xl border border-black/8 rounded-2xl shadow-xl py-3 px-4 z-10"
                  role="menu"
                  aria-label="Quick navigation"
                >
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      role="menuitem"
                      onClick={() => setHoverOpen(false)}
                      className="block py-1.5 font-sans text-xs text-black/70 hover:text-black transition-colors duration-150 tracking-wide"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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
                "bg-white/88 backdrop-blur-[28px]",
                "rounded-[28px] border border-black/8",
                "shadow-[0_24px_64px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)]",
                "p-10",
              )}
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
                          "rounded-xl transition-colors duration-200 hover:bg-black/4",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30",
                        )}
                      >
                        <span className="font-mono text-[9px] text-black/30 w-5 shrink-0 translate-y-[-1px]">
                          {link.num}
                        </span>
                        <span
                          className={cn(
                            "font-display font-light tracking-[-0.04em] leading-none text-black",
                            "text-[48px] lg:text-[52px]",
                            "relative after:absolute after:bottom-[6px] after:left-0 after:h-[1.5px] after:bg-black",
                            "after:w-0 group-hover:after:w-full after:transition-all after:duration-300",
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
                  <p className="font-mono text-[9px] uppercase tracking-widest text-black/40 font-bold">Studio</p>
                  <div className="flex flex-col gap-2">
                    <p className="font-sans text-xs text-black/70 leading-relaxed">Independent Digital Studio</p>
                    <p className="font-sans text-xs text-black/50">{address}</p>
                    <a
                      href={`mailto:${email}`}
                      className="font-sans text-xs text-black/60 hover:text-black transition-colors duration-150 underline underline-offset-2"
                    >
                      {email}
                    </a>
                  </div>
                  <div className="pt-2 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
                      <p className="font-mono text-[9px] text-black/50 uppercase tracking-wider">Accepting projects</p>
                    </div>
                    <p className="font-mono text-[9px] text-black/35 uppercase tracking-wider pl-3">Avg. reply &lt;24h</p>
                  </div>
                </motion.aside>
              </div>

              {/* ── Bottom: Social links ──────────────────────────── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3, duration: DURATION.normal } }}
                className="flex items-center gap-6 border-t border-black/8 pt-6"
              >
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] uppercase tracking-widest text-black/40 hover:text-black transition-colors duration-150"
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
            className="md:hidden fixed inset-0 z-[60] bg-white flex flex-col overflow-hidden"
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
                <AnnexLogo size="mobile" priority logoUrl={logo} />
              </Link>

              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="w-11 h-11 flex items-center justify-center rounded-full border border-black/12 bg-black/4 hover:bg-black/8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-none stroke-black stroke-[1.5]" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
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
                        "font-display font-light text-[40px] leading-none tracking-[-0.04em] text-black",
                        "hover:text-black/50 transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 rounded-lg",
                      )}
                    >
                      {link.label}
                    </Link>
                    {link.children && link.children.length > 0 && (
                      <div className="flex flex-col items-center gap-1 mt-0.5 mb-2.5">
                        {link.children.map((child: any) => (
                          <Link
                            key={child.title}
                            href={child.href}
                            onClick={closeMenu}
                            className="font-mono text-xs text-neutral-500 hover:text-black transition-colors py-1 flex items-center gap-1.5"
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
              className="flex flex-col items-center gap-4 px-8 pb-6 border-t border-black/8 pt-6"
              style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom, 0px))" }}
            >
              <div className="flex flex-col items-center gap-1">
                <a
                  href={`mailto:${email}`}
                  className="font-sans text-xs text-black/50 hover:text-black transition-colors"
                >
                  {email}
                </a>
                <span className="font-sans text-xs text-black/35">{address}</span>
              </div>
              <div className="flex items-center gap-5">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] uppercase tracking-widest text-black/40 hover:text-black transition-colors"
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
