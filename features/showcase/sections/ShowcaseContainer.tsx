"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterBar } from "@/components/showcase/filters/FilterBar";
import { ProjectCard } from "@/components/showcase/cards/ProjectCard";
import { EmptyState } from "@/components/showcase/layout/EmptyState";
import type { Project } from "@/types/project";
import { showcaseVariants } from "@/animations/variants/showcase";
import { normalizeCategory } from "@/services/showcaseRepository";

interface ShowcaseContainerProps {
  initialProjects: Project[];
  categories: string[];
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-red-500/30 rounded-xl bg-red-950/20 text-red-400 font-mono text-xs max-w-4xl mx-auto my-8">
          <h3 className="font-bold text-sm mb-2 text-red-500">// React Render Crash:</h3>
          <p className="mb-4 font-bold">{this.state.error?.message}</p>
          <pre className="whitespace-pre-wrap overflow-auto max-h-96 text-[10px] opacity-80 leading-relaxed bg-black/40 p-4 rounded-lg">
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}


export function ShowcaseContainer({ initialProjects, categories }: ShowcaseContainerProps) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("featured");

  const categoriesWithCount = useMemo(() => {
    return categories.map((cat) => {
      const normCat = normalizeCategory(cat);
      return {
        name: cat,
        count: initialProjects.filter(
          (p) => normalizeCategory(p.category || "") === normCat || normalizeCategory(p.type || "") === normCat
        ).length,
      };
    });
  }, [categories, initialProjects]);

  const processedProjects = useMemo(() => {
    let result = [...initialProjects];

    const normFilter = normalizeCategory(filter);
    if (normFilter !== "all" && normFilter !== "") {
      result = result.filter(
        (p) => normalizeCategory(p.category || "") === normFilter || normalizeCategory(p.type || "") === normFilter
      );
    }

    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime());
        break;
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "featured":
      default:
        result.sort((a, b) => {
          if (a.featured !== b.featured) {
            return a.featured ? -1 : 1;
          }
          const aVal = a.featuredOrder ?? a.order ?? 999;
          const bVal = b.featuredOrder ?? b.order ?? 999;
          return aVal - bVal;
        });
        break;
    }

    return result;
  }, [initialProjects, filter, sort]);

  return (
    <div className="flex flex-col gap-16">
      <FilterBar
        categories={categoriesWithCount}
        activeFilter={filter}
        onFilterChange={setFilter}
        activeSort={sort}
        onSortChange={setSort}
      />

      <ErrorBoundary>
        <AnimatePresence mode="popLayout">
          {processedProjects.length > 0 ? (
            <motion.div
              key="grid"
              layout
              variants={showcaseVariants.staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-12 md:gap-16 lg:gap-24"
            >
              {processedProjects.map((project) => (
                <motion.div key={project.id} layout className="h-full">
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              <EmptyState
                title="No projects available in this category yet."
                message="We are constantly working on new artifacts. Check back soon or view our other works."
                actionText="View All Projects"
                onAction={() => {
                  setFilter("All");
                  setSort("featured");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </div>
  );
}
