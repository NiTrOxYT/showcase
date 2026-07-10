"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ArrowLeft,
  FileText,
  Upload,
  X,
  AlertCircle
} from "lucide-react";
import { Container } from "@/components/layout/Container";

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
}

interface Props {
  services: ServiceItem[];
}

interface ProposalsFormData {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  company_size: "Solo" | "2-10" | "11-50" | "51-200" | "200+";
  project_type: "Business Website" | "SaaS" | "AI Automation" | "Mobile App" | "Internal Tool" | "UI/UX Design";
  project_summary: string;
  preferred_budget: string;
  expected_start_date: string;
  project_scope_summary: string;
  estimated_duration: string;
  project_priority: "Low" | "Medium" | "High" | "Urgent";
  serviceIds: string[];
}

export function ProposalsFormClient({ services }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProposalsFormData>(() => {
    const initial: ProposalsFormData = {
      full_name: "",
      email: "",
      phone: "",
      company: "",
      website: "",
      company_size: "Solo",
      project_type: "Business Website",
      project_summary: "",
      preferred_budget: "₹3,00,000 - ₹6,00,000",
      expected_start_date: "",
      project_scope_summary: "",
      estimated_duration: "1-3 Months",
      project_priority: "Medium",
      serviceIds: [],
    };
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("annex-proposals-draft");
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

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [proposalId, setProposalId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save draft on edit (excluding File objects which can't be serialized to string easily)
  useEffect(() => {
    localStorage.setItem("annex-proposals-draft", JSON.stringify(formData));
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      // Validate sizes & formats
      const valid = selected.filter((file) => {
        if (file.size > 15 * 1024 * 1024) {
          setErrorMessage(`File ${file.name} is too large. Max 15MB.`);
          return false;
        }
        return true;
      });
      setFiles((prev) => [...prev, ...valid]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
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
    if (!formData.project_summary) {
      setErrorMessage("Please write a short project summary.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const payload = new FormData();
      // Append Lead data
      payload.append("full_name", formData.full_name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("company", formData.company);
      payload.append("website", formData.website);
      payload.append("company_size", formData.company_size);
      payload.append("project_type", formData.project_type);
      payload.append("lead_source", "RFP Submissions");
      payload.append("serviceIds", formData.serviceIds.join(","));

      // Append RFP Proposal details
      payload.append("project_summary", formData.project_summary);
      payload.append("preferred_budget", formData.preferred_budget);
      payload.append("expected_start_date", formData.expected_start_date);
      payload.append("project_scope_summary", formData.project_scope_summary);
      payload.append("estimated_duration", formData.estimated_duration);
      payload.append("project_priority", formData.project_priority);

      // Append uploaded Files
      files.forEach((file) => {
        payload.append("files", file);
      });

      const res = await fetch("/api/proposals", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to log proposal request.");
        return;
      }

      setProposalId(data.proposalId || "");
      setStatus("success");
      setFiles([]);
      localStorage.removeItem("annex-proposals-draft");
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred during document upload.");
    }
  };

  return (
    <Container className="py-12 md:py-20 max-w-[1440px] mx-auto select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side Copy */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ RFP Submissions ]
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tightest leading-tight uppercase text-foreground">
            Request an Estimate.
          </h1>
          <p className="text-sm text-muted/75 leading-relaxed max-w-md">
            Submit your Project Request for Proposal (RFP). Attach project briefs, design guidelines, or requirements lists to receive an engineered project estimate.
          </p>
          <div className="flex flex-col gap-3 font-mono text-xs text-muted/60 border-t border-border/10 pt-6">
            <span>✓ Complete file attachment index</span>
            <span>✓ Clear priority assignment</span>
            <span>✓ Fast-track options for urgent builds</span>
          </div>
        </div>

        {/* Right Side Form */}
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
                  RFP Logged successfully!
                </h2>
                <p className="text-xs text-muted/70 max-w-sm">
                  Your specifications and file attachments have been cataloged. Our engineering desk will contact you regarding timeline and scope options.
                </p>
                {proposalId && (
                  <span className="text-[10px] font-mono text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                    RFP ID: {proposalId}
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
                      {step === 1 ? "1. Contact & Org Details" : "2. Scope & Attachments"}
                    </h2>
                    <p className="text-xs text-muted/50 font-sans mt-0.5">
                      {step === 1 ? "Provide reference details" : "Attach assets & set specifications"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className={step === 1 ? "text-primary font-bold" : "text-muted"}>01</span>
                    <span className="text-muted/30">/</span>
                    <span className={step === 2 ? "text-primary font-bold" : "text-muted"}>02</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-4 border border-red-500/25 bg-red-500/5 text-red-300 text-xs rounded-lg mb-5 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {step === 1 ? (
                  /* STEP 1: CONTACT DETAILS */
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
                  /* STEP 2: SCOPE DETAILS & FILE ATTACHMENTS */
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Budget range</label>
                        <select
                          name="preferred_budget"
                          value={formData.preferred_budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 appearance-none"
                        >
                          <option value="Under ₹3,00,000">Under ₹3,00,000</option>
                          <option value="₹3,00,000 - ₹6,00,000">₹3,00,000 - ₹6,00,000</option>
                          <option value="₹6,00,000 - ₹12,00,000">₹6,00,000 - ₹12,00,000</option>
                          <option value="₹12,00,000 - ₹25,00,000">₹12,00,000 - ₹25,00,000</option>
                          <option value="₹25,00,000+">₹25,00,000+</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Expected Start Date</label>
                        <input
                          type="date"
                          name="expected_start_date"
                          value={formData.expected_start_date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Estimated Duration</label>
                        <select
                          name="estimated_duration"
                          value={formData.estimated_duration}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 appearance-none"
                        >
                          <option value="1-3 Months">1-3 Months</option>
                          <option value="3-6 Months">3-6 Months</option>
                          <option value="6-12 Months">6-12 Months</option>
                          <option value="Continuous Partnership">Continuous Partnership</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Project Priority</label>
                        <select
                          name="project_priority"
                          value={formData.project_priority}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 appearance-none"
                        >
                          <option value="Low">Low (Strategic review)</option>
                          <option value="Medium">Medium (Regular schedule)</option>
                          <option value="High">High (Target Q1/Q2)</option>
                          <option value="Urgent">Urgent (Immediate launch requirement)</option>
                        </select>
                      </div>
                    </div>

                    {/* Services checkboxes */}
                    {services && services.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Scope Category Areas</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {services.map((service: ServiceItem) => (
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
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Project Summary (Scope Overview) *</label>
                      <div className="relative flex">
                        <MessageSquare className="w-4 h-4 absolute left-3 top-3.5 text-muted/40" />
                        <textarea
                          name="project_summary"
                          required
                          value={formData.project_summary}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Provide a brief summary of the primary target outputs..."
                          className="w-full pl-10 pr-4 py-3 bg-surface/30 border border-border/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                        />
                      </div>
                    </div>

                    {/* File uploads section */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted/80">Document Attachments (Max 15MB each)</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border border-dashed border-border/30 rounded-lg p-6 bg-surface/5 hover:bg-surface/10 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2"
                      >
                        <Upload className="w-6 h-6 text-muted/50" />
                        <span className="text-xs text-foreground font-sans">Click to select files</span>
                        <span className="text-[10px] text-muted/40 font-mono">PDF, PNG, JPG, DOCX, ZIP</span>
                        <input
                          type="file"
                          multiple
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>

                      {/* Display files list */}
                      {files.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                          {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 bg-surface/10 border border-border/10 rounded text-xs">
                              <div className="flex items-center gap-2 text-muted">
                                <FileText className="w-4 h-4 shrink-0 text-primary" />
                                <span className="truncate max-w-[200px]">{file.name}</span>
                                <span className="text-[10px] text-muted/40 font-mono">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="p-1 hover:bg-surface text-muted hover:text-red-400 rounded"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
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
                        {status === "loading" ? "Uploading & Submitting..." : "Submit Proposal Request"}
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
