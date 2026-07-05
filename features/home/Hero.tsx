"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE } from "@/animations/core/tokens";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Easing curve token
  const expoOut = EASE.standard; // [0.16, 1, 0.3, 1]

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex flex-col justify-center relative overflow-hidden bg-white select-none pt-24 pb-16 px-6 md:px-12"
    >
      {/* Layer 1: Background Video (Abstract Bionic Sculpture Stage) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-white pointer-events-none">
        <motion.video
          initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 1.05 }}
          animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
          transition={{ duration: 1.8, ease: expoOut }}
          autoPlay
          muted
          playsInline
          loop
          className="absolute top-1/2 left-1/2 md:left-[60%] w-[80%] h-[75%] md:w-[52%] md:h-[82%] object-cover rounded-3xl md:rounded-2xl transition-all duration-1000 shadow-[0_24px_80px_rgba(0,0,0,0.04)] border border-neutral-100/50 bg-neutral-50/20"
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
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-start justify-center h-full pt-12 md:pt-0">
        <div className="flex flex-col items-start gap-6 max-w-2xl text-left">
          
          {/* Caption / Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: expoOut }}
            className="flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-black block" />
            <span className="font-mono text-xs text-black/55 uppercase tracking-widest font-bold">
              Independent Digital Studio
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.7, ease: expoOut }}
            className="font-display text-4xl md:text-6xl lg:text-[4.5rem] text-black tracking-[-0.03em] leading-[1.05] font-light max-w-xl text-left"
          >
            Design that earns <br />
            <span className="font-medium text-black/60">
              trust before words.
            </span>
          </motion.h1>

          {/* Supporting Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: expoOut }}
            className="font-sans text-sm md:text-base text-neutral-700 max-w-[45ch] leading-relaxed mt-2 text-left"
          >
            A bionic design studio combining raw engineering with cinematic motion to build websites your competitors wish they launched.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: expoOut }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Magnetic strength={0.15}>
              <a
                href="#showcase"
                className="bg-black text-white hover:bg-neutral-900 px-6 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm font-semibold focus-visible:outline-none"
              >
                View Our Work →
              </a>
            </Magnetic>
            
            <Magnetic strength={0.15}>
              <a
                href="#contact"
                className="bg-transparent text-black border border-black/30 hover:border-black/75 px-6 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 font-semibold focus-visible:outline-none"
              >
                Start a Project
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
  );
}
