"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/supabase/storage";
import { supabaseClient } from "@/lib/supabase/client";
import type {
  Project,
  CaseStudyChallenge,
  CaseStudyPerformanceImprovement,
  CaseStudyResult,
  CaseStudyTimelineMilestone,
  CaseStudyFAQ,
  CaseStudyBeforeAfter,
  CaseStudyAsset,
} from "@/types/project";
import { Heading } from "@/components/typography/Heading";
import { Trash2, Save } from "lucide-react";

interface CaseStudyFormProps {
  initialProject: Project;
}

export function CaseStudyForm({ initialProject }: CaseStudyFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Extended Case Study states
  const [clientWebsite, setClientWebsite] = useState(initialProject.clientWebsite || "");
  const [businessProblem, setBusinessProblem] = useState(initialProject.businessProblem || "");
  const [projectGoal, setProjectGoal] = useState(initialProject.projectGoal || "");
  const [research, setResearch] = useState(initialProject.research || "");
  const [strategy, setStrategy] = useState(initialProject.strategy || "");
  const [designProcess, setDesignProcess] = useState(initialProject.designProcess || "");
  const [developmentProcess, setDevelopmentProcess] = useState(initialProject.developmentProcess || "");

  // Challenges & Solutions list
  const [challenges, setChallenges] = useState<CaseStudyChallenge[]>(initialProject.technicalChallenges || []);
  const [newChallengeTitle, setNewChallengeTitle] = useState("");
  const [newChallengeProb, setNewChallengeProb] = useState("");
  const [newChallengeSol, setNewChallengeSol] = useState("");
  const [newChallengeOutcome, setNewChallengeOutcome] = useState("");

  // Metrics KPI list
  const [metrics, setMetrics] = useState<CaseStudyResult[]>(initialProject.metrics || []);
  const [newMetricVal, setNewMetricVal] = useState("");
  const [newMetricUnit, setNewMetricUnit] = useState("");
  const [newMetricLabel, setNewMetricLabel] = useState("");
  const [newMetricIcon, setNewMetricIcon] = useState("Activity");
  const [newMetricImprovement, setNewMetricImprovement] = useState("");

  // Timeline Milestones list
  const [timeline, setTimeline] = useState<CaseStudyTimelineMilestone[]>(initialProject.timeline || []);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");

  // FAQs list
  const [faq, setFaq] = useState<CaseStudyFAQ[]>(initialProject.faq || []);
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  // Before & After list
  const [beforeAfter, setBeforeAfter] = useState<CaseStudyBeforeAfter[]>(initialProject.beforeAfter || []);
  const [newBaTitle, setNewBaTitle] = useState("");
  const [newBaDesc, setNewBaDesc] = useState("");
  const [newBaBeforeImg, setNewBaBeforeImg] = useState("");
  const [newBaAfterImg, setNewBaAfterImg] = useState("");
  const [newBaImpact, setNewBaImpact] = useState("");

  // Performance improvements comparison
  const [perfImps, setPerfImps] = useState<CaseStudyPerformanceImprovement[]>(initialProject.performanceImprovements || []);
  const [newPerfLabel, setNewPerfLabel] = useState("");
  const [newPerfBefore, setNewPerfBefore] = useState("");
  const [newPerfAfter, setNewPerfAfter] = useState("");

  // Testimonial details
  const [rating, setRating] = useState(initialProject.testimonialDetails?.rating || 5);
  const [avatar, setAvatar] = useState(initialProject.testimonialDetails?.avatar || "");
  const [logo, setLogo] = useState(initialProject.testimonialDetails?.logo || "");

  // Downloadable assets
  const [assets, setAssets] = useState<CaseStudyAsset[]>(initialProject.downloadableAssets || []);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetUrl, setNewAssetUrl] = useState("");
  const [newAssetType, setNewAssetType] = useState("PDF");

  const addChallenge = () => {
    if (newChallengeTitle.trim() && newChallengeProb.trim() && newChallengeSol.trim()) {
      setChallenges([
        ...challenges,
        {
          title: newChallengeTitle.trim(),
          problem: newChallengeProb.trim(),
          solution: newChallengeSol.trim(),
          outcome: newChallengeOutcome.trim(),
        },
      ]);
      setNewChallengeTitle("");
      setNewChallengeProb("");
      setNewChallengeSol("");
      setNewChallengeOutcome("");
    }
  };

  const addMetric = () => {
    if (newMetricVal.trim() && newMetricLabel.trim()) {
      setMetrics([
        ...metrics,
        {
          value: newMetricVal.trim(),
          unit: newMetricUnit.trim() || undefined,
          label: newMetricLabel.trim(),
          icon: newMetricIcon.trim() || undefined,
          improvement: newMetricImprovement.trim() || undefined,
        },
      ]);
      setNewMetricVal("");
      setNewMetricUnit("");
      setNewMetricLabel("");
      setNewMetricImprovement("");
      setNewMetricIcon("Activity");
    }
  };

  const addMilestone = () => {
    if (newMilestoneTitle.trim() && newMilestoneDesc.trim()) {
      const step = timeline.length + 1;
      setTimeline([
        ...timeline,
        {
          step,
          title: newMilestoneTitle.trim(),
          description: newMilestoneDesc.trim(),
          date: newMilestoneDate.trim() || undefined,
        },
      ]);
      setNewMilestoneTitle("");
      setNewMilestoneDesc("");
      setNewMilestoneDate("");
    }
  };

  const addFaq = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      setFaq([...faq, { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() }]);
      setNewFaqQuestion("");
      setNewFaqAnswer("");
    }
  };

  const addBeforeAfter = () => {
    if (newBaTitle.trim() && newBaBeforeImg.trim() && newBaAfterImg.trim()) {
      setBeforeAfter([
        ...beforeAfter,
        {
          title: newBaTitle.trim(),
          description: newBaDesc.trim(),
          beforeImage: newBaBeforeImg.trim(),
          afterImage: newBaAfterImg.trim(),
          impact: newBaImpact.trim() || undefined,
        },
      ]);
      setNewBaTitle("");
      setNewBaDesc("");
      setNewBaBeforeImg("");
      setNewBaAfterImg("");
      setNewBaImpact("");
    }
  };

  const addPerf = () => {
    if (newPerfLabel.trim()) {
      setPerfImps([
        ...perfImps,
        {
          label: newPerfLabel.trim(),
          before: newPerfBefore.trim(),
          after: newPerfAfter.trim(),
        },
      ]);
      setNewPerfLabel("");
      setNewPerfBefore("");
      setNewPerfAfter("");
    }
  };

  const addAsset = () => {
    if (newAssetName.trim() && newAssetUrl.trim()) {
      setAssets([
        ...assets,
        {
          name: newAssetName.trim(),
          url: newAssetUrl.trim(),
          type: newAssetType,
        },
      ]);
      setNewAssetName("");
      setNewAssetUrl("");
      setNewAssetType("PDF");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await uploadImage(supabaseClient as any, file, "uploads");
      if (res.ok && res.publicUrl) {
        if (target === "avatar") setAvatar(res.publicUrl);
        else if (target === "logo") setLogo(res.publicUrl);
        else if (target === "before") setNewBaBeforeImg(res.publicUrl);
        else if (target === "after") setNewBaAfterImg(res.publicUrl);
      }
    } catch (err) {
      console.error("Storage upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const updates = {
      clientWebsite,
      businessProblem,
      projectGoal,
      research,
      strategy,
      designProcess,
      developmentProcess,
      technicalChallenges: challenges,
      performanceImprovements: perfImps,
      results: metrics,
      metrics,
      timeline,
      faq,
      beforeAfter,
      downloadableAssets: assets,
      testimonialDetails: {
        rating,
        avatar: avatar || undefined,
        logo: logo || undefined,
      },
    };

    try {
      const res = await fetch(`/api/admin/projects/${initialProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update case study");
      }

      setSuccess("Case study expanded fields saved successfully!");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-10 max-w-[1100px] mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/10 pb-6">
        <div>
          <Heading level={1} className="text-3xl font-black tracking-tightest">
            Case Study: {initialProject.title}
          </Heading>
          <p className="text-xs font-mono uppercase tracking-widest text-muted mt-1.5">
            Expand showcase project into structured money landing page
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/case-studies")}
            className="border border-border/20 hover:border-foreground hover:bg-surface/30 px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-foreground text-background hover:bg-neutral-200 px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 disabled:opacity-50 font-bold shadow-lg"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save Case Study"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left column details */}
        <div className="md:col-span-8 flex flex-col gap-8">
          {/* Section 1: Client details */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 1. Client Site details ]
            </h3>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Client Website URL</label>
              <input
                type="text"
                placeholder="https://example.com"
                value={clientWebsite}
                onChange={(e) => setClientWebsite(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary font-mono"
              />
            </div>
          </div>

          {/* Section 2: Narrative text blocks */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 2. Detailed Case Study Scope ]
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Business Challenge</label>
              <textarea
                placeholder="Detail the client's commercial challenges and pain points"
                rows={4}
                value={businessProblem}
                onChange={(e) => setBusinessProblem(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Project Goal</label>
              <textarea
                placeholder="Detail core target objectives"
                rows={3}
                value={projectGoal}
                onChange={(e) => setProjectGoal(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Research & Planning</label>
              <textarea
                placeholder="Explain UX audits, user meetings, competitor research"
                rows={4}
                value={research}
                onChange={(e) => setResearch(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Strategy & IA</label>
              <textarea
                placeholder="Explain information architecture, flow maps, SEO indexing strategies"
                rows={4}
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Design Process</label>
              <textarea
                placeholder="Explain UI wireframes, style guides, accessibility testing"
                rows={4}
                value={designProcess}
                onChange={(e) => setDesignProcess(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Development Process</label>
              <textarea
                placeholder="Explain NextJS setup, database layout, deploy config pipelines"
                rows={4}
                value={developmentProcess}
                onChange={(e) => setDevelopmentProcess(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>

          {/* Section 3: Before & After slider setups */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 3. Before & After Comparisons ]
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Comparison Title</label>
                <input
                  type="text"
                  placeholder="UI Redesign layout"
                  value={newBaTitle}
                  onChange={(e) => setNewBaTitle(e.target.value)}
                  className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Description</label>
                <input
                  type="text"
                  placeholder="Legacy layout vs. new bento visual grids"
                  value={newBaDesc}
                  onChange={(e) => setNewBaDesc(e.target.value)}
                  className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Before Image URL</label>
                <input
                  type="text"
                  value={newBaBeforeImg}
                  onChange={(e) => setNewBaBeforeImg(e.target.value)}
                  className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
                <input type="file" onChange={(e) => handleFileUpload(e, "before")} className="text-[10px]" disabled={uploading} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">After Image URL</label>
                <input
                  type="text"
                  value={newBaAfterImg}
                  onChange={(e) => setNewBaAfterImg(e.target.value)}
                  className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
                <input type="file" onChange={(e) => handleFileUpload(e, "after")} className="text-[10px]" disabled={uploading} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Business Impact</label>
              <input
                type="text"
                placeholder="40% bounce rate decrease"
                value={newBaImpact}
                onChange={(e) => setNewBaImpact(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="button"
              onClick={addBeforeAfter}
              className="bg-surface border border-border/20 py-2 rounded-lg text-xs font-mono uppercase font-bold text-neutral-300"
            >
              Add Comparison Card
            </button>

            <ul className="flex flex-col gap-2">
              {beforeAfter.map((ba, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs bg-surface/20 p-2.5 rounded-lg border border-border/10">
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-200">{ba.title}</span>
                    <span className="text-muted text-[11px] mt-0.5">{ba.description}</span>
                  </div>
                  <button type="button" onClick={() => setBeforeAfter(beforeAfter.filter((_, i) => i !== idx))} className="text-muted hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Technical Challenges */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 4. Technical Challenges & Solutions ]
            </h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Challenge Title"
                value={newChallengeTitle}
                onChange={(e) => setNewChallengeTitle(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <textarea
                placeholder="Describe the Problem..."
                value={newChallengeProb}
                onChange={(e) => setNewChallengeProb(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground resize-none focus:outline-none focus:border-primary"
                rows={2}
              />
              <textarea
                placeholder="Describe the Solution..."
                value={newChallengeSol}
                onChange={(e) => setNewChallengeSol(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground resize-none focus:outline-none focus:border-primary"
                rows={2}
              />
              <input
                type="text"
                placeholder="Outcome"
                value={newChallengeOutcome}
                onChange={(e) => setNewChallengeOutcome(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={addChallenge}
                className="bg-surface border border-border/20 py-2 rounded-lg text-xs font-mono uppercase font-bold text-neutral-300"
              >
                Add Challenge
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {challenges.map((c, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs bg-surface/20 p-2.5 rounded-lg border border-border/10">
                  <span>{c.title}</span>
                  <button type="button" onClick={() => setChallenges(challenges.filter((_, i) => i !== idx))} className="text-muted hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: Timeline Milestones */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 5. Project Timeline ]
            </h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Milestone Title"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Milestone Date"
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <textarea
                placeholder="Description of the milestone phase..."
                value={newMilestoneDesc}
                onChange={(e) => setNewMilestoneDesc(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground resize-none focus:outline-none focus:border-primary"
                rows={2}
              />
              <button
                type="button"
                onClick={addMilestone}
                className="bg-surface border border-border/20 py-2 rounded-lg text-xs font-mono uppercase font-bold text-neutral-300"
              >
                Add Milestone
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {timeline.map((m, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs bg-surface/20 p-2.5 rounded-lg border border-border/10">
                  <span>{m.step}. {m.title} ({m.date || "No date"})</span>
                  <button type="button" onClick={() => setTimeline(timeline.filter((_, i) => i !== idx))} className="text-muted hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 6: FAQs */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 6. Case Study FAQs ]
            </h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Question"
                value={newFaqQuestion}
                onChange={(e) => setNewFaqQuestion(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <textarea
                placeholder="Answer..."
                value={newFaqAnswer}
                onChange={(e) => setNewFaqAnswer(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground resize-none focus:outline-none focus:border-primary"
                rows={2}
              />
              <button
                type="button"
                onClick={addFaq}
                className="bg-surface border border-border/20 py-2 rounded-lg text-xs font-mono uppercase font-bold text-neutral-300"
              >
                Add FAQ Item
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {faq.map((f, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs bg-surface/20 p-2.5 rounded-lg border border-border/10">
                  <span className="truncate max-w-[250px]">{f.question}</span>
                  <button type="button" onClick={() => setFaq(faq.filter((_, i) => i !== idx))} className="text-muted hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 7: Performance improvements */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-3">
              [ 7. Performance Comparisons ]
            </h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Metric Label (e.g. Lighthouse Speed)"
                value={newPerfLabel}
                onChange={(e) => setNewPerfLabel(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Before (e.g. 45)"
                value={newPerfBefore}
                onChange={(e) => setNewPerfBefore(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="After (e.g. 99)"
                value={newPerfAfter}
                onChange={(e) => setNewPerfAfter(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={addPerf}
                className="bg-surface border border-border/20 py-2 rounded-lg text-xs font-mono uppercase font-bold text-neutral-300"
              >
                Add Perf Metric
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {perfImps.map((p, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs bg-surface/20 p-2.5 rounded-lg border border-border/10">
                  <span>{p.label}: {p.before} → {p.after}</span>
                  <button type="button" onClick={() => setPerfImps(perfImps.filter((_, i) => i !== idx))} className="text-muted hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column sidebar widgets */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* KPI Metrics */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-2">KPI Dashboard Metrics</h4>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="99 (Value)"
                value={newMetricVal}
                onChange={(e) => setNewMetricVal(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none"
              />
              <input
                type="text"
                placeholder="% (Unit)"
                value={newMetricUnit}
                onChange={(e) => setNewMetricUnit(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none"
              />
              <input
                type="text"
                placeholder="Load speed optimization (Label)"
                value={newMetricLabel}
                onChange={(e) => setNewMetricLabel(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none"
              />
              <input
                type="text"
                placeholder="+25% (Improvement %)"
                value={newMetricImprovement}
                onChange={(e) => setNewMetricImprovement(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none"
              />
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Metric Icon</label>
                <select
                  value={newMetricIcon}
                  onChange={(e) => setNewMetricIcon(e.target.value)}
                  className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none font-mono"
                >
                  <option value="Activity">Activity</option>
                  <option value="TrendingUp">TrendingUp</option>
                  <option value="Clock">Clock</option>
                  <option value="Zap">Zap</option>
                </select>
              </div>
              <button
                type="button"
                onClick={addMetric}
                className="bg-surface border border-border/20 py-2 rounded-lg text-xs font-mono uppercase font-bold text-neutral-300"
              >
                Add KPI Metric
              </button>
            </div>

            <ul className="flex flex-col gap-2">
              {metrics.map((m, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs bg-surface/20 p-2 rounded-lg border border-border/10">
                  <span className="font-mono text-primary font-bold">{m.value}{m.unit} <span className="text-neutral-300 font-sans font-normal">{m.label}</span></span>
                  <button type="button" onClick={() => setMetrics(metrics.filter((_, i) => i !== idx))} className="text-muted hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial details */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-2">Client Testimonial Upgrade</h4>

            <div className="flex flex-col gap-2.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Client Rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Client Avatar URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none font-mono"
              />
              <input type="file" onChange={(e) => handleFileUpload(e, "avatar")} className="text-[10px]" disabled={uploading} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Company Logo URL</label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none font-mono"
              />
              <input type="file" onChange={(e) => handleFileUpload(e, "logo")} className="text-[10px]" disabled={uploading} />
            </div>
          </div>

          {/* Downloadable assets */}
          <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-5">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 border-b border-border/10 pb-2">Downloadable Assets</h4>

            <div className="flex flex-col gap-2.5">
              <input
                type="text"
                placeholder="Asset Title (e.g. Case Study PDF)"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none"
              />
              <input
                type="text"
                placeholder="Asset Link URL"
                value={newAssetUrl}
                onChange={(e) => setNewAssetUrl(e.target.value)}
                className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground font-mono focus:outline-none"
              />
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Asset Type</label>
                <select
                  value={newAssetType}
                  onChange={(e) => setNewAssetType(e.target.value)}
                  className="w-full bg-background border border-border/25 px-3 py-2 rounded-lg text-xs text-foreground focus:outline-none font-mono"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="Brief">Project Brief</option>
                  <option value="Guidelines">Brand Guidelines</option>
                  <option value="Documentation">Technical Docs</option>
                </select>
              </div>
              <button
                type="button"
                onClick={addAsset}
                className="bg-surface border border-border/20 py-2 rounded-lg text-xs font-mono uppercase font-bold text-neutral-300"
              >
                Add Asset
              </button>
            </div>

            <ul className="flex flex-col gap-1.5">
              {assets.map((a, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs bg-surface/20 p-2 rounded-lg border border-border/10">
                  <span className="truncate max-w-[150px] font-medium text-neutral-200">{a.name} ({a.type})</span>
                  <button type="button" onClick={() => setAssets(assets.filter((_, i) => i !== idx))} className="text-muted hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
export default CaseStudyForm;
