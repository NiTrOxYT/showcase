"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { navigationConfig } from "@/config/navigation";
import Link from "next/link";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { TextReveal } from "@/components/motion/TextReveal";
import { MotionSection } from "@/components/motion/MotionSection";
import { motion } from "framer-motion";
import { containerReveal, itemRevealFade } from "@/animations/variants/transitions";

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
          <TextReveal
            as="h2"
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tightest max-w-4xl mx-auto leading-none text-foreground/95"
            start="top 85%"
          >
            {finalClosingCopy}
          </TextReveal>
        </div>

        {/* Stage 2: Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 md:pb-24 border-b border-border/10">
          {/* Left Block */}
          <MotionSection as="div" variant="rise" className="md:col-span-5 flex flex-col gap-6">
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
          </MotionSection>

          {/* Center Block: Navigation */}
          <motion.div
            variants={containerReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:col-span-4 flex flex-col gap-4"
          >
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted font-bold">[ Navigation ]</span>
            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-3 max-w-xs">
              {navigationConfig.mainNav.map((item) => (
                <motion.div key={item.title} variants={itemRevealFade}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 w-fit"
                  >
                    {item.title}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Right Block: Socials */}
          <motion.div
            variants={containerReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:col-span-3 flex flex-col gap-4"
          >
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted font-bold">[ Connect ]</span>
            <div className="flex flex-col gap-3">
              {[
                { label: "GitHub", href: "https://github.com/annex" },
                { label: "LinkedIn", href: "https://linkedin.com/company/annex" },
                { label: "X / Twitter", href: "https://twitter.com/annex" },
                { label: "Instagram", href: "https://instagram.com/annex" },
              ].map((link) => (
                <motion.div key={link.label} variants={itemRevealFade}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 w-fit"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stage 3: Bottom Bar */}
        <MotionSection as="div" variant="fade" className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-muted/65 font-sans tracking-wide">
          <div>&copy; {new Date().getFullYear()} ANNEX.</div>
          <div>Designed &amp; Developed by ANNEX</div>
          <div>Made in India</div>
        </MotionSection>
      </Container>
    </footer>
  );
}
