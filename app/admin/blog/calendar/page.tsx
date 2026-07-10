"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, Circle } from "lucide-react";
import type { BlogPost } from "@/types/blog";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const STATUS_DOT: Record<string, string> = {
  Published: "bg-emerald-400",
  Scheduled: "bg-orange-400",
  Approved: "bg-blue-400",
  "In Review": "bg-yellow-400",
  "AI Generated": "bg-purple-400",
  Draft: "bg-muted",
  Archived: "bg-muted/40",
};

export default function BlogCalendarPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts || []); setLoading(false); });
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Map posts to day numbers
  const postsByDay: Record<number, BlogPost[]> = {};
  posts.forEach((post) => {
    const dateStr = post.publishedAt || post.updatedAt;
    if (!dateStr) return;
    const d = new Date(dateStr);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!postsByDay[day]) postsByDay[day] = [];
      postsByDay[day].push(post);
    }
  });

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const cells: (null | number)[] = [
    ...Array.from({ length: firstDay }).map(() => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-mono text-foreground">Content Calendar</h1>
          <p className="text-sm text-muted mt-1">Visualise your publishing schedule.</p>
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

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-black font-mono text-foreground">
            {MONTHS[month]} {year}
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg border border-border/15 bg-surface/20 hover:bg-surface/40 text-muted hover:text-foreground transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => { setYear(new Date().getFullYear()); setMonth(new Date().getMonth()); }} className="px-3 py-1.5 rounded-lg border border-border/15 bg-surface/20 hover:bg-surface/40 text-xs font-mono text-muted hover:text-foreground transition-all">
            Today
          </button>
          <button onClick={nextMonth} className="p-2 rounded-lg border border-border/15 bg-surface/20 hover:bg-surface/40 text-muted hover:text-foreground transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      {loading ? (
        <p className="text-sm text-muted font-mono">Loading…</p>
      ) : (
        <div className="border border-border/10 rounded-xl overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border/10">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div key={d} className="py-3 text-center text-xs font-mono text-muted uppercase tracking-wider bg-surface/20">
                {d}
              </div>
            ))}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              const dayPosts = day ? (postsByDay[day] || []) : [];
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              return (
                <div
                  key={idx}
                  className={`min-h-[90px] p-2 border-r border-b border-border/8 last:border-r-0 ${
                    day ? "bg-background" : "bg-surface/5"
                  } ${isToday ? "bg-primary/5 border-primary/15" : ""}`}
                >
                  {day && (
                    <>
                      <p className={`text-xs font-mono mb-1.5 ${isToday ? "text-primary font-bold" : "text-muted/60"}`}>
                        {day}
                      </p>
                      <div className="flex flex-col gap-1">
                        {dayPosts.slice(0, 3).map((post) => (
                          <Link
                            key={post.id}
                            href={`/admin/blog/${post.id}`}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface/40 hover:bg-surface/70 transition-colors group"
                          >
                            <Circle className={`w-1.5 h-1.5 rounded-full shrink-0 fill-current ${STATUS_DOT[post.status] || "text-muted"}`} />
                            <span className="text-xs font-mono text-foreground/70 truncate group-hover:text-foreground">
                              {post.title}
                            </span>
                          </Link>
                        ))}
                        {dayPosts.length > 3 && (
                          <p className="text-xs font-mono text-muted">+{dayPosts.length - 3} more</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(STATUS_DOT).map(([status, dotClass]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${dotClass}`} />
            <span className="text-xs font-mono text-muted">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
