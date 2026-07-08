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

    const sorted = [...result];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => {
          const aTime = a.completionDate ? new Date(a.completionDate).getTime() : 0;
          const bTime = b.completionDate ? new Date(b.completionDate).getTime() : 0;
          return bTime - aTime;
        });
        break;
      case "oldest":
        sorted.sort((a, b) => {
          const aTime = a.completionDate ? new Date(a.completionDate).getTime() : 0;
          const bTime = b.completionDate ? new Date(b.completionDate).getTime() : 0;
          return aTime - bTime;
        });
        break;
      case "alphabetical":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "featured":
      default:
        sorted.sort((a, b) => {
          if (a.featured !== b.featured) {
            return a.featured ? -1 : 1;
          }
          const aVal = a.featuredOrder ?? a.order ?? 999;
          const bVal = b.featuredOrder ?? b.order ?? 999;
          return aVal - bVal;
        });
        break;
    }

    return sorted;
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

      <AnimatePresence mode="popLayout">
        {processedProjects.length > 0 ? (
          <motion.div
            key="grid"
            variants={showcaseVariants.staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-12 md:gap-16 lg:gap-24"
          >
            <AnimatePresence mode="popLayout">
              {processedProjects.map((project) => (
                <motion.div
                  key={project.id ?? project.slug}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
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
    </div>
  );
}
