"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Project } from "@/types/project";
import { ArrowUpRight, Search, FileText } from "lucide-react";

interface CaseStudyListClientProps {
  initialProjects: Project[];
}

export function CaseStudyListClient({ initialProjects }: CaseStudyListClientProps) {
  const [search, setSearch] = useState("");

  const filtered = initialProjects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Search Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/60" />
          <input
            type="text"
            placeholder="Search projects by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface/5 border border-border/15 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary/50 text-foreground font-mono"
          />
        </div>
      </div>

      {/* Case Studies Table Grid */}
      <div className="border border-border/10 rounded-xl overflow-hidden bg-surface/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/10 bg-surface/10 font-mono text-[10px] uppercase tracking-wider text-muted font-semibold">
              <th className="px-6 py-4">Case Study / Project</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-xs font-mono text-muted">
                  No projects matching search parameters.
                </td>
              </tr>
            ) : (
              filtered.map((project) => (
                <tr key={project.id} className="hover:bg-surface/5 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {project.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-10 h-10 object-cover rounded-lg border border-border/10"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-surface/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-muted" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-200">{project.title}</span>
                        <span className="text-[10px] text-muted font-mono mt-0.5">{project.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-neutral-300">{project.category}</td>
                  <td className="px-6 py-4 text-xs text-neutral-300">{project.client || "ANNEX Project"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wide ${
                        project.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/case-studies/${project.id}`}
                      className="inline-flex items-center gap-1 bg-surface border border-border/15 hover:border-foreground hover:bg-surface/20 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all duration-150"
                    >
                      Manage Case Study
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default CaseStudyListClient;
