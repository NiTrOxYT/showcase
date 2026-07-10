"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/supabase/storage";
import { supabaseClient } from "@/lib/supabase/client";
import type { Service, ServiceFAQ, ServiceBenefit, ServiceProcessStep, ServiceTechnology } from "@/types/service";
import { Heading } from "@/components/typography/Heading";
import { Trash2, Save } from "lucide-react";

interface ServiceFormProps {
  initialService?: Service;
  isEdit?: boolean;
}

export function ServiceForm({ initialService, isEdit = false }: ServiceFormProps) {
  const router = useRouter();

  // Basic properties
  const [title, setTitle] = useState(initialService?.title || "");
  const [slug, setSlug] = useState(initialService?.slug || "");
  const [shortDescription, setShortDescription] = useState(initialService?.shortDescription || "");
  const [heroTitle, setHeroTitle] = useState(initialService?.heroTitle || "");
  const [heroDescription, setHeroDescription] = useState(initialService?.heroDescription || "");
  const [seoTitle, setSeoTitle] = useState(initialService?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialService?.seoDescription || "");
  const [keywords, setKeywords] = useState(initialService?.keywords?.join(", ") || "");
  const [coverImage, setCoverImage] = useState(initialService?.coverImage || "");
  const [overview, setOverview] = useState(initialService?.overview || "");
  const [ctaTitle, setCtaTitle] = useState(initialService?.ctaTitle || "");
  const [ctaDescription, setCtaDescription] = useState(initialService?.ctaDescription || "");
  const [featured, setFeatured] = useState(initialService?.featured || false);
  const [sortOrder, setSortOrder] = useState(initialService?.sortOrder || 0);
  const [status, setStatus] = useState<"Draft" | "Published">(initialService?.status || "Draft");

  // Problem Section
  const [problemTitle, setProblemTitle] = useState(initialService?.problem?.title || "");
  const [problemDesc, setProblemDesc] = useState(initialService?.problem?.description || "");
  const [problemPoints, setProblemPoints] = useState<string[]>(initialService?.problem?.points || []);
  const [newProblemPoint, setNewProblemPoint] = useState("");

  // Solution Section
  const [solutionTitle, setSolutionTitle] = useState(initialService?.solution?.title || "");
  const [solutionDesc, setSolutionDesc] = useState(initialService?.solution?.description || "");
  const [solutionPoints, setSolutionPoints] = useState<string[]>(initialService?.solution?.points || []);
  const [newSolutionPoint, setNewSolutionPoint] = useState("");

  // Process Steps
  const [process, setProcess] = useState<ServiceProcessStep[]>(initialService?.process || []);
  const [newProcessTitle, setNewProcessTitle] = useState("");
  const [newProcessDesc, setNewProcessDesc] = useState("");

  // Technologies
  const [technologies, setTechnologies] = useState<ServiceTechnology[]>(initialService?.technologies || []);
  const [newTechName, setNewTechName] = useState("");
  const [newTechCategory, setNewTechCategory] = useState("Framework");

  // Benefits
  const [benefits, setBenefits] = useState<ServiceBenefit[]>(initialService?.benefits || []);
  const [newBenefitTitle, setNewBenefitTitle] = useState("");
  const [newBenefitDesc, setNewBenefitDesc] = useState("");

  // Deliverables
  const [deliverables, setDeliverables] = useState<string[]>(initialService?.deliverables || []);
  const [newDeliverable, setNewDeliverable] = useState("");

  // FAQs
  const [faq, setFaq] = useState<ServiceFAQ[]>(initialService?.faq || []);
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File Upload Helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const file = e.target.files[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await uploadImage(supabaseClient as any, file, "uploads");
      if (res.ok && res.publicUrl) {
        setCoverImage(res.publicUrl);
      } else {
        setError(res.error || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload cover image.");
    } finally {
      setUploading(false);
    }
  };

  // Builders/Modifiers
  const addProblemPoint = () => {
    if (newProblemPoint.trim()) {
      setProblemPoints([...problemPoints, newProblemPoint.trim()]);
      setNewProblemPoint("");
    }
  };

  const addSolutionPoint = () => {
    if (newSolutionPoint.trim()) {
      setSolutionPoints([...solutionPoints, newSolutionPoint.trim()]);
      setNewSolutionPoint("");
    }
  };

  const addProcessStep = () => {
    if (newProcessTitle.trim() && newProcessDesc.trim()) {
      const nextStep = process.length + 1;
      setProcess([...process, { step: nextStep, title: newProcessTitle.trim(), description: newProcessDesc.trim() }]);
      setNewProcessTitle("");
      setNewProcessDesc("");
    }
  };

  const addTech = () => {
    if (newTechName.trim()) {
      setTechnologies([...technologies, { name: newTechName.trim(), category: newTechCategory }]);
      setNewTechName("");
    }
  };

  const addBenefit = () => {
    if (newBenefitTitle.trim() && newBenefitDesc.trim()) {
      setBenefits([...benefits, { title: newBenefitTitle.trim(), description: newBenefitDesc.trim() }]);
      setNewBenefitTitle("");
      setNewBenefitDesc("");
    }
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable("");
    }
  };

  const addFaq = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      setFaq([...faq, { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() }]);
      setNewFaqQuestion("");
      setNewFaqAnswer("");
    }
  };

  // Form Submit Action
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const serviceData = {
      title,
      slug,
      shortDescription,
      heroTitle: heroTitle || null,
      heroDescription: heroDescription || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
      coverImage: coverImage || null,
      gallery: initialService?.gallery || [],
      overview: overview || null,
      problem: {
        title: problemTitle,
        description: problemDesc,
        points: problemPoints,
      },
      solution: {
        title: solutionTitle,
        description: solutionDesc,
        points: solutionPoints,
      },
      process,
      technologies,
      benefits,
      deliverables,
      faq,
      ctaTitle: ctaTitle || null,
      ctaDescription: ctaDescription || null,
      featured,
      sortOrder,
      status,
    };

    try {
      const url = isEdit ? `/api/admin/services/${initialService?.id}` : "/api/admin/services";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save service");
      }

      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-10 max-w-[1000px] mx-auto select-none">
      {/* Page header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/10 pb-6">
        <div>
          <Heading level={1} className="text-3xl font-black tracking-tightest">
            {isEdit ? `Edit Service: ${initialService?.title}` : "New Service Landing Page"}
          </Heading>
          <p className="text-xs font-mono uppercase tracking-widest text-muted mt-1.5">
            CMS details and commercial metadata
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/services")}
            className="border border-border/20 hover:border-foreground hover:bg-surface/30 px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-foreground text-background hover:bg-neutral-200 px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 disabled:opacity-50 font-bold shadow-lg"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save Service"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Form: Content and Sections */}
        <div className="md:col-span-8 flex flex-col gap-8">
          {/* Section 1: Basic Info */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 1. Basic Details ]
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Service Title *</label>
              <input
                type="text"
                placeholder="e.g. Next.js Development"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Service URL Slug *</label>
              <input
                type="text"
                placeholder="e.g. nextjs-development"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all font-mono"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Short Description *</label>
              <textarea
                placeholder="Short commercial snippet used in grids and SEO card fallbacks"
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all resize-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Overview / Detailed Summary</label>
              <textarea
                placeholder="Introductory overview of the service scope"
                rows={5}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>
          </div>

          {/* Section 2: Hero Layout */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 2. Hero Presentation ]
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Hero Headline</label>
              <input
                type="text"
                placeholder="Let's build something exceptional."
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Hero Sub-description</label>
              <textarea
                placeholder="Supporting description rendered directly in the hero banner"
                rows={3}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>
          </div>

          {/* Section 3: Problem Statement */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 3. The Customer Problem ]
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Problem Heading</label>
              <input
                type="text"
                placeholder="Why most business web applications fail."
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Problem Description</label>
              <textarea
                placeholder="Briefly state the industry issues / pain points customers run into"
                rows={3}
                value={problemDesc}
                onChange={(e) => setProblemDesc(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Pain Points Checklist</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Slow load times reduce conversion by 40%"
                  value={newProblemPoint}
                  onChange={(e) => setNewProblemPoint(e.target.value)}
                  className="flex-1 bg-background border border-border/25 px-4 py-2 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={addProblemPoint}
                  className="bg-surface border border-border/20 hover:border-foreground hover:bg-surface/50 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all"
                >
                  Add
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                {problemPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 text-xs bg-surface/20 border border-border/10 p-2.5 rounded-lg">
                    <span className="text-foreground/80 font-medium">{pt}</span>
                    <button
                      type="button"
                      onClick={() => setProblemPoints(problemPoints.filter((_, i) => i !== idx))}
                      className="text-muted hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 4: Solution Statement */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 4. The ANNEX Solution ]
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Solution Heading</label>
              <input
                type="text"
                placeholder="High-performance Next.js architectures built for conversions."
                value={solutionTitle}
                onChange={(e) => setSolutionTitle(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Solution Description</label>
              <textarea
                placeholder="Explain our methodology and value proposition"
                rows={3}
                value={solutionDesc}
                onChange={(e) => setSolutionDesc(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Core Features</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Edge caching and incremental static generation"
                  value={newSolutionPoint}
                  onChange={(e) => setNewSolutionPoint(e.target.value)}
                  className="flex-1 bg-background border border-border/25 px-4 py-2 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={addSolutionPoint}
                  className="bg-surface border border-border/20 hover:border-foreground hover:bg-surface/50 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all"
                >
                  Add
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                {solutionPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 text-xs bg-surface/20 border border-border/10 p-2.5 rounded-lg">
                    <span className="text-foreground/80 font-medium">{pt}</span>
                    <button
                      type="button"
                      onClick={() => setSolutionPoints(solutionPoints.filter((_, i) => i !== idx))}
                      className="text-muted hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 5: Process Steps */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 5. Delivery Process ]
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Step Title</label>
                <input
                  type="text"
                  placeholder="e.g. Discovery Audit"
                  value={newProcessTitle}
                  onChange={(e) => setNewProcessTitle(e.target.value)}
                  className="w-full bg-background border border-border/25 px-4 py-2 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Step Description</label>
                <input
                  type="text"
                  placeholder="Audit code structures and core web vitals"
                  value={newProcessDesc}
                  onChange={(e) => setNewProcessDesc(e.target.value)}
                  className="w-full bg-background border border-border/25 px-4 py-2 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addProcessStep}
              className="bg-surface border border-border/20 hover:border-foreground hover:bg-surface/50 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all font-bold"
            >
              Add Process Step
            </button>

            <ul className="flex flex-col gap-2">
              {process.map((step, idx) => (
                <li key={idx} className="flex items-center justify-between gap-4 text-xs bg-surface/20 border border-border/10 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-primary">0{step.step}</span>
                    <div className="flex flex-col">
                      <span className="text-foreground/90 font-bold">{step.title}</span>
                      <span className="text-muted text-[11px] mt-0.5">{step.description}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProcess(process.filter((_, i) => i !== idx).map((s, idx2) => ({ ...s, step: idx2 + 1 })))}
                    className="text-muted hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 6: Benefits */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 6. Commercial Benefits ]
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Benefit Title</label>
                <input
                  type="text"
                  placeholder="e.g. Extreme Speed"
                  value={newBenefitTitle}
                  onChange={(e) => setNewBenefitTitle(e.target.value)}
                  className="w-full bg-background border border-border/25 px-4 py-2 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Benefit Description</label>
                <input
                  type="text"
                  placeholder="Achieve Lighthouse performance score of 100"
                  value={newBenefitDesc}
                  onChange={(e) => setNewBenefitDesc(e.target.value)}
                  className="w-full bg-background border border-border/25 px-4 py-2 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addBenefit}
              className="bg-surface border border-border/20 hover:border-foreground hover:bg-surface/50 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all font-bold"
            >
              Add Benefit
            </button>

            <ul className="flex flex-col gap-2">
              {benefits.map((bt, idx) => (
                <li key={idx} className="flex items-center justify-between gap-4 text-xs bg-surface/20 border border-border/10 p-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-foreground/90 font-bold">{bt.title}</span>
                    <span className="text-muted text-[11px] mt-0.5">{bt.description}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))}
                    className="text-muted hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 7: FAQs */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 7. FAQ Accordions ]
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Question</label>
                <input
                  type="text"
                  placeholder="e.g. How long does a service project take?"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  className="w-full bg-background border border-border/25 px-4 py-2 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Answer</label>
                <textarea
                  placeholder="Provide a clear, detailed response matching the FAQ query"
                  rows={3}
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  className="w-full bg-background border border-border/25 px-4 py-2 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="bg-surface border border-border/20 hover:border-foreground hover:bg-surface/50 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all font-bold"
            >
              Add FAQ
            </button>

            <ul className="flex flex-col gap-2">
              {faq.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between gap-4 text-xs bg-surface/20 border border-border/10 p-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-foreground/90 font-bold">Q: {item.question}</span>
                    <span className="text-muted text-[11px] mt-0.5">A: {item.answer}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFaq(faq.filter((_, i) => i !== idx))}
                    className="text-muted hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Form Sidebar: Media, SEO & Status configs */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Status Panel */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-2">Status & Rank</h4>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Publish State</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Draft" | "Published")}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary transition-all font-mono"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Featured landing</label>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 bg-background border border-border/25 rounded"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary transition-all font-mono"
              />
            </div>
          </div>

          {/* Media uploads */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-2">Cover Media</h4>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Upload Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3.5 file:rounded-md file:border file:border-border/20 file:bg-surface/50 file:text-foreground file:text-xs file:font-mono file:uppercase file:cursor-pointer hover:file:bg-surface"
                disabled={uploading}
              />
              {uploading && <span className="text-[10px] text-primary animate-pulse mt-1 font-mono">Uploading...</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Cover Image URL</label>
              <input
                type="text"
                placeholder="/images/cover.png"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary transition-all font-mono"
              />
            </div>
          </div>

          {/* Deliverables */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-2">Deliverables</h4>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="CMS deployment"
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                className="flex-1 bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={addDeliverable}
                className="bg-surface border border-border/20 px-3 py-2 rounded-lg text-xs font-mono uppercase"
              >
                Add
              </button>
            </div>

            <ul className="flex flex-col gap-1.5">
              {deliverables.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between bg-surface/20 p-2 rounded-lg text-xs">
                  <span className="text-foreground/80 truncate">{item}</span>
                  <button
                    type="button"
                    onClick={() => setDeliverables(deliverables.filter((_, i) => i !== idx))}
                    className="text-muted hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology Badges */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-2">Technologies</h4>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Next.js"
                value={newTechName}
                onChange={(e) => setNewTechName(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <select
                value={newTechCategory}
                onChange={(e) => setNewTechCategory(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
              >
                <option value="Framework">Framework</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Design">Design</option>
              </select>
              <button
                type="button"
                onClick={addTech}
                className="bg-surface border border-border/20 py-2 rounded-lg text-xs font-mono uppercase font-bold"
              >
                Add Badge
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {technologies.map((t, idx) => (
                <span
                  key={idx}
                  onClick={() => setTechnologies(technologies.filter((_, i) => i !== idx))}
                  className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>

          {/* SEO Details */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-2">SEO Tuning</h4>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">SEO Title</label>
              <input
                type="text"
                placeholder="Next.js Development Services"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">SEO Description</label>
              <textarea
                placeholder="Meta description for search snippets"
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Keywords (comma-separated)</label>
              <input
                type="text"
                placeholder="nextjs, software dev, web app"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>
          </div>

          {/* bottom CTA overrides */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-2">CTA Overrides</h4>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">CTA Title</label>
              <input
                type="text"
                placeholder="Let's Build Something Exceptional."
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">CTA Description</label>
              <textarea
                placeholder="Supporting CTA text details"
                rows={3}
                value={ctaDescription}
                onChange={(e) => setCtaDescription(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
export default ServiceForm;
