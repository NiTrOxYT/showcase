"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Eye,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Send,
  History,
  BarChart3,
  Globe,
  FileText,
  Image as ImageIcon,
  List,
  Quote,
  Code,
  Minus,
  Table,
  Video,
  MessageSquare,
  MousePointer,
  HelpCircle,
  CheckSquare,
  GalleryHorizontal,
} from "lucide-react";
import type {
  BlogPost,
  BlogPostStatus,
  BlogBlock,
  BlogBlockType,
  BlogCategory,
  BlogTag,
  BlogAuthor,
  BlogPostRevision,
} from "@/types/blog";

// ============================================================
// Helpers
// ============================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function estimateReadingTime(blocks: BlogBlock[]): number {
  let wordCount = 0;
  for (const block of blocks) {
    if (block.type === "paragraph" || block.type === "heading") {
      wordCount += String(block.data.text || "").split(/\s+/).filter(Boolean).length;
    } else if (block.type === "quote") {
      wordCount += String(block.data.text || "").split(/\s+/).filter(Boolean).length;
    } else if (block.type === "code") {
      wordCount += 20; // code block flat estimate
    }
  }
  return Math.max(1, Math.ceil(wordCount / 200));
}

function computeQualityScore(post: Partial<BlogPost>): { score: number; checks: Record<string, boolean> } {
  const checks = {
    hasTitle: !!(post.title && post.title.length >= 10),
    hasExcerpt: !!(post.excerpt && post.excerpt.length >= 30),
    hasCoverImage: !!post.coverImage,
    hasSeoTitle: !!post.seoTitle,
    hasSeoDescription: !!post.seoDescription,
    hasKeywords: !!(post.seoKeywords && post.seoKeywords.length > 0),
    hasSlug: !!post.slug,
    hasCategory: !!post.categoryId,
    hasContent: !!(post.content && post.content.length >= 3),
    hasFaq: !!(post.content?.some((b) => b.type === "faq")),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  const score = Math.round((passed / Object.keys(checks).length) * 100);
  return { score, checks };
}

// ============================================================
// Block icons
// ============================================================

const BLOCK_ICONS: Record<BlogBlockType, React.ReactNode> = {
  paragraph: <FileText className="w-3.5 h-3.5" />,
  heading: <span className="text-xs font-black">H</span>,
  image: <ImageIcon className="w-3.5 h-3.5" />,
  gallery: <GalleryHorizontal className="w-3.5 h-3.5" />,
  video: <Video className="w-3.5 h-3.5" />,
  quote: <Quote className="w-3.5 h-3.5" />,
  table: <Table className="w-3.5 h-3.5" />,
  code: <Code className="w-3.5 h-3.5" />,
  callout: <MessageSquare className="w-3.5 h-3.5" />,
  cta: <MousePointer className="w-3.5 h-3.5" />,
  faq: <HelpCircle className="w-3.5 h-3.5" />,
  divider: <Minus className="w-3.5 h-3.5" />,
  checklist: <CheckSquare className="w-3.5 h-3.5" />,
};

const BLOCK_LABELS: Record<BlogBlockType, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  image: "Image",
  gallery: "Gallery",
  video: "Video",
  quote: "Quote",
  table: "Table",
  code: "Code Block",
  callout: "Callout",
  cta: "CTA Button",
  faq: "FAQ",
  divider: "Divider",
  checklist: "Checklist",
};

function createBlock(type: BlogBlockType): BlogBlock {
  const id = crypto.randomUUID();
  const defaults: Record<BlogBlockType, Record<string, unknown>> = {
    paragraph: { text: "" },
    heading: { text: "", level: 2 },
    image: { url: "", alt: "", caption: "" },
    gallery: { images: [] },
    video: { url: "", caption: "" },
    quote: { text: "", author: "" },
    table: { headers: ["Column 1", "Column 2"], rows: [["", ""]] },
    code: { code: "", language: "typescript" },
    callout: { type: "info", text: "" },
    cta: { text: "Book a Free Call", url: "/book-call", variant: "primary" },
    faq: { items: [{ question: "", answer: "" }] },
    divider: {},
    checklist: { items: [{ text: "", checked: false }] },
  };
  return { id, type, data: defaults[type] };
}

// ============================================================
// Block editors
// ============================================================

