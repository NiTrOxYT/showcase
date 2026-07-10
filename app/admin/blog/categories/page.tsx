"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import type { BlogCategory } from "@/types/blog";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", slug: "", description: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/blog/categories");
    const json = await res.json();
    setCategories(json.categories || []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleTitleChange = (val: string) => {
    setForm({ ...form, title: val, slug: editId ? form.slug : slugify(val) });
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editId ? `/api/admin/blog/categories/${editId}` : "/api/admin/blog/categories";
    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", slug: "", description: "" });
    setEditId(null);
    await fetchCategories();
    setSaving(false);
  };

  const handleEdit = (cat: BlogCategory) => {
    setEditId(cat.id);
    setForm({ title: cat.title, slug: cat.slug, description: cat.description || "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/blog/categories/${id}`, { method: "DELETE" });
    await fetchCategories();
  };

  return (
    <div className="px-8 py-8 max-w-3xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-mono text-foreground">Categories</h1>
          <p className="text-sm text-muted mt-1">Manage blog categories and their URL slugs.</p>
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

      {/* Create/Edit Form */}
      <div className="border border-border/15 rounded-xl p-5 bg-surface/20 flex flex-col gap-4">
        <p className="text-xs font-mono text-muted uppercase tracking-wider">
          {editId ? "Edit Category" : "New Category"}
        </p>
        <input
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Category title…"
          className="w-full bg-surface/30 border border-border/20 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none"
        />
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="url-slug"
          className="w-full bg-surface/30 border border-border/20 rounded-lg px-4 py-2.5 text-sm font-mono text-foreground focus:outline-none"
        />
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description (optional)…"
          className="w-full bg-surface/30 border border-border/20 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !form.title}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-background text-xs font-mono font-bold disabled:opacity-50"
          >
            {editId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {editId ? "Update" : "Create"}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm({ title: "", slug: "", description: "" }); }} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/20 text-xs font-mono text-muted hover:text-foreground">
              <X className="w-3.5 h-3.5" />Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-muted font-mono">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface/15 border border-border/10 hover:border-border/20 transition-all">
              <div className="flex-1">
                <p className="text-sm font-bold font-mono text-foreground">{cat.title}</p>
                <p className="text-xs text-muted font-mono">/blog/category/{cat.slug}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(cat)} className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface/40 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg text-muted hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-muted font-mono text-center py-8">No categories yet.</p>}
        </div>
      )}
    </div>
  );
}
