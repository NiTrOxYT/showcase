"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, Tag, ArrowRight, Star } from "lucide-react";
import type { BlogPost, BlogCategory, BlogTag } from "@/types/blog";

interface Props {
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
}

export function BlogIndex({ posts, categories, tags }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        !activeCategory || p.category?.slug === activeCategory;
      const matchTag =
        !activeTag || p.tags?.some((t) => t.slug === activeTag);
      return matchSearch && matchCategory && matchTag;
    });
  }, [posts, search, activeCategory, activeTag]);

  const featured = filtered.filter((p) => p.featured).slice(0, 1)[0];
  const rest = filtered.filter((p) => p !== featured);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 border-b border-border/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-4">
            ANNEX Blog
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight mb-6">
            Insights & Expertise
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Deep dives into web development, AI automation, design systems, and the business of building great software.
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto mt-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-12 pr-6 py-4 rounded-xl bg-surface/30 border border-border/20 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 text-sm backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex gap-12">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-all ${
                  !activeCategory
                    ? "bg-primary text-background border-primary"
                    : "bg-surface/20 text-muted border-border/15 hover:text-foreground"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat.slug ? null : cat.slug)
                  }
                  className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-all ${
                    activeCategory === cat.slug
                      ? "bg-primary text-background border-primary"
                      : "bg-surface/20 text-muted border-border/15 hover:text-foreground"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Featured post */}
            {featured && !search && !activeCategory && !activeTag && (
              <Link href={`/blog/${featured.slug}`} className="group block mb-12">
                <article className="relative overflow-hidden rounded-2xl border border-border/15 bg-surface/20 hover:border-border/30 transition-all">
                  {featured.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.coverImage}
                      alt={featured.title}
                      className="w-full h-72 object-cover"
                    />
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-mono">
                        <Star className="w-3 h-3 fill-primary" />
                        Featured
                      </span>
                      {featured.category && (
                        <span className="px-2.5 py-1 rounded-full bg-surface/50 text-muted text-xs font-mono">
                          {featured.category.title}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-black text-foreground mb-3 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted font-mono">
                        {featured.author && <span>{featured.author.name}</span>}
                        {featured.readingTime > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {featured.readingTime} min
                          </span>
                        )}
                        {featured.publishedAt && (
                          <span>{new Date(featured.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-sm text-primary font-mono group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Article grid */}
            {filtered.length === 0 ? (
              <p className="text-center text-muted font-mono py-20">
                No articles found. Try a different search.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rest.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <article className="h-full flex flex-col rounded-xl border border-border/10 bg-surface/10 hover:border-border/25 hover:bg-surface/20 transition-all overflow-hidden">
                      {post.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-44 object-cover"
                        />
                      ) : (
                        <div className="w-full h-44 bg-surface/30 border-b border-border/10" />
                      )}
                      <div className="flex flex-col flex-1 p-5 gap-3">
                        {post.category && (
                          <span className="text-xs font-mono text-primary/70">{post.category.title}</span>
                        )}
                        <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-sm text-muted line-clamp-2 flex-1">{post.excerpt}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted/70 font-mono pt-1 border-t border-border/10">
                          {post.author && <span>{post.author.name}</span>}
                          {post.readingTime > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readingTime} min
                            </span>
                          )}
                          {post.publishedAt && (
                            <span className="ml-auto">
                              {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-8 w-64 shrink-0">
            {/* Tags */}
            <div>
              <h3 className="text-xs font-mono text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" /> Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() =>
                      setActiveTag(activeTag === tag.slug ? null : tag.slug)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                      activeTag === tag.slug
                        ? "bg-primary text-background border-primary"
                        : "bg-surface/20 text-muted border-border/15 hover:text-foreground"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="border border-primary/20 rounded-xl p-5 bg-primary/5">
              <h3 className="text-sm font-bold font-mono text-foreground mb-2">
                Stay Updated
              </h3>
              <p className="text-xs text-muted mb-4">
                Get the latest articles delivered to your inbox.
              </p>
              <Link
                href="/#newsletter"
                className="block w-full text-center px-4 py-2 rounded-lg bg-primary text-background text-xs font-mono font-bold hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </Link>
            </div>

            {/* CTA */}
            <div className="border border-border/10 rounded-xl p-5 bg-surface/10">
              <h3 className="text-sm font-bold font-mono text-foreground mb-2">
                Ready to build?
              </h3>
              <p className="text-xs text-muted mb-4">
                Let&apos;s discuss your project over a free consultation call.
              </p>
              <Link
                href="/book-call"
                className="block w-full text-center px-4 py-2 rounded-lg border border-border/20 text-xs font-mono text-foreground hover:bg-surface/40 transition-colors"
              >
                Book a Free Call
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
