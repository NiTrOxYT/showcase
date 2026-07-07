"use client";

import React, { useRef, useEffect } from "react";
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
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  
  const title = settings?.title || "Design that earns trust.<br />Before a single click.";
  const subtitle = settings?.subtitle || "Independent Digital Studio";
  const description = settings?.description || "We design and engineer high-performance websites that elevate brands, simplify experiences, and leave lasting first impressions.";

  // Easing curve token
  const expoOut = EASE.standard; // [0.16, 1, 0.3, 1]

  useEffect(() => {
    const playVideo = (videoEl: HTMLVideoElement | null) => {
      if (videoEl) {
        videoEl.muted = true;
        videoEl.play().catch((err) => {
          console.warn("Autoplay block or fail:", err);
        });
      }
    };

    playVideo(desktopVideoRef.current);
    playVideo(mobileVideoRef.current);
  }, []);

  return (
    <div ref={containerRef} className="w-full select-none bg-white">
      {/* ========================================================================= */}
      {/* DESKTOP & TABLET LAYOUT (>= 768px BREAKPOINT)                             */}
      {/* ========================================================================= */}
      <div className="hidden md:flex min-h-[100svh] xl:h-screen w-full flex-col justify-center relative overflow-hidden px-8 lg:px-12 bg-white">
        
        {/* Layer 1: Background Video Visual Stage (Floating sculpture on the right) */}
        <div className="absolute top-1/2 -translate-y-1/2 right-[6%] lg:right-[8%] w-[45vw] h-[80vh] pointer-events-none select-none z-10 flex items-center justify-center">
          {/* Subtle white atmospheric fade overlaying the sculpture edges */}
          <div className="absolute w-[80%] h-[80%] bg-neutral-100/5 blur-[120px] rounded-full pointer-events-none z-0" />
          
          <motion.video
            ref={desktopVideoRef}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -8, 0],
              rotate: [0, 1.5, 0]
            }}
            transition={{
              opacity: { duration: 1.8, ease: expoOut },
              scale: { duration: 1.8, ease: expoOut },
              y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            className="w-full h-full object-contain pointer-events-none select-none z-10"
            style={{
              mixBlendMode: "multiply",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            }}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
          />
        </div>

        {/* Layer 2: Editorial Content (Asymmetrical Left Anchor Layout) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-start justify-center h-full">
          <div className="flex flex-col items-start gap-6 max-w-xl lg:max-w-2xl text-left">
            {/* Eyebrow */}
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
              className="font-display text-4xl lg:text-[4rem] xl:text-[4.5rem] text-black tracking-[-0.03em] leading-[1.05] font-light max-w-xl text-left"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {/* Supporting Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: expoOut }}
              className="font-sans text-sm md:text-base text-neutral-500 max-w-[42ch] leading-relaxed mt-2 text-left"
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-6 items-start mt-2">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0, ease: expoOut }}
              >
                <Magnetic strength={0.15}>
                  <a
                    href="#showcase"
                    className="bg-black text-white hover:bg-neutral-900 px-6 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm font-semibold focus-visible:outline-none inline-block focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    View Selected Work
                  </a>
                </Magnetic>
              </motion.div>

              {/* Capability tag pills */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1, ease: expoOut }}
                className="flex flex-wrap gap-2"
              >
                {["Next.js", "Motion", "Performance"].map((label) => (
                  <div
                    key={label}
                    className="bg-neutral-50 text-neutral-600 border border-neutral-200/40 font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center justify-center font-medium shadow-sm"
                  >
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Subtle white bottom transition gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #ffffff)"
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (< 768px BREAKPOINT)                                        */}
      {/* ========================================================================= */}
      <div className="flex md:hidden min-h-auto flex-col items-center pt-[96px] pb-16 px-6 text-center bg-white relative overflow-hidden">
        <div className="w-full flex flex-col items-center gap-8">
          
          {/* Centered Media at the Top with mask blending */}
          <div className="flex items-center justify-center w-[95vw] h-[35vh] max-h-[360px] mx-auto relative overflow-visible z-10">
            {/* Ambient visual shadow */}
            <div className="absolute w-[70%] h-[70%] bg-neutral-200/20 blur-[80px] rounded-full pointer-events-none z-0" />
            
            <motion.video
              ref={mobileVideoRef}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -4, 0]
              }}
              transition={{
                opacity: { duration: 1.8, ease: expoOut },
                scale: { duration: 1.8, ease: expoOut },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              className="w-full h-full object-contain pointer-events-none select-none z-10"
              style={{
                mixBlendMode: "multiply",
                maskImage: "radial-gradient(circle at center, black 45%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(circle at center, black 45%, transparent 75%)",
              }}
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
            />
          </div>

          {/* Text and CTA Group */}
          <div className="flex flex-col items-center gap-4 max-w-sm relative z-20">
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
              className="font-display text-3xl text-black tracking-[-0.03em] leading-[1.1] font-light max-w-xs"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {/* Supporting Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: expoOut }}
              className="font-sans text-xs text-neutral-500 max-w-[34ch] leading-relaxed"
            >
              {description}
            </motion.p>

            {/* CTAs Below Text */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: expoOut }}
              className="w-full max-w-[280px] mt-2"
            >
              <a
                href="#showcase"
                className="bg-black text-white hover:bg-neutral-900 w-full py-3.5 rounded-full font-mono text-[10px] uppercase tracking-widest text-center transition-all duration-300 font-semibold focus-visible:outline-none block focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                View Selected Work
              </a>
            </motion.div>

            {/* Capability tag pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: expoOut }}
              className="flex flex-wrap justify-center gap-1.5 w-full mt-4"
            >
              {["Next.js", "Motion", "Performance"].map((label) => (
                <div
                  key={label}
                  className="bg-neutral-50 text-neutral-600 border border-neutral-200/40 font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-flex items-center justify-center font-medium shadow-sm"
                >
                  {label}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

