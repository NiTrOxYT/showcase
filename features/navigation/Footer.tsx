import React from "react";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/typography/Heading";
import { navigationConfig } from "@/config/navigation";
import Link from "next/link";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";

export function Footer() {
  const brandingSettings = SettingsRepository.getModule("branding");
  const contactSettings = SettingsRepository.getModule("contact");
  const footerSettings = SettingsRepository.getModule("footer");
  
  const brandName = brandingSettings.brandName || "ANNEX";
  const supportEmail = contactSettings.email || "support@annex.com";
  const address = contactSettings.address || "Bengaluru, India";
  const finalClosingCopy = footerSettings.finalClosingCopy || "We build for the web that matters.";

  return (
    <footer className="border-t border-border/20 bg-background relative overflow-hidden">
      <Container className="py-24 md:py-32">
        {/* Stage 1: Large closing statement */}
        <div className="text-center mb-24 md:mb-32">
          <Heading level={2} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tightest max-w-4xl mx-auto leading-none text-foreground/95">
            {finalClosingCopy}
          </Heading>
        </div>

        {/* Stage 2: Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 md:pb-24 border-b border-border/10">
          {/* Left Block */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div>
              <Link href="/" className="font-display text-2xl font-black tracking-wider text-foreground">
                {brandName}
              </Link>
              <p className="font-sans text-sm text-muted/75 max-w-xs mt-3 leading-relaxed">
                Bespoke digital design and high-end engineering for brands demanding an elite digital presence.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 pt-2">
              <a
                href={`mailto:${supportEmail}`}
                className="font-sans text-sm text-foreground/80 hover:text-primary transition-colors duration-300 w-fit"
              >
                {supportEmail}
              </a>
              <span className="font-sans text-[11px] text-muted/50 tracking-wider">
                {address}
              </span>
            </div>
          </div>

          {/* Center Block: Navigation */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted font-bold">[ Navigation ]</span>
            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-3 max-w-xs">
              {navigationConfig.mainNav.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="font-sans text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 w-fit"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Block: Socials */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted font-bold">[ Connect ]</span>
            <div className="flex flex-col gap-3">
              <a href="https://github.com/annex" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 w-fit">
                GitHub
              </a>
              <a href="https://linkedin.com/company/annex" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 w-fit">
                LinkedIn
              </a>
              <a href="https://twitter.com/annex" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 w-fit">
                X / Twitter
              </a>
              <a href="https://instagram.com/annex" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 w-fit">
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Stage 3: Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-muted/65 font-sans tracking-wide">
          <div>
            &copy; {new Date().getFullYear()} ANNEX.
          </div>
          <div>
            Designed & Developed by ANNEX
          </div>
          <div>
            Made in India
          </div>
        </div>
      </Container>
    </footer>
  );
}
