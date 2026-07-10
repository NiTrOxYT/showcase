"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Trash2,
  Plus,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import { Heading } from "@/components/typography/Heading";

interface RedirectRule {
  id: string;
  sourcePath: string;
  destinationPath: string;
  redirectType: number;
  reason?: string;
  createdAt: string;
}

export default function RedirectsPage() {
  const [rules, setRules] = useState<RedirectRule[]>([]);
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [redirectType, setRedirectType] = useState(301);
  const [reason, setReason] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRedirects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/seo/redirects");
      if (!res.ok) throw new Error("Failed to load redirects");
      const data = await res.json();
      setRules(data.rules || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch redirect rules");
    }
  }, []);

  useEffect(() => {
    fetchRedirects();
  }, [fetchRedirects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Form client check
    const cleanSource = sourcePath.trim();
    const cleanDest = destinationPath.trim();

    if (!cleanSource || !cleanDest) {
      setError("Both source path and destination path are required.");
      setLoading(false);
      return;
    }

    if (!cleanSource.startsWith("/")) {
      setError("Source path must begin with a forward slash '/' (e.g. /old-path)");
      setLoading(false);
      return;
    }

    if (cleanSource === cleanDest) {
      setError("Source path and destination path cannot be identical (prevent redirect loop).");
      setLoading(false);
      return;
    }

    // Check duplicate local rule
    const isDuplicate = rules.some(
      (r) => r.sourcePath.toLowerCase() === cleanSource.toLowerCase()
    );
    if (isDuplicate) {
      setError("A redirect rule matching this source path already exists.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcePath: cleanSource,
          destinationPath: cleanDest,
          redirectType,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create redirect");
      }

      setSuccess("Redirect rule created successfully!");
      setSourcePath("");
      setDestinationPath("");
      setReason("");
      fetchRedirects();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this redirect?")) return;

    try {
      const res = await fetch(`/api/admin/seo/redirects?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete redirect");
      }

      fetchRedirects();
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-[1200px] mx-auto select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/10 pb-6">
        <div>
          <Heading level={1} className="text-3xl font-black tracking-tightest">
            Redirect Manager
          </Heading>
          <p className="text-xs font-mono uppercase tracking-widest text-muted mt-1.5">
            Configure permanent 301 and temporary 302 routing rules
          </p>
        </div>
        <div>
          <Link
            href="/admin/seo"
            className="flex items-center gap-2 border border-border/20 hover:border-foreground hover:bg-surface/30 px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Creation Form */}
        <div className="lg:col-span-4 border border-border/15 bg-surface/5 p-6 rounded-2xl">
          <h3 className="font-mono text-xs uppercase tracking-wider text-foreground mb-6">Create Redirect Rule</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-xs">
                {success}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Source Path *</label>
              <input
                type="text"
                placeholder="/old-page"
                value={sourcePath}
                onChange={(e) => setSourcePath(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all font-mono"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Destination Path *</label>
              <input
                type="text"
                placeholder="/new-page or https://..."
                value={destinationPath}
                onChange={(e) => setDestinationPath(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all font-mono"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Redirect Type *</label>
              <select
                value={redirectType}
                onChange={(e) => setRedirectType(Number(e.target.value))}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary transition-all font-mono"
              >
                <option value={301}>301 Permanent Redirect</option>
                <option value={302}>302 Temporary Redirect</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Reason / Notes</label>
              <input
                type="text"
                placeholder="Page restructuring"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-background border border-border/25 px-4 py-2.5 rounded-lg text-xs text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background hover:bg-neutral-200 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 disabled:opacity-50 font-bold flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus className="w-4 h-4" />
              Save Rule
            </button>
          </form>
        </div>

        {/* Right Side: List View Table */}
        <div className="lg:col-span-8 border border-border/15 bg-surface/5 rounded-2xl overflow-hidden">
          <div className="border-b border-border/10 p-5 flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-foreground">Active Redirection Rules</h3>
            <span className="font-mono text-[10px] text-muted">{rules.length} Rules Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-border/10 bg-surface/20 font-mono text-[9px] uppercase tracking-wider text-muted">
                  <th className="p-4 font-bold">Source</th>
                  <th className="p-4 font-bold">Destination</th>
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Reason</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-surface/10 transition-colors">
                    <td className="p-4 font-mono text-neutral-200 truncate max-w-[200px]">{rule.sourcePath}</td>
                    <td className="p-4 font-mono text-neutral-300 truncate max-w-[200px]">{rule.destinationPath}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                          rule.redirectType === 301
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {rule.redirectType}
                      </span>
                    </td>
                    <td className="p-4 text-muted truncate max-w-[150px]">{rule.reason || "—"}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="p-1.5 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-muted hover:text-rose-400 rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {rules.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center font-mono text-muted">
                      No redirection rules configured.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
