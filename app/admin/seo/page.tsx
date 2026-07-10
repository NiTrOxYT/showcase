"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Sparkles,
  Link2,
} from "lucide-react";
import { Heading } from "@/components/typography/Heading";

interface ImageIssue {
  src: string;
  missingAlt: boolean;
  missingDimensions: boolean;
}

interface PageReport {
  path: string;
  score: number;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  hasSchema: boolean;
  h1Count: number;
  h2Count: number;
  imageIssues: ImageIssue[];
  warnings: string[];
  recommendations: string[];
}

interface ScanSummary {
  totalPages: number;
  indexedPages: number;
  missingMetadata: number;
  missingOgImage: number;
  missingSchema: number;
  missingAlt: number;
  missingCanonical: number;
  brokenLinks: number;
  brokenImages: number;
  averageScore: number;
}

export default function SEODashboardPage() {
  const [summary, setSummary] = useState<ScanSummary | null>(null);
  const [pages, setPages] = useState<PageReport[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageReport | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScan = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/seo/scan");
      if (!res.ok) throw new Error("SEO scan query failed");
      const data = await res.json();
      setSummary(data.summary);
      setPages(data.pages);
      if (data.pages.length > 0) {
        setSelectedPage(data.pages[0]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to run SEO health scan. Ensure server is active.");
    } finally {
      setScanning(false);
    }
  }, []);

  useEffect(() => {
    fetchScan();
  }, [fetchScan]);

  const getScoreBadgeClass = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    if (score >= 70) return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  };

  return (
    <div className="flex flex-col gap-10 max-w-[1400px] mx-auto select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/10 pb-6">
        <div>
          <Heading level={1} className="text-3xl font-black tracking-tightest">
            SEO Quality Assurance
          </Heading>
          <p className="text-xs font-mono uppercase tracking-widest text-muted mt-1.5">
            Internal health dashboard · Redirect Manager
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/seo/redirects"
            className="flex items-center gap-2 border border-border/20 hover:border-foreground hover:bg-surface/30 px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200"
          >
            <Link2 className="w-3.5 h-3.5" />
            Redirect Manager
          </Link>
          <button
            onClick={fetchScan}
            disabled={scanning}
            className="flex items-center gap-2 bg-foreground text-background hover:bg-neutral-200 px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? "animate-spin" : ""}`} />
            Run SEO Scan
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards Grid */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-surface/20 border border-border/15 p-5 rounded-2xl flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted">SEO Health Index</span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl font-black tracking-tight">{summary.averageScore}</span>
              <span className="text-xs text-muted">/100</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${summary.averageScore >= 90 ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-300">
                {summary.averageScore >= 90 ? "Excellent" : "Needs Review"}
              </span>
            </div>
          </div>

          <div className="bg-surface/20 border border-border/15 p-5 rounded-2xl flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted">Scanned Pages</span>
            <div className="text-4xl font-black tracking-tight mt-2">{summary.totalPages}</div>
            <span className="text-[10px] font-mono text-muted uppercase mt-3">100% crawl coverage</span>
          </div>

          <div className="bg-surface/20 border border-border/15 p-5 rounded-2xl flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted">Missing Meta</span>
            <div className={`text-4xl font-black tracking-tight mt-2 ${summary.missingMetadata > 0 ? "text-amber-400 animate-pulse" : ""}`}>
              {summary.missingMetadata}
            </div>
            <span className="text-[10px] font-mono text-muted uppercase mt-3">Titles or Descriptions</span>
          </div>

          <div className="bg-surface/20 border border-border/15 p-5 rounded-2xl flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted">Missing Schema</span>
            <div className={`text-4xl font-black tracking-tight mt-2 ${summary.missingSchema > 0 ? "text-amber-400 animate-pulse" : ""}`}>
              {summary.missingSchema}
            </div>
            <span className="text-[10px] font-mono text-muted uppercase mt-3">JSON-LD Structured Data</span>
          </div>

          <div className="bg-surface/20 border border-border/15 p-5 rounded-2xl flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted">Alt Tag Audits</span>
            <div className={`text-4xl font-black tracking-tight mt-2 ${summary.missingAlt > 0 ? "text-amber-400 animate-pulse" : ""}`}>
              {summary.missingAlt}
            </div>
            <span className="text-[10px] font-mono text-muted uppercase mt-3">Pages missing alts</span>
          </div>
        </div>
      )}

      {/* Main Workspace Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Scanned Pages List */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="border border-border/15 bg-surface/5 rounded-2xl overflow-hidden">
            <div className="border-b border-border/10 p-5 flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-foreground">Scanned Crawl Map</h3>
              <span className="font-mono text-[10px] text-muted">{pages.length} Pages Audited</span>
            </div>

            <div className="divide-y divide-border/10 max-h-[600px] overflow-y-auto">
              {pages.map((page) => (
                <button
                  key={page.path}
                  onClick={() => setSelectedPage(page)}
                  className={`w-full p-4 flex items-center justify-between transition-all text-left ${
                    selectedPage?.path === page.path ? "bg-surface/40" : "hover:bg-surface/20"
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-4 truncate">
                    <span className="font-mono text-xs text-foreground truncate">{page.path}</span>
                    <span className="font-sans text-xs text-muted truncate">{page.title || "No Title"}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${getScoreBadgeClass(page.score)}`}>
                    {page.score}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Quality audit findings and live preview cards */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {selectedPage ? (
            <div className="border border-border/15 bg-surface/5 p-6 rounded-2xl flex flex-col gap-8">
              {/* Selected Page Header */}
              <div className="flex items-center justify-between gap-4 border-b border-border/10 pb-5">
                <div>
                  <h4 className="font-mono text-sm text-foreground truncate">{selectedPage.path}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${getScoreBadgeClass(selectedPage.score)}`}>
                      {selectedPage.score} Score
                    </span>
                    <span className="text-[10px] text-muted font-mono uppercase">
                      H1s: {selectedPage.h1Count} · H2s: {selectedPage.h2Count}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings and issues checklist */}
              {(selectedPage.warnings.length > 0 || selectedPage.recommendations.length > 0) && (
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted">Audit Findings</span>
                  <div className="flex flex-col gap-2">
                    {selectedPage.warnings.map((w, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/10">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </div>
                    ))}
                    {selectedPage.recommendations.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-sky-400 bg-sky-500/5 p-2.5 rounded-lg border border-sky-500/10">
                        <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPage.warnings.length === 0 && selectedPage.recommendations.length === 0 && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                  <FileCheck className="w-4 h-4" />
                  <span>100% Dynamic SEO compliance achieved on this node!</span>
                </div>
              )}

              {/* Previews CAROUSEL/TAB representation */}
              <div className="flex flex-col gap-4 pt-4 border-t border-border/10">
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted">Dynamic Previews</span>

                {/* Google Preview */}
                <div className="bg-[#1e1e1e] border border-border/10 p-5 rounded-xl flex flex-col gap-1.5 font-sans">
                  <span className="font-mono text-[9px] uppercase text-muted tracking-wider mb-2">[ Google SERP Preview ]</span>
                  <div className="text-[14px] text-[#8ab4f8] hover:underline cursor-pointer truncate font-medium">
                    {selectedPage.title || "No Title"}
                  </div>
                  <div className="text-[12px] text-[#30a14e] truncate">
                    https://showcase.annex-consultancy.com{selectedPage.path}
                  </div>
                  <div className="text-[12px] text-neutral-400 leading-normal line-clamp-2">
                    {selectedPage.description || "No Description"}
                  </div>
                </div>

                {/* Facebook Preview Card */}
                <div className="bg-[#1e1e1e] border border-border/10 rounded-xl overflow-hidden flex flex-col font-sans">
                  <span className="font-mono text-[9px] uppercase text-muted tracking-wider p-4 border-b border-border/10">[ Facebook & LinkedIn Card ]</span>
                  {selectedPage.ogImage && (
                    <div className="aspect-[1.91/1] w-full bg-neutral-900 relative">
                      <img src={selectedPage.ogImage} className="object-cover w-full h-full" alt="" />
                    </div>
                  )}
                  <div className="p-4 flex flex-col gap-1 bg-[#242526]">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
                      showcase.annex-consultancy.com
                    </span>
                    <span className="text-[14px] font-bold text-neutral-200 line-clamp-1">
                      {selectedPage.ogTitle || selectedPage.title || "No Title"}
                    </span>
                    <span className="text-[12px] text-neutral-400 line-clamp-1">
                      {selectedPage.ogDescription || selectedPage.description || "No Description"}
                    </span>
                  </div>
                </div>

                {/* Twitter Image card preview */}
                <div className="bg-[#1e1e1e] border border-border/10 rounded-xl overflow-hidden flex flex-col font-sans">
                  <span className="font-mono text-[9px] uppercase text-muted tracking-wider p-4 border-b border-border/10">[ Twitter Card Preview ]</span>
                  {selectedPage.ogImage && (
                    <div className="aspect-[1.91/1] w-full bg-neutral-900 relative">
                      <img src={selectedPage.ogImage} className="object-cover w-full h-full" alt="" />
                      <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] font-mono text-white rounded">
                        ANNEX
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 border border-dashed border-border/20 rounded-2xl flex items-center justify-center text-xs font-mono text-muted">
              Select a page to view quality audit reports
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