function BlockEditor({
  block,
  onChange,
}: {
  block: BlogBlock;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const d = block.data;
  switch (block.type) {
    case "paragraph":
      return (
        <textarea
          value={String(d.text || "")}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Write paragraph content…"
          rows={3}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted/50 resize-none focus:outline-none font-sans leading-relaxed"
        />
      );
    case "heading":
      return (
        <div className="flex gap-2 items-start">
          <select
            value={String(d.level || 2)}
            onChange={(e) => onChange({ ...d, level: Number(e.target.value) })}
            className="bg-surface/40 border border-border/20 rounded px-2 py-1 text-xs font-mono text-foreground"
          >
            {[1, 2, 3, 4].map((l) => (
              <option key={l} value={l}>H{l}</option>
            ))}
          </select>
          <input
            value={String(d.text || "")}
            onChange={(e) => onChange({ ...d, text: e.target.value })}
            placeholder="Heading text…"
            className="flex-1 bg-transparent text-base font-bold text-foreground placeholder:text-muted/50 focus:outline-none"
          />
        </div>
      );
    case "image":
      return (
        <div className="flex flex-col gap-2">
          <input
            value={String(d.url || "")}
            onChange={(e) => onChange({ ...d, url: e.target.value })}
            placeholder="Image URL…"
            className="w-full bg-surface/30 border border-border/20 rounded px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none"
          />
          <input
            value={String(d.alt || "")}
            onChange={(e) => onChange({ ...d, alt: e.target.value })}
            placeholder="Alt text (required for accessibility)…"
            className="w-full bg-surface/30 border border-border/20 rounded px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none"
          />
          <input
            value={String(d.caption || "")}
            onChange={(e) => onChange({ ...d, caption: e.target.value })}
            placeholder="Caption (optional)…"
            className="w-full bg-surface/30 border border-border/20 rounded px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none"
          />
        </div>
      );
    case "quote":
      return (
        <div className="flex flex-col gap-2">
          <textarea
            value={String(d.text || "")}
            onChange={(e) => onChange({ ...d, text: e.target.value })}
            placeholder="Quote text…"
            rows={2}
            className="w-full bg-transparent text-sm italic text-foreground/80 placeholder:text-muted/50 resize-none focus:outline-none"
          />
          <input
            value={String(d.author || "")}
            onChange={(e) => onChange({ ...d, author: e.target.value })}
            placeholder="Author name…"
            className="w-full bg-transparent text-xs text-muted placeholder:text-muted/50 focus:outline-none"
          />
        </div>
      );
    case "code":
      return (
        <div className="flex flex-col gap-2">
          <select
            value={String(d.language || "typescript")}
            onChange={(e) => onChange({ ...d, language: e.target.value })}
            className="bg-surface/40 border border-border/20 rounded px-2 py-1 text-xs font-mono text-foreground w-40"
          >
            {["typescript", "javascript", "python", "html", "css", "bash", "json", "sql"].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <textarea
            value={String(d.code || "")}
            onChange={(e) => onChange({ ...d, code: e.target.value })}
            placeholder="// Code here…"
            rows={6}
            className="w-full bg-surface/50 rounded p-3 text-xs font-mono text-foreground placeholder:text-muted/50 resize-y focus:outline-none"
          />
        </div>
      );
    case "callout":
      return (
        <div className="flex gap-2">
          <select
            value={String(d.type || "info")}
            onChange={(e) => onChange({ ...d, type: e.target.value })}
            className="bg-surface/40 border border-border/20 rounded px-2 py-1 text-xs font-mono text-foreground"
          >
            {["info", "warning", "success", "error"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <textarea
            value={String(d.text || "")}
            onChange={(e) => onChange({ ...d, text: e.target.value })}
            placeholder="Callout text…"
            rows={2}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 resize-none focus:outline-none"
          />
        </div>
      );
    case "cta":
      return (
        <div className="grid grid-cols-2 gap-2">
          <input
            value={String(d.text || "")}
            onChange={(e) => onChange({ ...d, text: e.target.value })}
            placeholder="Button text…"
            className="bg-surface/30 border border-border/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          <input
            value={String(d.url || "")}
            onChange={(e) => onChange({ ...d, url: e.target.value })}
            placeholder="Button URL…"
            className="bg-surface/30 border border-border/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none"
          />
        </div>
      );
    case "faq": {
      const items = Array.isArray(d.items)
        ? (d.items as { question: string; answer: string }[])
        : [];
      return (
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-1 border-l-2 border-border/20 pl-3">
              <input
                value={item.question}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], question: e.target.value };
                  onChange({ ...d, items: next });
                }}
                placeholder="Question…"
                className="bg-transparent text-sm font-bold text-foreground placeholder:text-muted/50 focus:outline-none"
              />
              <textarea
                value={item.answer}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], answer: e.target.value };
                  onChange({ ...d, items: next });
                }}
                placeholder="Answer…"
                rows={2}
                className="bg-transparent text-sm text-foreground/80 placeholder:text-muted/50 resize-none focus:outline-none"
              />
            </div>
          ))}
          <button
            onClick={() => onChange({ ...d, items: [...items, { question: "", answer: "" }] })}
            className="text-xs text-primary hover:underline font-mono flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add FAQ item
          </button>
        </div>
      );
    }
    case "divider":
      return <div className="border-t border-border/20 my-1 pointer-events-none" />;
    case "checklist": {
      const items = Array.isArray(d.items)
        ? (d.items as { text: string; checked: boolean }[])
        : [];
      return (
        <div className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], checked: e.target.checked };
                  onChange({ ...d, items: next });
                }}
                className="shrink-0"
              />
              <input
                value={item.text}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], text: e.target.value };
                  onChange({ ...d, items: next });
                }}
                placeholder="Checklist item…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 focus:outline-none"
              />
            </div>
          ))}
          <button
            onClick={() => onChange({ ...d, items: [...items, { text: "", checked: false }] })}
            className="text-xs text-primary hover:underline font-mono flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add item
          </button>
        </div>
      );
    }
    default:
      return (
        <p className="text-xs text-muted font-mono italic">
          Editor for "{block.type}" coming soon.
        </p>
      );
  }
}

