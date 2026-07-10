"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil, Check, X, User } from "lucide-react";
import type { BlogAuthor } from "@/types/blog";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const EMPTY_FORM = {
  name: "", slug: "", avatar: "", bio: "",
  socialLinks: { twitter: "", linkedin: "", github: "", website: "" },
};

export default function BlogAuthorsPage() {
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAuthors = async () => {
    const res = await fetch("/api/admin/blog/authors");
    const json = await res.json();
    setAuthors(json.authors || []);
    setLoading(false);
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleNameChange = (val: string) => {
    setForm({ ...form, name: val, slug: editId ? form.slug : slugify(val) });
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, socialLinks: form.socialLinks };
    const url = editId ? `/api/admin/blog/authors/${editId}` : "/api/admin/blog/authors";
    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setForm(EMPTY_FORM);
    setEditId(null);
    await fetchAuthors();
    setSaving(false);
  };

  const handleEdit = (author: BlogAuthor) => {
    setEditId(author.id);
    setForm({
      name: author.name,
      slug: author.slug,
      avatar: author.avatar || "",
      bio: author.bio || "",
      socialLinks: {
        twitter: author.socialLinks.twitter || "",
        linkedin: author.socialLinks.linkedin || "",
        github: author.socialLinks.github || "",
        website: author.socialLinks.website || "",
      },
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this author?")) return;
    await fetch(`/api/admin/blog/authors/${id}`, { method: "DELETE" });
    await fetchAuthors();
  };

  return (
    <div className="px-8 py-8 max-w-3xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-mono text-foreground">Authors</h1>
          <p className="text-sm text-muted mt-1">Manage blog authors and their profiles.</p>
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

      {/* Form */}
      <div className="border border-border/15 rounded-xl p-5 bg-surface/20 flex flex-col gap-3">
        <p className="text-xs font-mono text-muted uppercase tracking-wider">{editId ? "Edit Author" : "New Author"}</p>
        <div className="grid grid-cols-2 gap-3">
          <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Name…" className="bg-surface/30 border border-border/20 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none" />
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug" className="bg-surface/30 border border-border/20 rounded-lg px-3 py-2.5 text-sm font-mono text-foreground focus:outline-none" />
        </div>
        <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="Avatar image URL…" className="bg-surface/30 border border-border/20 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none" />
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio…" rows={2} className="bg-surface/30 border border-border/20 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none resize-none" />
        <div className="grid grid-cols-2 gap-3">
          {(["twitter", "linkedin", "github", "website"] as const).map((key) => (
            <input
              key={key}
              value={form.socialLinks[key]}
              onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })}
              placeholder={`${key} URL…`}
              className="bg-surface/30 border border-border/20 rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving || !form.name} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-background text-xs font-mono font-bold disabled:opacity-50">
            {editId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {editId ? "Update" : "Create"}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm(EMPTY_FORM); }} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/20 text-xs font-mono text-muted hover:text-foreground">
              <X className="w-3.5 h-3.5" />Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-muted font-mono">Loading…</p>
      ) : (
        <div className="flex flex-col gap-3">
          {authors.map((author) => (
            <div key={author.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface/15 border border-border/10 hover:border-border/20 transition-all">
              {author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-surface/50 border border-border/15 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold font-mono text-foreground">{author.name}</p>
                <p className="text-xs text-muted font-mono truncate">{author.bio || "No bio"}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(author)} className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface/40 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(author.id)} className="p-2 rounded-lg text-muted hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {authors.length === 0 && <p className="text-sm text-muted font-mono text-center py-8">No authors yet.</p>}
        </div>
      )}
    </div>
  );
}
