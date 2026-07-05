"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { navigationConfig } from "@/config/navigation";
import { createMenuOpenTimeline, createMenuCloseTimeline } from "@/animations/timeline/navTimeline";
import { shouldReduceMotion } from "@/animations/utils/reducedMotion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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
      // Simple CSS toggle for reduced-motion
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
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12 flex items-center justify-between">
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
