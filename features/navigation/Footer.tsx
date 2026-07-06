"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { navigationConfig } from "@/config/navigation";
import Link from "next/link";
import Image from "next/image";
import { TextReveal } from "@/components/motion/TextReveal";
import { MotionSection } from "@/components/motion/MotionSection";
import { motion } from "framer-motion";
import { containerReveal, itemRevealFade } from "@/animations/variants/transitions";

const SUPPORT_EMAIL      = "hello@annex-consultancy.com";
const STUDIO_ADDRESS     = "Kolkata, India";
const CLOSING_COPY       = "We build for the web that matters.";

interface FooterProps {
  navLinks?: any[];
  logoUrl?: string;
  contactEmail?: string;
  contactAddress?: string;
  closingCopy?: string;
  copyrightText?: string;
  socialLinks?: { label: string; href: string }[];
}

export function Footer({
  navLinks,
  logoUrl,
  contactEmail,
  contactAddress,
  closingCopy,
  copyrightText,
  socialLinks,
}: FooterProps = {}) {
  const supportEmail       = contactEmail || SUPPORT_EMAIL;
  const address            = contactAddress || STUDIO_ADDRESS;
  const finalClosingCopy   = closingCopy || CLOSING_COPY;
  const logo               = logoUrl || "/images/logo.png";

  const links = (navLinks && navLinks.length > 0)
    ? navLinks
    : navigationConfig.mainNav;

  const socials = (socialLinks && socialLinks.length > 0)
    ? socialLinks
    : [
        { label: "GitHub", href: "https://github.com/annex" },
        { label: "LinkedIn", href: "https://linkedin.com/company/annex" },
        { label: "Instagram", href: "https://instagram.com/annex" },
      ];

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
          <MotionSection as="div" variant="rise" className="md:col-span-6 lg:col-span-5 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <div>
              <Link href="/" className="inline-block transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded" aria-label="ANNEX — Home">
                <Image
                  src={logo}
                  alt="ANNEX"
                  width={72}
                  height={36}
                  loading="lazy"
                  style={{ width: 72, height: 36, objectFit: "contain" }}
                />
              </Link>
              <p className="font-sans text-sm text-muted/75 max-w-xs mt-3 leading-relaxed">
                Bespoke digital design and high-end engineering for brands demanding an elite digital presence.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 pt-2">
              <a
                href={`mailto:${supportEmail}`}
                className="font-sans text-sm text-foreground/80 hover:text-primary transition-colors duration-300 w-fit mx-auto md:mx-0"
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
            className="md:col-span-3 lg:col-span-4 flex flex-col gap-4 items-center md:items-start text-center md:text-left"
          >
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted font-bold">[ Navigation ]</span>
            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-3 max-w-xs justify-items-center md:justify-items-start">
              {links.map((item: any) => (
                <motion.div key={item.title || item.label} variants={itemRevealFade}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 w-fit"
                  >
                    {item.title || item.label}
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
            className="md:col-span-3 lg:col-span-3 flex flex-col gap-4 items-center md:items-start text-center md:text-left"
          >
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted font-bold">[ Connect ]</span>
            <div className="flex flex-col gap-3 items-center md:items-start">
              {socials.map((link: any) => (
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
          <div>{copyrightText || `© ${new Date().getFullYear()} ANNEX. All rights reserved.`}</div>
          <div>Designed &amp; Developed by ANNEX</div>
          <div>Made in India</div>
        </MotionSection>
      </Container>
    </footer>
  );
}
