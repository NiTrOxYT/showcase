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
      className="w-full min-h-screen flex flex-col justify-end relative overflow-hidden bg-white select-none"
    >
      {/* Layer 1: Background Video */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-white">
        <motion.video
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: expoOut }}
          autoPlay
          muted
          playsInline
          loop
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] md:w-full md:h-full object-cover rounded-2xl md:rounded-none transition-all duration-1000"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
        />
        {/* Subtle white gradient overlay */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.8) 50%, transparent 100%)"
          }}
        />
      </div>

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
