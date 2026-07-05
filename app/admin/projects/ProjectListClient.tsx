"use client";
/* eslint-disable react-hooks/purity */

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import type { Project } from "@/types/project";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Check,
  X,
  Star,
} from "lucide-react";

interface ProjectListClientProps {
  initialProjects: Project[];
}

export function ProjectListClient({ initialProjects }: ProjectListClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique categories for filtration
  const categories = useMemo(() => {
    const cats = initialProjects.map((p) => p.category);
    return Array.from(new Set(cats));
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    return result.sort((a, b) => a.order - b.order);
  }, [projects, search, statusFilter, categoryFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setDeletingId(null);
        router.refresh();
      }
    } catch (e) {
      console.error("Deletion failure", e);
    }
  };

  const handleDuplicate = async (project: Project) => {
    try {
      const duplicated = {
        ...project,
        title: `${project.title} (Copy)`,
        slug: `${project.slug}-copy-${Date.now()}`,
        featured: false,
        status: "Draft" as const,
      };
      
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicated),
      });

      if (res.ok) {
        const newProj = await res.json();
        setProjects((prev) => [...prev, newProj]);
        router.refresh();
      }
    } catch (e) {
      console.error("Duplication failure", e);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Project Store ]
          </span>
          <Heading level={1} className="text-3xl font-black mt-2 tracking-tightest uppercase font-mono">
            Showcase Database
          </Heading>
          <Text className="text-muted/60 text-xs">
            Manage public details, showcase priority orders, and visibility parameters.
          </Text>
        </div>

        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 bg-primary text-background rounded hover:bg-primary/90 font-bold transition-all duration-300 shadow-lg"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </Link>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-4">
        <div className="flex flex-1 w-full md:max-w-md items-center gap-2 px-3 py-2 rounded bg-surface/10 border border-border/40 focus-within:border-primary/80 transition-all duration-300">
          <Search className="w-4 h-4 text-muted/60" />
          <input
            type="text"
            placeholder="Search projects by title, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none text-xs focus:outline-none placeholder-muted/50 text-foreground"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 bg-surface/20 border border-border/30 rounded focus:outline-none cursor-pointer text-muted hover:text-foreground transition-all duration-300"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="font-mono text-[10px] uppercase tracking-widest px-3 py-2 bg-surface/20 border border-border/30 rounded focus:outline-none cursor-pointer text-muted hover:text-foreground transition-all duration-300"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="border border-border/40 rounded-lg overflow-hidden bg-surface/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/20 bg-surface/20">
              <th className="font-mono text-[9px] uppercase tracking-widest text-muted/60 font-bold p-4">Project Title</th>
              <th className="font-mono text-[9px] uppercase tracking-widest text-muted/60 font-bold p-4">Category</th>
              <th className="font-mono text-[9px] uppercase tracking-widest text-muted/60 font-bold p-4">Status</th>
              <th className="font-mono text-[9px] uppercase tracking-widest text-muted/60 font-bold p-4">Featured</th>
              <th className="font-mono text-[9px] uppercase tracking-widest text-muted/60 font-bold p-4">Completion Date</th>
              <th className="font-mono text-[9px] uppercase tracking-widest text-muted/60 font-bold p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10 font-sans text-xs">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-surface/5 transition-colors">
                  <td className="p-4 font-bold text-foreground">
                    <div className="flex flex-col">
                      <span>{project.title}</span>
                      <span className="font-mono text-[9px] text-muted/50 font-normal uppercase mt-0.5">{project.client}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted/80">{project.category}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                        project.status === "Published"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {project.status === "Published" ? (
                        <>
                          <Check className="w-2.5 h-2.5" /> Published
                        </>
                      ) : (
                        <>
                          <X className="w-2.5 h-2.5" /> Draft
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4">
                    {project.featured ? (
                      <span className="flex items-center gap-1 text-primary">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-mono text-[9px] uppercase font-bold">({project.featuredOrder ?? 0})</span>
                      </span>
                    ) : (
                      <span className="text-muted/30 font-mono text-[10px]">—</span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-muted/80">{project.completionDate}</td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end">
                      {project.status === "Published" && (
                        <a
                          href={`/showcase/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview details page"
                          className="p-1.5 border border-border/20 rounded hover:bg-surface/50 text-muted hover:text-foreground transition-all duration-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDuplicate(project)}
                        title="Duplicate project metadata"
                        className="p-1.5 border border-border/20 rounded hover:bg-surface/50 text-muted hover:text-foreground transition-all duration-200"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        title="Edit project fields"
                        className="p-1.5 border border-border/20 rounded hover:bg-surface/50 text-muted hover:text-foreground transition-all duration-200"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeletingId(project.id)}
                        title="Delete project entry"
                        className="p-1.5 border border-destructive/20 rounded hover:bg-destructive/10 text-muted hover:text-destructive transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-8 font-mono text-muted/40">
                  No projects match active filter scopes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reusable dialog confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="glassmorphism max-w-sm w-full p-6 border border-border rounded-xl shadow-2xl flex flex-col gap-6">
            <div>
              <Heading level={3} className="text-sm font-mono uppercase tracking-widest text-foreground">
                Confirm Deletion
              </Heading>
              <p className="font-sans text-xs text-muted/80 leading-relaxed mt-2">
                This action is irreversible. The project metadata and references will be purged from index files.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingId(null)}
                className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-border rounded text-muted hover:text-foreground transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => deletingId && handleDelete(deletingId)}
                className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-all duration-200"
              >
                Purge Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
