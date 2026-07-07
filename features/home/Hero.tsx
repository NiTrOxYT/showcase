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
      <div className="hidden md:flex min-h-[100svh] xl:h-screen w-full items-center relative overflow-hidden px-8 lg:px-16 bg-white">
        <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Content (45% space) */}
          <div className="col-span-6 lg:col-span-5 flex flex-col items-start gap-5 text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: expoOut }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-black block animate-pulse" />
              <span className="font-mono text-xs text-black/55 uppercase tracking-widest font-bold">
                {subtitle}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.7, ease: expoOut }}
              className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] text-black tracking-[-0.04em] leading-[1.08] font-light max-w-[14ch] text-left"
              dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, "<br />") }}
            />

            {/* Supporting Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: expoOut }}
              className="font-sans text-sm md:text-base text-neutral-600 max-w-[42ch] leading-relaxed text-left"
            >
              {description}
            </motion.p>

            {/* CTA Buttons & Tech pills together */}
            <div className="flex flex-col gap-4 w-full mt-2">
              <div className="flex flex-wrap items-center gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0, ease: expoOut }}
                >
                  <Magnetic strength={0.15}>
                    <a
                      href="#showcase"
                      className="bg-black text-white hover:bg-neutral-900 px-6 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 inline-block"
                    >
                      View Our Work →
                    </a>
                  </Magnetic>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1, ease: expoOut }}
                  className="flex flex-wrap gap-1.5"
                >
                  {["Next.js", "Motion", "Performance"].map((label) => (
                    <div
                      key={label}
                      className="bg-neutral-50/80 border border-neutral-200/60 text-neutral-600 font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-flex items-center justify-center font-medium shadow-sm"
                    >
                      {label}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Column: Media (55% space) */}
          <div className="col-span-6 lg:col-span-7 relative h-[70vh] xl:h-[80vh] w-full flex items-center justify-center pointer-events-none select-none">
            <div className="w-[110%] h-[105%] relative left-[5%]">
              <motion.video
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.8, ease: expoOut }}
                autoPlay
                muted
                playsInline
                loop
                className="w-full h-full object-cover transition-all duration-1000"
                style={{
                  maskImage: "radial-gradient(circle at 45% 50%, black 35%, transparent 75%)",
                  WebkitMaskImage: "radial-gradient(circle at 45% 50%, black 35%, transparent 75%)",
                }}
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
              />
            </div>
          </div>
        </div>

        {/* Subtle bottom white fade to blend with next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (< 768px BREAKPOINT)                                        */}
      {/* ========================================================================= */}
      <div className="flex md:hidden min-h-[90svh] flex-col items-center justify-center py-20 px-6 text-center bg-white relative">
        <div className="w-full flex flex-col items-center gap-5 max-w-sm mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: expoOut }}
            className="flex items-center gap-2 justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black block animate-pulse" />
            <span className="font-mono text-[10px] text-black/55 uppercase tracking-widest font-bold">
              {subtitle}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5, ease: expoOut }}
            className="font-display text-3xl sm:text-4xl text-black tracking-[-0.03em] leading-tight font-light"
            dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, "<br />") }}
          />

          {/* Supporting Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: expoOut }}
            className="font-sans text-sm text-neutral-600 max-w-[32ch] leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Centered Media (Integrated Visual Sculpture) */}
          <div className="w-full aspect-[4/3] max-h-[260px] relative mx-auto my-2 bg-transparent pointer-events-none select-none">
            <motion.video
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, ease: expoOut }}
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-contain"
              style={{
                maskImage: "radial-gradient(circle at center, black 35%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(circle at center, black 35%, transparent 75%)",
              }}
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
            />
          </div>

          {/* CTA Buttons - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: expoOut }}
            className="w-full"
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
            className="flex flex-wrap justify-center gap-1.5 w-full mt-1"
          >
            {["Next.js", "Motion", "Performance"].map((label) => (
              <div
                key={label}
                className="bg-neutral-50/80 border border-neutral-200/60 text-neutral-600 font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-flex items-center justify-center font-medium shadow-sm"
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
