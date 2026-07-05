"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { navigationConfig } from "@/config/navigation";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          AVENIQ
        </Link>

        {/* Minimal Trigger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="font-sans text-xs uppercase tracking-widest text-foreground/80 hover:text-foreground focus:outline-none transition-colors p-3 -mr-3"
          aria-expanded={isMenuOpen}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Fullscreen Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-background/95 backdrop-blur-lg z-40 flex items-center justify-center transition-all duration-500 ease-out",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="text-center flex flex-col gap-8">
          {navigationConfig.mainNav.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
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
