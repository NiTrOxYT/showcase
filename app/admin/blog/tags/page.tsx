"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Tag } from "lucide-react";
import type { BlogTag } from "@/types/blog";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [saving, setSaving] = useState(false);

  const fetchTags = async () => {
    const res = await fetch("/api/admin/blog/tags");
    const json = await res.json();
    setTags(json.tags || []);
    setLoading(false);
  };

  useEffect(() => { fetchTags(); }, []);

  const handleNameChange = (val: string) => {
    setForm({ name: val, slug: slugify(val) });
  };

  const handleCreate = async () => {
    if (!form.name) return;
    setSaving(true);
    await fetch("/api/admin/blog/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", slug: "" });
    await fetchTags();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tag?")) return;
    await fetch(`/api/admin/blog/tags/${id}`, { method: "DELETE" });
    await fetchTags();
  };

  return (
    <div className="px-8 py-8 max-w-3xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-mono text-foreground">Tags</h1>
          <p className="text-sm text-muted mt-1">Manage blog tags for content organisation.</p>
        </div>
        <Link href="/admin/blog" className="text-xs font-mono text-muted hover:text-foreground transition-colors">← Posts</Link>
      </div>

      {/* Sub nav */}
      <div className="flex gap-4 border-b border-border/10 pb-1">
        {[
          { label: "Posts", href: "/admin/blog" },
          { label: "Calendar", href: "/admin/blog/calendar" },
          { label: "Categories", href: "/admin/blog/categories" },
          { label: "Tags", href: "/admin/blog/tags" },
          { label: "Authors", href: "/admin/blog/authors" },
        ].map(({ label, href }) => (
          <Link key={href} href={href} className="text-xs font-mono text-muted hover:text-foreground pb-2 border-b-2 border-transparent hover:border-primary/50 transition-all">
            {label}
          </Link>
        ))}
      </div>

      {/* Create form */}
      <div className="border border-border/15 rounded-xl p-5 bg-surface/20 flex flex-col gap-4">
        <p className="text-xs font-mono text-muted uppercase tracking-wider">New Tag</p>
        <div className="flex gap-3">
          <input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Tag name…"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="flex-1 bg-surface/30 border border-border/20 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none"
          />
          <button
            onClick={handleCreate}
            disabled={saving || !form.name}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-background text-xs font-mono font-bold disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            Create
          </button>
        </div>
      </div>

      {/* Tags cloud */}
      {loading ? (
        <p className="text-sm text-muted font-mono">Loading…</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/30 border border-border/15 hover:border-border/30 transition-all group"
            >
              <Tag className="w-3 h-3 text-muted/60" />
              <span className="text-sm font-mono text-foreground">{tag.name}</span>
              <button
                onClick={() => handleDelete(tag.id)}
                className="w-4 h-4 rounded-full text-muted/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
          {tags.length === 0 && <p className="text-sm text-muted font-mono py-4">No tags yet.</p>}
        </div>
      )}
    </div>
  );
}
