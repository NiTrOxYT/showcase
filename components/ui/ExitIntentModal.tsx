"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, PhoneCall } from "lucide-react";

export function ExitIntentModal() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has already dismissed it this session
    const dismissed = sessionStorage.getItem("annex-exit-dismissed");
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if cursor leaves viewport at the top
      if (e.clientY < 5) {
        setShow(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("annex-exit-dismissed", "true");
  };

  const handleCTA = () => {
    handleDismiss();
    router.push("/book-call");
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md p-6 border border-border/20 bg-surface/90 rounded-xl shadow-2xl flex flex-col gap-6"
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface/50 text-muted hover:text-foreground transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-widest font-bold">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Special Consultation Proposal</span>
              </div>
              <h3 className="text-2xl font-display font-black tracking-tightest uppercase text-foreground leading-tight mt-1">
                Before You Go...
              </h3>
              <p className="text-xs text-muted/70 leading-relaxed font-sans mt-2">
                Have specific design queries or technical requirements? Claim a completely free 1-on-1 strategy call with our engineering team to map your ideas.
              </p>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCTA}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold hover:bg-primary/95 transition-all rounded shadow-lg"
              >
                <PhoneCall className="w-4 h-4" /> Book Free Strategy Call
              </button>
              <button
                onClick={handleDismiss}
                className="w-full py-2.5 border border-border/20 text-muted hover:text-foreground font-mono text-xs uppercase tracking-widest font-bold transition-all rounded"
              >
                No Thanks, Just browsing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
