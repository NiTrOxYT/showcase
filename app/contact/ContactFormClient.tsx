"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Globe,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Container } from "@/components/layout/Container";

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
}

interface Props {
  categories: ServiceItem[];
}

interface ContactFormData {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  company_size: "Solo" | "2-10" | "11-50" | "51-200" | "200+";
  project_type: "Business Website" | "SaaS" | "AI Automation" | "Mobile App" | "Internal Tool" | "UI/UX Design";
  budget: string;
  timeline: string;
  message: string;
  serviceIds: string[];
  lead_source: string;
}

export function ContactFormClient({ categories }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ContactFormData>(() => {
    const initial: ContactFormData = {
      full_name: "",
      email: "",
      phone: "",
      company: "",
      website: "",
      company_size: "Solo",
      project_type: "Business Website",
      budget: "₹1,50,000 - ₹3,00,000",
      timeline: "1-3 Months",
      message: "",
      serviceIds: [],
      lead_source: "Website Contact Form"
    };
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("annex-contact-draft");
      if (draft) {
        try {
          return { ...initial, ...JSON.parse(draft) };
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
    return initial;
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [leadId, setLeadId] = useState("");

  // Save draft on edit
  useEffect(() => {
    localStorage.setItem("annex-contact-draft", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => {
      const active = prev.serviceIds.includes(serviceId);
      const updated = active
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId];
      return { ...prev, serviceIds: updated };
    });
  };

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.full_name || !formData.email) {
        setErrorMessage("Please fill out your name and email.");
        return;
      }
      setErrorMessage("");
      setStep(2);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit request.");
        return;
      }

      setLeadId(data.lead?.id || "");
      setStatus("success");
      localStorage.removeItem("annex-contact-draft");
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Please try again.");
    }
  };

  return (
    <Container className="py-12 md:py-20 max-w-[1440px] mx-auto select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side Header Text */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Contact Annex ]
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tightest leading-tight uppercase text-foreground">
            Let&apos;s Launch Your Project.
          </h1>
          <p className="text-sm text-muted/75 leading-relaxed max-w-md">
            Partner with ANNEX to design, engineer, and deploy high-performance custom digital platforms. Provide your specifications below to request a strategic proposal.
          </p>
          <div className="flex flex-col gap-3 font-mono text-xs text-muted/60 border-t border-border/10 pt-6">
            <span>✓ Complete design independence</span>
            <span>✓ Highly optimized Next.js/React engineering</span>
            <span>✓ Integrated CRM and lead pipelines</span>
          </div>
        </div>

        {/* Right Side Step Form Card */}
        <div className="lg:col-span-7 w-full">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 border border-border/25 bg-surface/10 rounded-xl flex flex-col items-center text-center gap-6"
              >
                <div className="p-3 border border-green-500/20 rounded-full bg-green-500/5 text-green-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-display font-black tracking-tightest uppercase text-foreground">
                  Submission Logged!
                </h2>
                <p className="text-xs text-muted/70 max-w-sm">
                  Your inquiry is recorded inside our conversion queue. One of our engineers will manually reach out with follow-up options.
                </p>
                {leadId && (
                  <span className="text-[10px] font-mono text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                    Lead ID: {leadId}
                  </span>
                )}
                <Link
                  href="/"
                  className="flex items-center gap-2 py-3 px-6 rounded bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold hover:bg-primary/95 transition-all mt-4"
                >
                  <ArrowLeft className="w-4 h-4" /> Return Home
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: step === 1 ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step === 1 ? 15 : -15 }}
                transition={{ duration: 0.25 }}
                className="p-6 md:p-8 border border-border/10 bg-surface/5 rounded-xl"
              >
                {/* Form Progress Header */}
                <div className="flex items-center justify-between border-b border-border/15 pb-4 mb-6">
                  <div>
                    <h2 className="text-lg font-display font-bold text-foreground">
                      {step === 1 ? "1. Partner Information" : "2. Project Specifications"}
                    </h2>
                    <p className="text-xs text-muted/50 font-sans mt-0.5">
                      {step === 1 ? "Tell us about your team and brand" : "Budget, timeline, and scope parameters"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className={step === 1 ? "text-primary font-bold" : "text-muted"}>01</span>
                    <span className="text-muted/30">/</span>
                    <span className={step === 2 ? "text-primary font-bold" : "text-muted"}>02</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-4 border border-red-500/25 bg-red-500/5 text-red-300 text-xs rounded-lg mb-5">
                    {errorMessage}
                  </div>
                )}

                {step === 1 ? (
                  /* STEP 1 FORM */
                  <form onSubmit={handleStepSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Full Name *</label>
                        <div className="relative flex items-center">
                          <User className="w-4 h-4 absolute left-3 text-muted/40" />
                          <input
                            type="text"
                            name="full_name"
                            required
                            value={formData.full_name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Business Email *</label>
                        <div className="relative flex items-center">
                          <Globe className="w-4 h-4 absolute left-3 text-muted/40" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@company.com"
                            className="w-full pl-10 pr-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Phone Number</label>
                        <div className="relative flex items-center">
                          <Phone className="w-4 h-4 absolute left-3 text-muted/40" />
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full pl-10 pr-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Company Name</label>
                        <div className="relative flex items-center">
                          <Briefcase className="w-4 h-4 absolute left-3 text-muted/40" />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="ANNEX Corp"
                            className="w-full pl-10 pr-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Website Link</label>
                        <div className="relative flex items-center">
                          <Globe className="w-4 h-4 absolute left-3 text-muted/40" />
                          <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://yourbrand.com"
                            className="w-full pl-10 pr-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Company Size</label>
                        <select
                          name="company_size"
                          value={formData.company_size}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 appearance-none"
                        >
                          <option value="Solo">Solo / Bootstrap</option>
                          <option value="2-10">2-10 Employees</option>
                          <option value="11-50">11-50 Employees</option>
                          <option value="51-200">51-200 Employees</option>
                          <option value="200+">200+ Employees</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold hover:bg-primary/95 transition-all shadow-lg"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* STEP 2 FORM */
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Project Category</label>
                        <select
                          name="project_type"
                          value={formData.project_type}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 appearance-none"
                        >
                          <option value="Business Website">Business Website</option>
                          <option value="SaaS">SaaS Platform</option>
                          <option value="AI Automation">AI & Workflow Automation</option>
                          <option value="Mobile App">Mobile App Development</option>
                          <option value="Internal Tool">Custom Internal Tools</option>
                          <option value="UI/UX Design">UI/UX Redesign</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Budget Range</label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 appearance-none"
                        >
                          <option value="Under ₹1,50,000">Under ₹1,50,000</option>
                          <option value="₹1,50,000 - ₹3,00,000">₹1,50,000 - ₹3,00,000</option>
                          <option value="₹3,00,000 - ₹6,00,000">₹3,00,000 - ₹6,00,000</option>
                          <option value="₹6,00,000 - ₹12,00,000">₹6,00,000 - ₹12,00,000</option>
                          <option value="₹12,00,000+">₹12,00,000+</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Target Timeline</label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 appearance-none"
                      >
                        <option value="Immediate (< 1 Month)">Immediate (&lt; 1 Month)</option>
                        <option value="1-3 Months">1-3 Months</option>
                        <option value="3-6 Months">3-6 Months</option>
                        <option value="Flexible / Long-Term">Flexible / Long-Term</option>
                      </select>
                    </div>

                    {/* Services checkboxes */}
                    {categories && categories.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Link Services Interest</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {categories.map((service: ServiceItem) => (
                            <div
                              key={service.id}
                              onClick={() => handleServiceToggle(service.id)}
                              className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between text-xs transition-all ${
                                formData.serviceIds.includes(service.id)
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-border/15 bg-surface/10 hover:border-border/30 text-muted"
                              }`}
                            >
                              <span>{service.title}</span>
                              <div className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${formData.serviceIds.includes(service.id) ? "bg-primary border-primary" : "border-border/30"}`}>
                                {formData.serviceIds.includes(service.id) && <span className="text-background text-[10px] font-bold">✓</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Message details / Scope summary</label>
                      <div className="relative flex">
                        <MessageSquare className="w-4 h-4 absolute left-3 top-3.5 text-muted/40" />
                        <textarea
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Provide any specific scope items or questions..."
                          className="w-full pl-10 pr-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 border-t border-border/10 pt-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 py-3.5 px-6 rounded border border-border/20 text-muted font-mono text-xs uppercase tracking-widest font-bold hover:text-foreground hover:bg-surface/30 transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded bg-primary text-background font-mono text-xs uppercase tracking-widest font-bold hover:bg-primary/95 transition-all shadow-lg disabled:opacity-50"
                      >
                        {status === "loading" ? "Submitting..." : "Send Request"}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </Container>
  );
}
