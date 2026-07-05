"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE } from "@/animations/core/tokens";
import dynamic from "next/dynamic";

function HeroStaticFallback() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center pointer-events-none select-none bg-white">
      {/* Background ambient lighting vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,240,240,0.6)_0%,rgba(255,255,255,1)_80%)] z-0" />
      
      {/* Static abstract sculpture simulation using CSS/glass layers */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-neutral-200/40 via-neutral-100/10 to-transparent border border-neutral-200/25 backdrop-blur-md shadow-2xl flex items-center justify-center animate-[pulse_6s_infinite_ease-in-out]">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-[#141414] shadow-inner opacity-90 border border-neutral-800/30" />
      </div>
    </div>
  );
}

const Hero3DScene = dynamic(() => import("./components/Hero3DScene"), {
  ssr: false,
  loading: () => <HeroStaticFallback />,
});

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Easing curve token
  const expoOut = EASE.standard; // [0.16, 1, 0.3, 1]

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex flex-col justify-end relative overflow-hidden bg-white select-none"
    >
      {/* Layer 1: Interactive 3D WebGL Canvas */}
      <Hero3DScene fallback={<HeroStaticFallback />} />

      {/* Layer 3: Bottom Editorial Content */}
      <div className="relative z-20 w-full px-6 md:px-12 pb-16 md:pb-24 pt-32">
        <div className="mx-auto w-full max-w-7xl flex flex-col md:flex-row items-end justify-between gap-10">
          
          {/* Left Block */}
          <div className="flex flex-col items-start gap-6 max-w-3xl">
            {/* Caption */}
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
              className="font-display text-4xl md:text-6xl lg:text-[4.5rem] text-black tracking-[-0.03em] leading-[1.05] font-light max-w-4xl"
            >
              Crafting websites <br className="hidden md:inline" />
              people remember. <br />
              <span className="font-medium text-black/60">
                Built for brands <br className="hidden md:inline" />
                that expect more.
              </span>
            </motion.h1>

            {/* Supporting Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: expoOut }}
              className="font-sans text-sm md:text-base text-neutral-700 max-w-[50ch] leading-relaxed mt-2"
            >
              Design, engineering and motion working together to create websites that build trust from the very first interaction.
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
          </div>

          {/* Right Block */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: expoOut }}
            className="flex md:flex-col gap-2 shrink-0"
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
