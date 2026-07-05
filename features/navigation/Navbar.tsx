"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { navigationConfig } from "@/config/navigation";
import { createMenuOpenTimeline, createMenuCloseTimeline } from "@/animations/timeline/navTimeline";
import { shouldReduceMotion } from "@/animations/utils/reducedMotion";

import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const isHomepageHero = pathname === "/" && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const links = linkRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!backdrop) return;

    if (shouldReduceMotion()) {
      backdrop.style.opacity = isMenuOpen ? "1" : "0";
      backdrop.style.pointerEvents = isMenuOpen ? "auto" : "none";
      return;
    }

    if (isMenuOpen) {
      createMenuOpenTimeline(backdrop, links);
    } else {
      createMenuCloseTimeline(backdrop);
    }
  }, [isMenuOpen]);

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);
  const handleClose = () => setIsMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-4"
          : "bg-transparent py-6"
      )}
    >
      <div
        className={cn(
          "w-full transition-all duration-500 mx-auto",
          isHomepageHero
            ? "px-4 md:px-8 lg:px-10 max-w-full"
            : "max-w-7xl px-6 md:px-8 lg:px-12"
        )}
      >
        {isHomepageHero ? (
          <div className="flex items-center justify-between w-full">
            {/* Left Block */}
            <div className="flex items-center gap-3">
              {/* Logo block */}
              <div className="hidden md:flex items-center gap-2 mr-2">
                <svg className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 22h20L12 2zm0 4l7.5 13.5h-15L12 6z" />
                  <circle cx="12" cy="14" r="2.5" />
                </svg>
                <span className="font-display text-sm tracking-tighter font-medium text-black">
                  ANNEX
                </span>
              </div>

              {/* Menu pill trigger */}
              <button
                onClick={handleMenuToggle}
                className="bg-black text-white hover:bg-black/90 font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full inline-flex items-center gap-2.5 transition-all duration-300 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white block shrink-0" />
                <span>+</span>
                <span>Menu</span>
              </button>

              {/* Info status pill */}
              <div className="hidden md:inline-flex items-center gap-2 bg-[#f3f4f6]/80 text-[#374151] border border-[#e5e7eb] font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full">
                <span>Design Studio</span>
                <span className="text-muted/60">•</span>
                <span>Next.js Experts</span>
              </div>
            </div>

            {/* Right Block */}
            <div className="hidden md:flex items-center">
              <a
                href="#showcase"
                className="inline-flex items-center gap-2 bg-[#f3f4f6]/80 text-[#374151] border border-[#e5e7eb] hover:bg-[#e5e7eb] font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full transition-colors duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#374151] block shrink-0" />
                <span>Selected Work</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-bold tracking-wider hover:opacity-80 transition-opacity">
              ANNEX
            </Link>

            {/* Minimal Trigger */}
            <button
              onClick={handleMenuToggle}
              className="font-sans text-xs uppercase tracking-widest text-foreground/80 hover:text-foreground focus:outline-none transition-colors p-3 -mr-3"
              aria-expanded={isMenuOpen}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Menu */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-background/95 backdrop-blur-lg z-40 flex items-center justify-center"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        <nav className="text-center flex flex-col gap-8">
          {navigationConfig.mainNav.map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              onClick={handleClose}
              className="font-display text-3xl md:text-5xl font-bold hover:text-primary transition-colors duration-300"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
