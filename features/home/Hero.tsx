"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero() {
  const expoOut = [0.16, 1, 0.3, 1];

  return (
    <div className={styles.heroContainer}>
      
      {/* Background Video */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: expoOut }}
        className={styles.videoWrapper}
      >
        <video
          autoPlay
          muted
          playsInline
          loop
          className={styles.videoElement}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
        />
      </motion.div>

      {/* Navbar Layer */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: expoOut }}
        className={styles.navbar}
      >
        <div className={styles.navLeft}>
          {/* Logo Custom SVG Icon */}
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="4" width="6" height="14" rx="3" transform="rotate(-35 5 4)" fill="#000000" />
              <rect x="13" y="8" width="6" height="14" rx="3" transform="rotate(-35 13 8)" fill="#000000" />
            </svg>
          </div>
          
          <span className={styles.brandText}>NeuralKinetics</span>

          {/* Menu Trigger Button */}
          <button className={styles.blackPill}>
            <span className={styles.whiteCircle}>
              <Plus size={12} strokeWidth={3} />
            </span>
            <span>Menu</span>
          </button>

          {/* Tags Pill */}
          <div className={styles.grayPill}>
            <span>Advanced Bionics</span>
            <span className={styles.tagDivider}>|</span>
            <span>Cognitive AI</span>
          </div>
        </div>

        <div className={styles.navRight}>
          {/* Adaptive Systems Pill */}
          <div className={styles.adaptivePill}>
            <span className={styles.rightLabel}>Adaptive Systems</span>
            <button className={styles.blackCircleButton} aria-label="Toggle Systems">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="1" fill="currentColor" />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
                <circle cx="6" cy="18" r="1" fill="currentColor" />
                <circle cx="18" cy="18" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      <div style={{ flex: 1 }} />

      {/* Footer Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: expoOut }}
        className={styles.footerGradient}
      >
        <div className={styles.footerLeft}>
          
          {/* Subtitle */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: expoOut }}
            className={styles.subtitleLine}
          >
            <span className={styles.blackDot} />
            <span className={styles.subtitleText}>Best digital banking card 2026</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: expoOut }}
            className={styles.heading}
          >
            One Card, Zero <br />
            Limits. Worldwide.
          </motion.h1>

          {/* Buttons */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease: expoOut }}
            className={styles.buttonGroup}
          >
            <button className={styles.ctaButtonPrimary}>See Features</button>
            <button className={styles.ctaButtonSecondary}>How It Works</button>
          </motion.div>
        </div>

        {/* Right Tags */}
        <div className={styles.footerRight}>
          {["Neuromorphic", "AGI", "Cybernetics"].map((tag) => (
            <span key={tag} className={styles.tagPill}>
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
