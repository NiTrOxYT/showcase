"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Check
} from "lucide-react";
import { Container } from "@/components/layout/Container";

const TIMES = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
  "08:00 PM"
];

const TRUST_CARDS = [
  { text: "Free Consultation", desc: "100% complimentary first session." },
  { text: "No Commitment", desc: "No obligation or contracts required." },
  { text: "Tailored Strategy", desc: "Customized technical roadmaps." },
  { text: "Expert Guidance", desc: "Consult directly with senior architects." }
];

const PROCESS_POINTS = [
  "Understand your business goals",
  "Identify opportunities for growth",
  "Discuss technology recommendations",
  "Answer every technical question",
  "Estimate timeline & budget",
  "Personalized roadmap"
];

interface BookingDetails {
  reference_id: string;
  name: string;
  consultation_type: string;
  preferred_date: string;
  preferred_time: string;
}

export function BookCallForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    consultation_type: "Visit Us",
    address: "",
    preferred_date: "",
    preferred_time: "10:00 AM",
    notes: ""
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    // Client-side date check
    const selectedDate = new Date(formData.preferred_date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setStatus("error");
      setErrorMessage("Preferred date cannot be in the past.");
      return;
    }

    if (formData.consultation_type === "We Visit You" && !formData.address.trim()) {
      setStatus("error");
      setErrorMessage("Address is required when choosing location visits.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit booking. Please try again.");
        return;
      }

      setBookingDetails(data.booking || null);
      if (data.duplicateDetected) {
        setStatus("duplicate");
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected network error occurred.");
    }
  };

  return (
    <Container className="py-12 md:py-20 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Side: Copy and trust metrics */}
        <div className="lg:col-span-6 flex flex-col gap-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
              [ Free Consultation ]
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tightest mt-3 leading-none uppercase">
              Let&apos;s Build Something Extraordinary.
            </h1>
            <p className="font-sans text-sm md:text-base text-muted/75 mt-6 leading-relaxed max-w-xl">
              Every successful digital product starts with a conversation. Book a completely free consultation and discover how ANNEX can help your business grow.
            </p>
          </div>

          {/* Premium trust checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRUST_CARDS.map((card, idx) => (
              <motion.div
                key={card.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="p-4 border border-border/20 rounded-lg bg-surface/10 flex flex-col gap-1"
              >
                <div className="flex items-center gap-2 text-primary font-sans text-sm font-bold">
                  <Check className="w-4 h-4" />
                  {card.text}
                </div>
                <span className="text-[11px] text-muted/50 font-sans leading-normal">
                  {card.desc}
                </span>
              </motion.div>
            ))}
          </div>

          <hr className="border-border/10 w-full" />

          {/* Process points list */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-foreground">
              What Happens During The Consultation?
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROCESS_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-xs text-muted/75 font-sans leading-relaxed">
                  <span className="text-primary mt-1">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-mono tracking-widest text-primary/70 uppercase">
            <span>✓ 100% Free</span>
            <span className="text-muted/20">|</span>
            <span>✓ No Hidden Charges</span>
            <span className="text-muted/20">|</span>
            <span>✓ No Obligation</span>
          </div>
        </div>

        {/* Right Side: Form Card or Success Panel */}
        <div className="lg:col-span-6 w-full">
          <AnimatePresence mode="wait">
            {status === "success" || status === "duplicate" ? (
              
              /* SUCCESS STATE SCREEN */
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 rounded-xl border border-border/25 bg-surface/10 backdrop-blur-md flex flex-col gap-6"
                role="alert"
                aria-live="polite"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-4 border border-green-500/20 rounded-full bg-green-500/5 text-green-400">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-black tracking-tightest uppercase text-foreground">
                    Your consultation has been booked.
                  </h2>
                  <p className="font-sans text-xs text-muted/70 max-w-sm">
                    {status === "duplicate" 
                      ? "You already have a pending consultation request. Our team will contact you shortly."
                      : "Our team will review your request and contact you shortly to confirm your appointment."}
                  </p>
                </div>

                {/* Summary Card */}
                {bookingDetails && (
                  <div className="p-5 border border-border/30 rounded-lg bg-background/50 flex flex-col gap-4">
                    <div className="text-[10px] font-mono tracking-wider text-primary uppercase border-b border-border/10 pb-2">
                      Appointment Summary
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <span className="block text-muted/50 mb-0.5">NAME</span>
                        <span className="font-bold text-foreground">{bookingDetails.name}</span>
                      </div>
                      <div>
                        <span className="block text-muted/50 mb-0.5">TYPE</span>
                        <span className="font-bold text-foreground">{bookingDetails.consultation_type}</span>
                      </div>
                      <div>
                        <span className="block text-muted/50 mb-0.5">DATE</span>
                        <span className="font-bold text-foreground">{bookingDetails.preferred_date}</span>
                      </div>
                      <div>
                        <span className="block text-muted/50 mb-0.5">TIME</span>
                        <span className="font-bold text-foreground">{bookingDetails.preferred_time}</span>
                      </div>
                      <div className="col-span-2 border-t border-border/10 pt-3">
                        <span className="block text-muted/50 mb-0.5">REFERENCE ID</span>
                        <span className="font-mono text-sm font-black text-primary">{bookingDetails.reference_id}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 text-center border-t border-border/10 pt-5">
                  <p className="font-sans text-[11px] text-muted/50">
                    Thank you for choosing ANNEX.
                  </p>
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold hover:bg-primary/95 transition-all duration-300 shadow-lg"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back Home
                  </Link>
                </div>
              </motion.div>

            ) : (

              /* FORM SCREEN */
              <motion.div
                key="booking-form"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 rounded-xl border border-border/20 bg-surface/10 backdrop-blur-md flex flex-col gap-6"
              >
                <div className="border-b border-border/10 pb-4">
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Request Consultation Slot
                  </h2>
                  <p className="text-xs text-muted/50 mt-1 font-sans">
                    Complete fields below to lock your strategy session.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-muted/80">
                      Name <span className="text-primary">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 absolute left-3 text-muted/40" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-background/50 border border-border/30 rounded px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted/30"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-mono uppercase tracking-wider text-muted/80">
                      Contact Number <span className="text-primary">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="w-4 h-4 absolute left-3 text-muted/40" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-background/50 border border-border/30 rounded px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted/30"
                      />
                    </div>
                  </div>

                  {/* Consultation Type Radio buttons */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-mono uppercase tracking-wider text-muted/80">
                      Consultation Type <span className="text-primary">*</span>
                    </span>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      <label className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-all duration-300 ${formData.consultation_type === "Visit Us" ? "border-primary bg-primary/5 text-foreground font-bold" : "border-border/30 bg-background/25 text-muted hover:border-border/60"}`}>
                        <input
                          type="radio"
                          name="consultation_type"
                          value="Visit Us"
                          checked={formData.consultation_type === "Visit Us"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.consultation_type === "Visit Us" ? "border-primary" : "border-muted/40"}`}>
                          {formData.consultation_type === "Visit Us" && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <span className="text-xs font-sans">Visit Us</span>
                      </label>

                      <label className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-all duration-300 ${formData.consultation_type === "We Visit You" ? "border-primary bg-primary/5 text-foreground font-bold" : "border-border/30 bg-background/25 text-muted hover:border-border/60"}`}>
                        <input
                          type="radio"
                          name="consultation_type"
                          value="We Visit You"
                          checked={formData.consultation_type === "We Visit You"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.consultation_type === "We Visit You" ? "border-primary" : "border-muted/40"}`}>
                          {formData.consultation_type === "We Visit You" && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <span className="text-xs font-sans">We Visit You</span>
                      </label>
                    </div>
                  </div>

                  {/* Animated address expand area */}
                  <AnimatePresence initial={false}>
                    {formData.consultation_type === "We Visit You" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden flex flex-col gap-1.5"
                      >
                        <label htmlFor="address" className="text-xs font-mono uppercase tracking-wider text-muted/80">
                          Office/Meeting Address <span className="text-primary">*</span>
                        </label>
                        <div className="relative flex items-start">
                          <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-muted/40" />
                          <textarea
                            id="address"
                            name="address"
                            required={formData.consultation_type === "We Visit You"}
                            placeholder="Enter the complete address for our team's visit..."
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full bg-background/50 border border-border/30 rounded px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted/30 resize-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Date and Time selectors in two-column */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="preferred_date" className="text-xs font-mono uppercase tracking-wider text-muted/80">
                        Preferred Date <span className="text-primary">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Calendar className="w-4 h-4 absolute left-3 text-muted/40 pointer-events-none" />
                        <input
                          id="preferred_date"
                          name="preferred_date"
                          type="date"
                          required
                          min={getTodayDateString()}
                          value={formData.preferred_date}
                          onChange={handleInputChange}
                          className="w-full bg-background/50 border border-border/30 rounded px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted/30 appearance-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="preferred_time" className="text-xs font-mono uppercase tracking-wider text-muted/80">
                        Preferred Time <span className="text-primary">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Clock className="w-4 h-4 absolute left-3 text-muted/40 pointer-events-none" />
                        <select
                          id="preferred_time"
                          name="preferred_time"
                          required
                          value={formData.preferred_time}
                          onChange={handleInputChange}
                          className="w-full bg-background/50 border border-border/30 rounded px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted/30 appearance-none cursor-pointer"
                        >
                          {TIMES.map((time) => (
                            <option key={time} value={time} className="bg-background text-foreground">
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notes field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="notes" className="text-xs font-mono uppercase tracking-wider text-muted/80">
                      Notes <span className="text-muted/30">(Optional)</span>
                    </label>
                    <div className="relative flex items-start">
                      <FileText className="w-4 h-4 absolute left-3 top-3.5 text-muted/40" />
                      <textarea
                        id="notes"
                        name="notes"
                        placeholder="Tell us about your project or specific items you'd like to cover during the call..."
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-background/50 border border-border/30 rounded px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted/30 resize-none"
                      />
                    </div>
                  </div>

                  {/* Error state indicator */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 p-3 border border-red-500/20 bg-red-500/5 text-red-400 rounded text-xs" role="alert" aria-live="assertive">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3 px-6 rounded bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold hover:bg-primary/95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-lg"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-background" /> Locking slot...
                      </>
                    ) : (
                      <>
                        Schedule Call <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>

                {/* Premium info box */}
                <div className="p-4 border border-border/10 rounded-lg bg-surface/5 flex gap-3.5 items-start mt-2">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-[11px] font-sans text-muted/65 leading-relaxed">
                    <span className="font-bold text-foreground block mb-1">Personalized Consultation</span>
                    If you select &quot;We Visit You&quot;, our team will personally visit your location for a one-to-one consultation. Available Hours: 10:00 AM – 8:00 PM. Appointments are confirmed after our team contacts you.
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </Container>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
