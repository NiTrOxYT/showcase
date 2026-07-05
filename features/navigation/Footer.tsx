import React from "react";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/typography/Heading";
import { navigationConfig } from "@/config/navigation";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/10 bg-background py-20 md:py-28 relative overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          <div className="md:col-span-5 max-w-sm">
            <Heading level={3} className="text-3xl font-bold tracking-widest mb-4">
              AVENIQ
            </Heading>
            <p className="font-sans text-sm text-muted/70 leading-relaxed">
              Bespoke digital design and high-end engineering for brands demanding an elite digital presence.
            </p>
          </div>

          <div className="md:col-span-7 flex flex-wrap gap-x-20 gap-y-12 md:justify-end">
            <div className="flex flex-col gap-3.5">
              <span className="font-sans text-[10px] uppercase tracking-widest text-muted font-bold">[ Navigation ]</span>
              {navigationConfig.mainNav.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="font-sans text-sm text-foreground/75 hover:text-foreground transition-colors duration-300"
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3.5">
              <span className="font-sans text-[10px] uppercase tracking-widest text-muted font-bold">[ Connect ]</span>
              <a href="https://github.com/aveniq" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-foreground/75 hover:text-foreground transition-colors duration-300">
                GitHub
              </a>
              <a href="https://twitter.com/aveniq" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-foreground/75 hover:text-foreground transition-colors duration-300">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/10 mt-20 pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="font-sans text-xs text-muted/60">
            &copy; {new Date().getFullYear()} AVENIQ. All rights reserved.
          </p>
          <p className="font-sans text-xs text-muted/60 tracking-wider">
            Designed for impact. Built for longevity.
          </p>
        </div>
      </Container>

      {/* Massive subtle brand backdrop text */}
      <div className="absolute -bottom-12 md:-bottom-24 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-2 z-0">
        <span className="font-display text-[15rem] md:text-[22rem] font-black tracking-widest text-foreground leading-none">
          AVENIQ
        </span>
      </div>
    </footer>
  );
}
