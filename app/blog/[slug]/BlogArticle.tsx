"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Clock,
  User,
  Calendar,
  Tag,
  ChevronRight,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import type { BlogPost, BlogBlock } from "@/types/blog";

// ============================================================
// Block renderer
// ============================================================

function BlockRenderer({ block }: { block: BlogBlock }) {
  const d = block.data;
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-foreground/85 text-base leading-8 mb-6">
          {String(d.text || "")}
        </p>
      );
    case "heading": {
      const level = Number(d.level || 2);
      const text = String(d.text || "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const classes = [
        "",
        "text-3xl font-black mt-10 mb-4",
        "text-2xl font-bold mt-8 mb-3",
        "text-xl font-bold mt-6 mb-2",
        "text-lg font-bold mt-4 mb-2",
      ][level] || "text-lg font-bold mt-4 mb-2";
      if (level === 1) return <h1 id={id} className={`text-foreground ${classes}`}>{text}</h1>;
      if (level === 2) return <h2 id={id} className={`text-foreground ${classes}`}>{text}</h2>;
      if (level === 3) return <h3 id={id} className={`text-foreground ${classes}`}>{text}</h3>;
      return <h4 id={id} className={`text-foreground ${classes}`}>{text}</h4>;
    }
    case "image":
      return d.url ? (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={String(d.url)}
            alt={String(d.alt || "")}
            loading="lazy"
            className="w-full rounded-xl border border-border/10"
          />
          {d.caption && (
            <figcaption className="text-center text-xs text-muted mt-2 font-mono">
              {String(d.caption)}
            </figcaption>
          )}
        </figure>
      ) : null;
    case "quote":
      return (
        <blockquote className="my-8 pl-6 border-l-4 border-primary/40">
          <p className="text-lg italic text-foreground/80 mb-2">{String(d.text || "")}</p>
          {d.author && (
            <p className="text-sm text-muted font-mono">— {String(d.author)}</p>
          )}
        </blockquote>
      );
    case "code":
      return (
        <div className="my-6">
          {d.language && (
            <div className="flex items-center justify-between bg-surface/50 border border-border/15 border-b-0 rounded-t-lg px-4 py-2">
              <span className="text-xs font-mono text-muted">{String(d.language)}</span>
            </div>
          )}
          <pre className="bg-surface/40 border border-border/15 rounded-b-lg p-4 overflow-x-auto">
            <code className="text-sm font-mono text-foreground/90 whitespace-pre">
              {String(d.code || "")}
            </code>
          </pre>
        </div>
      );
    case "callout": {
      const calloutStyles: Record<string, string> = {
        info: "border-blue-500/30 bg-blue-500/5 text-blue-300",
        warning: "border-yellow-500/30 bg-yellow-500/5 text-yellow-300",
        success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
        error: "border-red-500/30 bg-red-500/5 text-red-300",
      };
      return (
        <div className={`my-6 px-5 py-4 rounded-xl border ${calloutStyles[String(d.type || "info")] || calloutStyles.info}`}>
          <p className="text-sm leading-relaxed">{String(d.text || "")}</p>
        </div>
      );
    }
    case "cta":
      return (
        <div className="my-8 p-6 rounded-xl border border-primary/20 bg-primary/5 text-center">
          <Link
            href={String(d.url || "/book-call")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            {String(d.text || "Get Started")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      );
    case "faq": {
      const items = Array.isArray(d.items)
        ? (d.items as { question: string; answer: string }[])
        : [];
      return (
        <div className="my-8 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-foreground">Frequently Asked Questions</h3>
          {items.map((item, i) => (
            <details key={i} className="group border border-border/15 rounded-xl">
              <summary className="px-5 py-4 cursor-pointer text-sm font-bold text-foreground list-none flex items-center justify-between">
                {item.question}
                <ChevronRight className="w-4 h-4 text-muted group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      );
    }
    case "divider":
      return <hr className="my-8 border-border/15" />;
    case "checklist": {
      const items = Array.isArray(d.items)
        ? (d.items as { text: string; checked: boolean }[])
        : [];
      return (
        <ul className="my-6 flex flex-col gap-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center ${item.checked ? "bg-primary border-primary" : "border-border/30"}`}>
                {item.checked && <span className="text-background text-xs font-bold">✓</span>}
              </div>
              <span className={`text-sm leading-relaxed ${item.checked ? "text-muted line-through" : "text-foreground/85"}`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      );
    }
    default:
      return null;
  }
}

// ============================================================
// TOC generation
// ============================================================

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function generateToc(blocks: BlogBlock[]): TocItem[] {
  return blocks
    .filter((b) => b.type === "heading")
    .map((b) => ({
      id: String(b.data.text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      text: String(b.data.text || ""),
      level: Number(b.data.level || 2),
    }));
}

// ============================================================
// Main Article Component
// ============================================================

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogArticle({ post, relatedPosts }: Props) {
  const [readProgress, setReadProgress] = useState(0);
  const [activeToc, setActiveToc] = useState<string | null>(null);
  const [showToc, setShowToc] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toc = generateToc(post.content);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setReadProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active TOC item
  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveToc(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-primary z-50 transition-all duration-100"
        style={{ width: `${readProgress}%` }}
      />

      {/* Breadcrumbs */}
      <nav className="px-6 py-4 max-w-5xl mx-auto text-xs font-mono text-muted flex items-center gap-2">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        {post.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/blog/category/${post.category.slug}`} className="hover:text-foreground transition-colors">
              {post.category.title}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground/60 truncate max-w-32">{post.title}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex gap-12">
          {/* Content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Hero */}
            <header className="mb-10">
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-mono mb-4 hover:bg-primary/25 transition-colors"
                >
                  {post.category.title}
                </Link>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-6">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg text-muted leading-relaxed mb-6">{post.excerpt}</p>
              )}
              <div className="flex flex-wrap items-center gap-5 text-sm text-muted font-mono border-t border-b border-border/10 py-4">
                {post.author && (
                  <Link
                    href={`/blog/author/${post.author.slug}`}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    {post.author.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className={`w-7 h-7 shrink-0 ${
                          post.author.name.toLowerCase() === "annex"
                            ? "object-contain bg-transparent"
                            : "rounded-full object-cover"
                        }`}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-surface/50 border border-border/15 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-muted" />
                      </div>
                    )}
                    {post.author.name}
                  </Link>
                )}
                {post.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
                {post.readingTime > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTime} min read
                  </span>
                )}
              </div>
            </header>

            {/* Cover image */}
            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImage}
                alt={post.title}
                loading="eager"
                className="w-full rounded-2xl border border-border/10 mb-10"
              />
            )}

            {/* Mobile TOC toggle */}
            {toc.length > 0 && (
              <div className="lg:hidden mb-8 border border-border/15 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowToc(!showToc)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-surface/20 text-sm font-mono font-bold text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Table of Contents
                  </span>
                  <ChevronRight className={`w-4 h-4 text-muted transition-transform ${showToc ? "rotate-90" : ""}`} />
                </button>
                {showToc && (
                  <nav className="px-5 py-4 flex flex-col gap-2">
                    {toc.map(({ id, text, level }) => (
                      <a
                        key={id}
                        href={`#${id}`}
                        onClick={() => setShowToc(false)}
                        className={`text-sm text-muted hover:text-foreground transition-colors ${level >= 3 ? "pl-4" : ""}`}
                      >
                        {text}
                      </a>
                    ))}
                  </nav>
                )}
              </div>
            )}

            {/* Article body */}
            <div ref={contentRef} className="prose-custom">
              {post.content.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border/10">
                <Tag className="w-4 h-4 text-muted mt-0.5" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="px-3 py-1 rounded-full border border-border/15 bg-surface/20 text-xs font-mono text-muted hover:text-foreground hover:border-border/30 transition-all"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Author bio */}
            {post.author && (
              <div className="mt-10 p-6 rounded-2xl border border-border/15 bg-surface/10 flex gap-5">
                {post.author.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className={`w-16 h-16 shrink-0 ${
                      post.author.name.toLowerCase() === "annex"
                        ? "object-contain bg-transparent"
                        : "rounded-full object-cover"
                    }`}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-surface/50 border border-border/15 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-muted" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground mb-1">{post.author.name}</p>
                  {post.author.bio && (
                    <p className="text-sm text-muted leading-relaxed mb-3">{post.author.bio}</p>
                  )}
                  <div className="flex gap-3">
                    {post.author.socialLinks.twitter && (
                      <a href={post.author.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {post.author.socialLinks.linkedin && (
                      <a href={post.author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {post.author.socialLinks.github && (
                      <a href={post.author.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {post.author.socialLinks.website && (
                      <a href={post.author.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Newsletter section */}
            <div className="mt-12 p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center">
              <h3 className="text-xl font-black text-foreground mb-2">Enjoyed this article?</h3>
              <p className="text-muted text-sm mb-6">Get insights like this delivered directly to your inbox.</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  await fetch("/api/newsletter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: fd.get("email") }),
                  });
                  (e.target as HTMLFormElement).reset();
                }}
                className="flex gap-3 max-w-sm mx-auto"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  className="flex-1 bg-background/50 border border-border/20 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-primary text-background text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* CTA */}
            <div className="mt-8 p-6 rounded-2xl border border-border/10 bg-surface/10 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-bold text-foreground">Ready to work together?</p>
                <p className="text-xs text-muted mt-0.5">Book a free 30-minute consultation call.</p>
              </div>
              <Link
                href="/book-call"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-colors shrink-0"
              >
                Book a Free Call <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-14">
                <h2 className="text-xl font-black text-foreground mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map((rp) => (
                    <Link key={rp.id} href={`/blog/${rp.slug}`} className="group">
                      <div className="rounded-xl border border-border/10 bg-surface/10 hover:border-border/25 hover:bg-surface/20 transition-all overflow-hidden">
                        {rp.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={rp.coverImage}
                            alt={rp.title}
                            loading="lazy"
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="w-full h-32 bg-surface/30" />
                        )}
                        <div className="p-4">
                          <p className="text-xs font-mono text-muted/60 mb-1">{rp.category?.title}</p>
                          <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {rp.title}
                          </h3>
                          <p className="text-xs text-muted/60 font-mono mt-2">{rp.readingTime} min read</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sticky TOC sidebar (desktop) */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24">
                <p className="text-xs font-mono text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  On this page
                </p>
                <nav className="flex flex-col gap-1">
                  {toc.map(({ id, text, level }) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      className={`text-xs font-mono leading-relaxed transition-all py-0.5 border-l-2 pl-3 ${
                        activeToc === id
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted/60 hover:text-muted"
                      } ${level >= 3 ? "pl-5" : ""}`}
                    >
                      {text}
                    </a>
                  ))}
                </nav>
                {/* Reading progress */}
                <div className="mt-6 flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-mono text-muted/50">
                    <span>Progress</span>
                    <span>{Math.round(readProgress)}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-surface/40">
                    <div
                      className="h-1 rounded-full bg-primary transition-all duration-200"
                      style={{ width: `${readProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