// ============================================================
// Main form component
// ============================================================

interface BlogPostFormProps {
  post?: BlogPost;
  categories?: BlogCategory[];
  tags?: BlogTag[];
  authors?: BlogAuthor[];
  revisions?: BlogPostRevision[];
}

const STATUS_OPTIONS: BlogPostStatus[] = [
  "Draft",
  "AI Generated",
  "In Review",
  "Approved",
  "Scheduled",
  "Published",
  "Archived",
];

export function BlogPostForm({
  post,
  categories = [],
  tags = [],
  authors = [],
  revisions = [],
}: BlogPostFormProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [authorId, setAuthorId] = useState(post?.authorId || "");
  const [categoryId, setCategoryId] = useState(post?.categoryId || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    post?.tags?.map((t) => t.id) || []
  );
  const [status, setStatus] = useState<BlogPostStatus>(post?.status || "Draft");
  const [publishedAt, setPublishedAt] = useState(post?.publishedAt?.slice(0, 16) || "");
  const [featured, setFeatured] = useState(post?.featured || false);
  const [blocks, setBlocks] = useState<BlogBlock[]>(post?.content || []);

  // SEO
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || "");
  const [seoKeywords, setSeoKeywords] = useState<string[]>(post?.seoKeywords || []);
  const [seoKeywordsInput, setSeoKeywordsInput] = useState(
    post?.seoKeywords?.join(", ") || ""
  );

  // AI fields
  const [aiGenerated, setAiGenerated] = useState(post?.aiGenerated || false);
  const [aiPrompt, setAiPrompt] = useState(post?.aiPrompt || "");
  const [aiNotes, setAiNotes] = useState(post?.aiNotes || "");

  // Social captions
  const [socialCaptions, setSocialCaptions] = useState(post?.socialCaptions || {});

  // UI state
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "ai" | "social" | "analytics">("content");
  const [showRevisions, setShowRevisions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Auto-slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) setSlug(slugify(val));
  };

  // Quality score
  const currentPost: Partial<BlogPost> = {
    title,
    excerpt,
    coverImage: coverImage || undefined,
    seoTitle: seoTitle || undefined,
    seoDescription: seoDescription || undefined,
    seoKeywords,
    slug,
    categoryId: categoryId || undefined,
    content: blocks,
  };
  const { score, checks } = computeQualityScore(currentPost);
  const readingTime = estimateReadingTime(blocks);

  // Block operations
  const addBlock = useCallback((type: BlogBlockType) => {
    setBlocks((prev) => [...prev, createBlock(type)]);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const moveBlock = useCallback((id: string, dir: -1 | 1) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const updateBlock = useCallback((id: string, data: Record<string, unknown>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, data } : b))
    );
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const keywords = seoKeywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    setSeoKeywords(keywords);

    const payload = {
      title,
      slug,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      authorId: authorId || null,
      categoryId: categoryId || null,
      status,
      publishedAt:
        status === "Scheduled" || status === "Published"
          ? publishedAt
            ? new Date(publishedAt).toISOString()
            : new Date().toISOString()
          : null,
      featured,
      content: blocks,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      seoKeywords: keywords,
      readingTime,
      aiGenerated,
      aiPrompt: aiPrompt || null,
      aiNotes: aiNotes || null,
      socialCaptions,
      tagIds: selectedTagIds,
    };

    try {
      const res = isEditing
        ? await fetch(`/api/admin/blog/${post.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error || "Failed to save");
      } else {
        const json = await res.json();
        if (!isEditing && json.post?.id) {
          router.push(`/admin/blog/${json.post.id}`);
        } else {
          router.refresh();
        }
      }
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const BLOCK_TYPES: BlogBlockType[] = [
    "paragraph", "heading", "image", "gallery", "video", "quote",
    "table", "code", "callout", "cta", "faq", "divider", "checklist",
  ];

  const scoreColor =
    score >= 80 ? "text-emerald-400" : score >= 50 ? "text-yellow-400" : "text-red-400";

  const CHECK_LABELS: Record<string, string> = {
    hasTitle: "Title (≥10 chars)",
    hasExcerpt: "Excerpt (≥30 chars)",
    hasCoverImage: "Cover image",
    hasSeoTitle: "SEO title",
    hasSeoDescription: "SEO description",
    hasKeywords: "Keywords",
    hasSlug: "URL slug",
    hasCategory: "Category",
    hasContent: "Content (≥3 blocks)",
    hasFaq: "FAQ block",
  };

  return (
    <div className="flex flex-col gap-0 min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-border/10 bg-background/60 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/blog")}
            className="text-xs font-mono text-muted hover:text-foreground transition-colors"
          >
            ← Back to Posts
          </button>
          <span className="text-xs font-mono text-border/40">|</span>
          <span className="text-xs font-mono text-muted">
            {isEditing ? `Editing: ${post.title}` : "New Post"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Quality score badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/30 border border-border/15">
            <BarChart3 className="w-3.5 h-3.5 text-muted" />
            <span className={`text-xs font-mono font-bold ${scoreColor}`}>{score}%</span>
            <span className="text-xs text-muted font-mono">Quality</span>
          </div>
          {/* Reading time */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/30 border border-border/15">
            <Clock className="w-3.5 h-3.5 text-muted" />
            <span className="text-xs font-mono text-muted">{readingTime} min read</span>
          </div>
          {/* Revisions toggle */}
          {isEditing && revisions.length > 0 && (
            <button
              onClick={() => setShowRevisions(!showRevisions)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/30 border border-border/15 text-xs font-mono text-muted hover:text-foreground transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              {revisions.length} revisions
            </button>
          )}
          <a
            href={`/blog/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/30 border border-border/15 text-xs font-mono text-muted hover:text-foreground transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-background text-xs font-mono font-bold tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="px-8 py-3 bg-destructive/10 border-b border-destructive/20 text-sm text-destructive font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {saveError}
        </div>
      )}

      <div className="flex flex-1">
        {/* Editor main area */}
        <div className="flex-1 px-8 py-8 flex flex-col gap-8 min-w-0">
          {/* Title & Slug */}
          <div className="flex flex-col gap-3">
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title…"
              className="text-3xl font-black text-foreground bg-transparent border-none outline-none placeholder:text-muted/40 w-full"
            />
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-muted" />
              <span className="text-xs text-muted font-mono">/blog/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug"
                className="text-xs font-mono text-primary bg-transparent border-none outline-none flex-1"
              />
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a short excerpt or summary (shown in article listings)…"
              rows={2}
              className="text-sm text-muted bg-transparent border-b border-border/10 pb-2 outline-none resize-none w-full placeholder:text-muted/40"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border/10">
            {(["content", "seo", "ai", "social", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-primary text-foreground font-bold"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content tab: Block Editor */}
          {activeTab === "content" && (
            <div className="flex flex-col gap-4">
              {blocks.length === 0 && (
                <p className="text-sm text-muted/50 font-mono text-center py-8">
                  No blocks yet. Add your first block below.
                </p>
              )}

              {blocks.map((block, idx) => (
                <div
                  key={block.id}
                  className="group relative flex gap-3 border border-border/10 rounded-xl p-4 bg-surface/15 hover:border-border/25 transition-all"
                >
                  {/* Block type label */}
                  <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                    <span className="text-muted/60 flex items-center gap-1 text-xs font-mono">
                      {BLOCK_ICONS[block.type]}
                    </span>
                    <button
                      onClick={() => moveBlock(block.id, -1)}
                      disabled={idx === 0}
                      className="p-0.5 rounded text-muted/40 hover:text-foreground disabled:opacity-20 transition-colors"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveBlock(block.id, 1)}
                      disabled={idx === blocks.length - 1}
                      className="p-0.5 rounded text-muted/40 hover:text-foreground disabled:opacity-20 transition-colors"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted/40 font-mono mb-2">
                      {BLOCK_LABELS[block.type]}
                    </p>
                    <BlockEditor
                      block={block}
                      onChange={(data) => updateBlock(block.id, data)}
                    />
                  </div>
                  {/* Delete */}
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="shrink-0 p-1.5 rounded-lg text-muted/30 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add block toolbar */}
              <div className="border border-dashed border-border/20 rounded-xl p-4">
                <p className="text-xs text-muted/50 font-mono mb-3">Add block</p>
                <div className="flex flex-wrap gap-2">
                  {BLOCK_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => addBlock(type)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/30 border border-border/15 text-xs font-mono text-muted hover:text-foreground hover:border-border/30 transition-all"
                    >
                      {BLOCK_ICONS[type]}
                      {BLOCK_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-muted uppercase tracking-wider">SEO Title</label>
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SEO-optimized title…"
                  className="w-full bg-surface/30 border border-border/20 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40"
                />
                <p className="text-xs text-muted font-mono">{seoTitle.length}/60 chars</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-muted uppercase tracking-wider">SEO Description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Meta description for search engines…"
                  rows={3}
                  className="w-full bg-surface/30 border border-border/20 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none"
                />
                <p className="text-xs text-muted font-mono">{seoDescription.length}/160 chars</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-muted uppercase tracking-wider">Keywords (comma separated)</label>
                <input
                  value={seoKeywordsInput}
                  onChange={(e) => setSeoKeywordsInput(e.target.value)}
                  placeholder="next.js, web development, seo…"
                  className="w-full bg-surface/30 border border-border/20 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40"
                />
              </div>
              {/* SERP Preview */}
              <div className="border border-border/15 rounded-xl p-5 bg-surface/10">
                <p className="text-xs font-mono text-muted uppercase tracking-wider mb-4">Google SERP Preview</p>
                <div className="font-sans">
                  <p className="text-blue-400 text-lg hover:underline cursor-pointer truncate">
                    {seoTitle || title || "Page Title"}
                  </p>
                  <p className="text-emerald-600 text-xs truncate">
                    annex-consultancy.com/blog/{slug || "post-slug"}
                  </p>
                  <p className="text-sm text-foreground/70 mt-1 line-clamp-2">
                    {seoDescription || excerpt || "Add a meta description for this article…"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Tab */}
          {activeTab === "ai" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                <Zap className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-bold font-mono text-foreground">AI Content Tracking</p>
                  <p className="text-xs text-muted">Track AI-generated and human-reviewed content for editorial governance.</p>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiGenerated}
                  onChange={(e) => setAiGenerated(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-mono text-foreground">This content was AI-generated</span>
              </label>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-muted uppercase tracking-wider">AI Prompt Used</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Paste the prompt that generated this content…"
                  rows={4}
                  className="w-full bg-surface/30 border border-border/20 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none font-mono"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-muted uppercase tracking-wider">AI Notes / Context</label>
                <textarea
                  value={aiNotes}
                  onChange={(e) => setAiNotes(e.target.value)}
                  placeholder="Notes about AI generation, model used, context provided…"
                  rows={3}
                  className="w-full bg-surface/30 border border-border/20 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none"
                />
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === "social" && (
            <div className="flex flex-col gap-6">
              <p className="text-sm text-muted font-mono">
                Prepare social media captions. Automatic publishing is not enabled yet.
              </p>
              {(["linkedin", "twitter", "instagram", "threads", "facebook"] as const).map((platform) => (
                <div key={platform} className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-muted uppercase tracking-wider">{platform}</label>
                  <textarea
                    value={(socialCaptions as Record<string, string>)[platform] || ""}
                    onChange={(e) =>
                      setSocialCaptions({ ...socialCaptions, [platform]: e.target.value })
                    }
                    placeholder={`${platform} post caption…`}
                    rows={3}
                    className="w-full bg-surface/30 border border-border/20 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Views", value: post?.views || 0 },
                { label: "CTA Clicks", value: post?.ctaClicks || 0 },
                { label: "Newsletter Signups", value: post?.newsletterSignups || 0 },
                { label: "Consultation Clicks", value: post?.consultationClicks || 0 },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-surface/30 border border-border/15 rounded-xl p-5 text-center"
                >
                  <p className="text-2xl font-black font-mono text-foreground">{value}</p>
                  <p className="text-xs text-muted font-mono mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-80 shrink-0 border-l border-border/10 flex flex-col gap-6 px-6 py-8 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
          {/* Status */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-muted uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
              className="w-full bg-surface/30 border border-border/20 rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Publish date */}
          {(status === "Scheduled" || status === "Published") && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-muted uppercase tracking-wider">Publish Date</label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-surface/30 border border-border/20 rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none"
              />
            </div>
          )}

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4"
            />
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-sm font-mono text-foreground">Featured post</span>
            </div>
          </label>

          {/* Newsletter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Newsletter
            </label>
            <div className="flex flex-col gap-1.5">
              {(["none", "send", "queue"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                  <span className="text-sm font-mono text-foreground capitalize">{opt === "none" ? "No newsletter" : opt === "send" ? "Send immediately" : "Queue newsletter"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Author */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-muted uppercase tracking-wider">Author</label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full bg-surface/30 border border-border/20 rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none"
            >
              <option value="">— Select author —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-muted uppercase tracking-wider">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-surface/30 border border-border/20 rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none"
            >
              <option value="">— Select category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-muted uppercase tracking-wider">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() =>
                      setSelectedTagIds((prev) =>
                        selected ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                      )
                    }
                    className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
                      selected
                        ? "bg-primary text-background border-primary"
                        : "bg-surface/20 text-muted border-border/15 hover:text-foreground"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover Image */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-muted uppercase tracking-wider">Cover Image URL</label>
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://…"
              className="w-full bg-surface/30 border border-border/20 rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
            />
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-32 object-cover rounded-lg border border-border/15"
              />
            )}
          </div>

          {/* Quality Checklist */}
          <div className="flex flex-col gap-2 border-t border-border/10 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-muted uppercase tracking-wider">SEO Checklist</label>
              <span className={`text-xs font-mono font-bold ${scoreColor}`}>{score}%</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {Object.entries(checks).map(([key, passed]) => (
                <div key={key} className="flex items-center gap-2">
                  {passed ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-muted/40 shrink-0" />
                  )}
                  <span
                    className={`text-xs font-mono ${passed ? "text-foreground/70" : "text-muted/50"}`}
                  >
                    {CHECK_LABELS[key]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revisions panel */}
          {showRevisions && revisions.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-border/10 pt-4">
              <label className="text-xs font-mono text-muted uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Revision History
              </label>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface/20 border border-border/10"
                  >
                    <span className="text-xs font-mono text-muted">
                      {new Date(rev.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={async () => {
                        if (!confirm("Restore this version? Current content will be saved as a revision.")) return;
                        await fetch(`/api/admin/blog/${post!.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ content: rev.content }),
                        });
                        router.refresh();
                      }}
                      className="text-xs font-mono text-primary hover:underline"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Readability metrics */}
          <div className="flex flex-col gap-2 border-t border-border/10 pt-4">
            <label className="text-xs font-mono text-muted uppercase tracking-wider">Readability</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface/20 border border-border/10 rounded-lg p-3 text-center">
                <p className="text-lg font-black font-mono text-foreground">{readingTime}</p>
                <p className="text-xs text-muted font-mono">min read</p>
              </div>
              <div className="bg-surface/20 border border-border/10 rounded-lg p-3 text-center">
                <p className="text-lg font-black font-mono text-foreground">{blocks.length}</p>
                <p className="text-xs text-muted font-mono">blocks</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
