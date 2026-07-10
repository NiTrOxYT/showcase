"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Star,
  Clock,
  Filter,
  Zap,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import type { BlogPost, BlogPostStatus } from "@/types/blog";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const STATUS_COLORS: Record<BlogPostStatus, string> = {
  Draft: "bg-surface/60 text-muted border border-border/20",
  "AI Generated": "bg-purple-500/15 text-purple-400 border border-purple-500/25",
  "In Review": "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
  Approved: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  Scheduled: "bg-orange-500/15 text-orange-400 border border-orange-500/25",
  Published: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  Archived: "bg-surface/40 text-muted/50 border border-border/10",
};

const ALL_STATUSES: BlogPostStatus[] = [
  "Draft",
  "AI Generated",
  "In Review",
  "Approved",
  "Scheduled",
  "Published",
  "Archived",
];

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<BlogPostStatus | "All">("All");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const json = await res.json();
      setPosts(json.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      await fetchPosts();
    } finally {
      setDeleting(null);
    }
  };

  const filtered = posts.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "Published").length,
    draft: posts.filter((p) => p.status === "Draft" || p.status === "AI Generated").length,
    scheduled: posts.filter((p) => p.status === "Scheduled").length,
  };

  return (
    <div className="flex flex-col gap-8 px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-mono tracking-tight text-foreground">
            Blog Posts
          </h1>
          <p className="text-sm text-muted mt-1">
            Manage articles, publishing workflow, and AI-generated content.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-background text-sm font-mono font-bold tracking-wider hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, icon: BookOpen, color: "text-foreground" },
          { label: "Published", value: stats.published, icon: CheckCircle, color: "text-emerald-400" },
          { label: "Drafts", value: stats.draft, icon: Zap, color: "text-yellow-400" },
          { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "text-orange-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-surface/30 border border-border/15 rounded-xl p-4 flex items-center gap-3"
          >
            <Icon className={`w-5 h-5 ${color}`} />
            <div>
              <p className="text-xl font-black font-mono text-foreground">{value}</p>
              <p className="text-xs text-muted font-mono">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface/30 border border-border/20 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 font-mono"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-muted shrink-0" />
          {(["All", ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s as BlogPostStatus | "All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                filterStatus === s
                  ? "bg-primary text-background border-primary font-bold"
                  : "bg-surface/20 text-muted border-border/15 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
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
          <Link
            key={href}
            href={href}
            className="text-xs font-mono text-muted hover:text-foreground pb-2 border-b-2 border-transparent hover:border-primary/50 transition-all"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-muted font-mono text-sm">
          Loading posts…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted font-mono text-sm">
          No posts found. <Link href="/admin/blog/new" className="text-primary hover:underline">Create your first post →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface/20 border border-border/10 hover:bg-surface/30 hover:border-border/20 transition-all group"
            >
              {/* Cover thumbnail */}
              {post.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-16 h-12 object-cover rounded-lg shrink-0"
                />
              ) : (
                <div className="w-16 h-12 rounded-lg bg-surface/50 border border-border/15 shrink-0 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-muted/50" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {post.featured && (
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
                  )}
                  {post.aiGenerated && (
                    <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                  )}
                  <span className="font-mono font-bold text-sm text-foreground truncate">
                    {post.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted font-mono">
                  {post.category?.title && (
                    <span className="text-primary/70">{post.category.title}</span>
                  )}
                  {post.readingTime > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime} min
                    </span>
                  )}
                  <span>
                    {timeAgo(post.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold shrink-0 ${STATUS_COLORS[post.status]}`}
              >
                {post.status}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-surface/50 text-muted hover:text-foreground transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </a>
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="p-2 rounded-lg hover:bg-surface/50 text-muted hover:text-foreground transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted hover:text-destructive transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
