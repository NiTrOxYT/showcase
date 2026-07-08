"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Instagram, 
  ArrowUpRight, 
  ArrowRight, 
  Mail, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { safeSrc } from "@/lib/images";

const SUPPORT_EMAIL = "support@annex-consultancy.com";
const STUDIO_ADDRESS = "Kolkata, India";

interface FooterProps {
  navLinks?: { title?: string; label?: string; href: string }[];
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
  copyrightText,
  socialLinks,
}: FooterProps = {}) {
  const emailVal = contactEmail || SUPPORT_EMAIL;
  const addressVal = contactAddress || STUDIO_ADDRESS;
  const logo = logoUrl || "/images/logo.png";

  const links = (navLinks && navLinks.length > 0)
    ? navLinks
    : [
        { label: "Work", href: "/showcase" },
        { label: "About", href: "/#about" },
        { label: "Contact", href: "/#contact" },
      ];

  const socials = (socialLinks && socialLinks.length > 0)
    ? socialLinks
    : [
        { label: "GitHub", href: "https://github.com/NiTrOxYT" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/annex-consultancy-880a18420/" },
        { label: "Instagram", href: "https://www.instagram.com/annexconsultancy1/" },
      ];

  // Map social labels to Lucide icons
  const getSocialIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "github":
        return <Github className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Newsletter Client States
  const [emailInput, setEmailInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (data.alreadySubscribed) {
        setStatus("duplicate");
      } else {
        setStatus("success");
      }

      // Reset input and state after 2 seconds
      setTimeout(() => {
        setEmailInput("");
        setStatus("idle");
      }, 2000);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="border-t border-border/20 bg-background relative overflow-hidden">
      <Container className="py-20 md:py-24 max-w-[1440px] mx-auto">
        
        {/* Layout Top Section: 3-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-12 pb-16 border-b border-border/10">
          
          {/* Column 1: Company / Left Column */}
          <div className="flex flex-col gap-6">
            <div>
              <Link href="/" className="inline-block transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded" aria-label="ANNEX — Home">
                <Image
                  src={safeSrc(logo) || "/images/logo.png"}
                  alt="ANNEX Logo"
                  width={72}
                  height={36}
                  loading="lazy"
                  style={{ width: 72, height: 36, objectFit: "contain" }}
                />
              </Link>
              <p className="font-sans text-sm text-muted/75 mt-4 leading-relaxed max-w-xs">
                Bespoke digital design and high-end engineering for brands demanding an elite digital presence.
              </p>
            </div>
            
            <hr className="border-border/20 w-full" />
            
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${emailVal}`}
                className="font-sans text-sm text-foreground/85 hover:text-primary transition-colors duration-300 w-fit"
              >
                {emailVal}
              </a>
              <span className="font-sans text-xs text-muted/50 tracking-wider">
                {addressVal}
              </span>
            </div>

            {/* Social Icons with subtle anims */}
            <div className="flex gap-4 mt-2">
              {socials.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-border/20 rounded-lg text-muted/75 hover:text-foreground hover:border-foreground/50 transition-all duration-300 hover:scale-105"
                  aria-label={`ANNEX on ${link.label}`}
                >
                  {getSocialIcon(link.label)}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-6">
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted/50 font-bold">
              [ Navigation ]
            </span>
            <nav aria-label="Footer navigation" className="flex flex-col max-w-xs">
              {links.map((item: { title?: string; label?: string; href: string }) => (
                <Link
                  key={item.title || item.label}
                  href={item.href}
                  className="group flex items-center justify-between py-3 border-b border-border/10 text-foreground/75 hover:text-foreground transition-colors duration-300 font-sans text-sm"
                >
                  <span className="relative py-0.5">
                    {item.title || item.label}
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Connect Rows */}
          <div className="flex flex-col gap-6">
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted/50 font-bold">
              [ Connect ]
            </span>
            <div className="flex flex-col max-w-xs">
              {socials.map((link: { label: string; href: string }) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-3 border-b border-border/10 text-foreground/75 hover:text-foreground transition-colors duration-300 font-sans text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted/60 group-hover:text-foreground group-hover:scale-110 transition-all duration-300">
                      {getSocialIcon(link.label)}
                    </span>
                    <span className="relative py-0.5">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Layout Middle Section: Premium Newsletter / Contact CTA */}
        <div className="my-16 p-8 md:p-12 rounded-xl bg-surface/30 border border-border/15 backdrop-blur-md flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-8 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="p-3 border border-border/20 rounded-lg bg-background/50 text-primary">
              <Mail className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                Let&apos;s build something exceptional
              </h3>
              <p className="font-sans text-sm text-muted/75 mt-2 leading-relaxed">
                Have a project in mind?<br />Let&apos;s create something amazing together.
              </p>
            </div>
          </div>

          {/* Subscription Form Right */}
          <div className="w-full lg:max-w-md flex flex-col gap-2">
            <form onSubmit={handleSubscribe} className="relative flex items-center border border-border/40 focus-within:border-primary rounded-lg bg-background/40 transition-colors duration-300 overflow-hidden">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={status === "loading" || status === "success" || status === "duplicate"}
                className="w-full bg-transparent px-4 py-3.5 text-sm focus:outline-none placeholder:text-muted/40 pr-12 text-foreground disabled:opacity-60"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success" || status === "duplicate" || !emailInput.trim()}
                className="absolute right-2 p-2 border border-border/20 rounded bg-surface/50 text-muted/80 hover:text-foreground disabled:opacity-50 transition-colors duration-200"
                aria-label="Subscribe"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>

            {/* Custom state alerts */}
            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 text-xs text-green-400 mt-1"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">You&apos;re on the list.</span>
                    <span className="block opacity-90">We&apos;ll occasionally send carefully crafted insights. No spam.</span>
                  </div>
                </motion.div>
              )}

              {status === "duplicate" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs text-yellow-400 mt-1"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="font-bold">You&apos;re already subscribed.</span>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs text-red-400 mt-1"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Layout Bottom Section: Copyright, Logo, Design credits */}
        <div className="border-t border-border/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-muted/65 text-xs font-sans order-2 md:order-1">
            {copyrightText || `© ${new Date().getFullYear()} ANNEX. All rights reserved.`}
          </div>
          
          <div className="flex justify-center order-1 md:order-2">
            <Link href="/" aria-label="ANNEX Home">
              <Image
                src={safeSrc(logo) || "/images/logo.png"}
                alt="ANNEX Logo"
                width={50}
                height={25}
                className="opacity-55 hover:opacity-100 transition-opacity duration-300 object-contain"
              />
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-muted/65 text-xs font-sans order-3">
            <span>Designed &amp; Developed by ANNEX</span>
            <span className="hidden sm:inline text-border/30">•</span>
            <span>Made in India</span>
          </div>
        </div>

      </Container>
    </footer>
  );
}
