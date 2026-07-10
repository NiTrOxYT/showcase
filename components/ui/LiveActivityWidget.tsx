"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Globe, UserCheck, Phone } from "lucide-react";
import { supabaseClient } from "@/lib/supabase/client";

interface ConversionEvent {
  id: string;
  event_type: string;
  page_url: string;
  created_at: string;
  details?: {
    city?: string;
    country?: string;
    label?: string;
    [key: string]: unknown;
  };
}

export function LiveActivityWidget() {
  const [events, setEvents] = useState<ConversionEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<ConversionEvent | null>(null);
  const [visible, setVisible] = useState(false);

  // Fetch initial events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/analytics/events");
        const data = await res.json();
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
          setCurrentEvent(data.events[0]);
          // Delay display slightly on mount
          setTimeout(() => setVisible(true), 3000);
        }
      } catch (err) {
        console.error("[LiveActivityWidget] Failed to load initial events", err);
      }
    }
    loadEvents();
  }, []);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    const channel = supabaseClient
      .channel("conversion-events-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "conversion_events" },
        (payload) => {
          const newEvent = payload.new as ConversionEvent;
          setEvents((prev) => [newEvent, ...prev]);
          setCurrentEvent(newEvent);
          setVisible(true);
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  // Cycle through events if idle
  useEffect(() => {
    if (events.length <= 1) return;

    const interval = setInterval(() => {
      setVisible(false);
      // Wait for exit animation, then select random or next event
      setTimeout(() => {
        const nextIdx = Math.floor(Math.random() * events.length);
        setCurrentEvent(events[nextIdx]);
        setVisible(true);
      }, 1000);
    }, 28000); // cycle every 28 seconds

    return () => clearInterval(interval);
  }, [events]);

  // Auto-hide toast after 8 seconds of displaying a particular entry
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [visible, currentEvent]);

  if (!currentEvent) return null;

  const getEventText = (ev: ConversionEvent) => {
    const cityStr = ev.details?.city ? `from ${ev.details.city}` : "from Website";
    switch (ev.event_type) {
      case "Contact Form Submitted":
        return `Someone ${cityStr} submitted a contact enquiry`;
      case "Proposal Submitted":
        return `New RFP proposal requested ${cityStr}`;
      case "Booking Requested":
        return `Someone ${cityStr} scheduled a consultation call`;
      case "Download Triggered":
        return `Case study proposal document downloaded`;
      case "File Uploaded":
        return `Project scope wireframe files uploaded`;
      case "CTA Click":
        return `Visitor clicked direct consultation request`;
      default:
        return `Activity registered on page ${ev.page_url}`;
    }
  };

  const getIcon = (ev: ConversionEvent) => {
    if (ev.event_type.includes("Booking")) return <Phone className="w-4 h-4 text-primary" />;
    if (ev.event_type.includes("Proposal") || ev.event_type.includes("File")) return <Sparkles className="w-4 h-4 text-primary" />;
    return <UserCheck className="w-4 h-4 text-primary" />;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, x: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-6 z-40 max-w-sm w-[90%] md:w-auto p-4 border border-border/20 bg-background/90 backdrop-blur-md rounded-lg shadow-xl flex items-center gap-3.5 select-none"
        >
          <div className="p-2 border border-primary/20 bg-primary/5 rounded-full">
            {getIcon(currentEvent)}
          </div>

          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
            <span className="text-[11px] font-sans text-foreground/90 font-bold leading-snug truncate">
              {getEventText(currentEvent)}
            </span>
            <span className="text-[9px] font-mono text-muted/40 uppercase tracking-widest flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" /> Verified Activity
            </span>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="p-1 hover:bg-surface rounded text-muted/40 hover:text-foreground transition-all shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
