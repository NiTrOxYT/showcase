"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE } from "@/animations/core/tokens";

interface HeroProps {
  settings?: {
    title: string;
    subtitle: string;
    description: string;
  };
}

export function Hero({ settings }: HeroProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const title = settings?.title || "Design that earns trust before words.";
  const subtitle = settings?.subtitle || "Independent Digital Studio";
  const description = settings?.description || "A bionic design studio combining raw engineering with cinematic motion to build websites your competitors wish they launched.";

  // Easing curve token
  const expoOut = EASE.standard; // [0.16, 1, 0.3, 1]

  return (
    <div ref={containerRef} className="w-full select-none bg-white">
      {/* ========================================================================= */}
      {/* DESKTOP & TABLET LAYOUT (>= 768px BREAKPOINT)                             */}
      {/* ========================================================================= */}
      <div className="hidden md:flex min-h-[100svh] xl:h-screen w-full flex-col justify-center relative overflow-hidden px-8 lg:px-12">
        {/* Layer 1: Background Video Visual Stage */}
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-white pointer-events-none">
          {/* Custom scale & positioning per viewport */}
          <motion.video
            initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 1.05 }}
            animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
            transition={{ duration: 1.8, ease: expoOut }}
            autoPlay
            muted
            playsInline
            loop
            className="absolute top-1/2 left-[58%] lg:left-[62%] w-[42%] lg:w-[48%] h-[68%] lg:h-[80%] rounded-2xl transition-all duration-1000 shadow-[0_24px_80px_rgba(0,0,0,0.04)] border border-neutral-100/50 bg-neutral-50/20 object-contain lg:object-cover"
            style={{ objectPosition: "35% center" }}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
          />
          {/* Subtle white fade-up gradient overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.2) 75%, transparent 100%)"
            }}
          />
        </div>

        {/* Layer 3: Editorial Content (Asymmetrical Left Anchor Layout) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-start justify-center h-full">
          <div className="flex flex-col items-start gap-6 max-w-xl lg:max-w-2xl text-left">
            {/* Caption / Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: expoOut }}
              className="flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-black block" />
              <span className="font-mono text-xs text-black/55 uppercase tracking-widest font-bold">
                {subtitle}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.7, ease: expoOut }}
              className="font-display text-4xl lg:text-[4.5rem] text-black tracking-[-0.03em] leading-[1.05] font-light max-w-xl text-left"
              dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, "<br />") }}
            />

            {/* Supporting Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: expoOut }}
              className="font-sans text-sm md:text-base text-neutral-700 max-w-[45ch] leading-relaxed mt-2 text-left"
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: expoOut }}
              className="pt-4"
            >
              <Magnetic strength={0.15}>
                <a
                  href="#showcase"
                  className="bg-black text-white hover:bg-neutral-900 px-6 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm font-semibold focus-visible:outline-none inline-block"
                >
                  View Our Work →
                </a>
              </Magnetic>
            </motion.div>

            {/* Capability tag pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1, ease: expoOut }}
              className="flex flex-wrap gap-2 mt-8"
            >
              {["Next.js", "Motion", "Performance"].map((label) => (
                <div
                  key={label}
                  className="bg-white/90 backdrop-blur text-black border border-black/10 font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full inline-flex items-center justify-center font-medium shadow-sm"
                >
                  {label}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (< 768px BREAKPOINT)                                        */}
      {/* ========================================================================= */}
      <div className="flex md:hidden min-h-auto flex-col items-center pt-[88px] pb-16 px-6 text-center bg-white relative">
        <div className="w-full flex flex-col items-center gap-6">

          {/* Video First on Mobile */}
          <div className="flex items-center justify-center w-[90vw] h-[42vh] max-h-[420px] mx-auto relative rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50/50 shadow-sm">
            <motion.video
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, ease: expoOut }}
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-contain"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
            />
          </div>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: expoOut }}
            className="flex items-center gap-2 justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black block" />
            <span className="font-mono text-[10px] text-black/55 uppercase tracking-widest font-bold">
              {subtitle}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5, ease: expoOut }}
            className="font-display text-4xl text-black tracking-[-0.03em] leading-[1.1] font-light max-w-sm"
            dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, "<br />") }}
          />

          {/* Supporting Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: expoOut }}
            className="font-sans text-sm text-neutral-700 max-w-[34ch] leading-relaxed"
          >
            {description}
          </motion.p>

          {/* CTA Buttons - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: expoOut }}
            className="w-full max-w-[340px]"
          >
            <a
              href="#showcase"
              className="bg-black text-white hover:bg-neutral-900 w-full py-3.5 rounded-full font-mono text-[10px] uppercase tracking-widest text-center transition-all duration-300 font-semibold focus-visible:outline-none block"
            >
              View Our Work →
            </a>
          </motion.div>

          {/* Capability tag pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: expoOut }}
            className="flex flex-wrap justify-center gap-1.5 w-full"
          >
            {["Next.js", "Motion", "Performance"].map((label) => (
              <div
                key={label}
                className="bg-white/90 backdrop-blur text-black border border-black/10 font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-flex items-center justify-center font-medium shadow-sm"
              >
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
