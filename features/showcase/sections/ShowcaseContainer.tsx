"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterBar } from "@/components/showcase/filters/FilterBar";
import { ProjectCard } from "@/components/showcase/cards/ProjectCard";
import { EmptyState } from "@/components/showcase/layout/EmptyState";
import type { Project } from "@/types/project";
import { normalizeCategory } from "@/lib/categories";

interface ShowcaseContainerProps {
  initialProjects: Project[];
  categories: string[];
}

export function ShowcaseContainer({ initialProjects, categories }: ShowcaseContainerProps) {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSort, setSelectedSort] = useState("featured");

  const categoriesWithCount = useMemo(() => {
    return categories.map((cat) => {
      const normCat = normalizeCategory(cat);
      return {
        name: cat,
        count: initialProjects.filter(
          (p) => normalizeCategory(p.category || "") === normCat
        ).length,
      };
    });
  }, [categories, initialProjects]);

  const sortedProjects = useMemo(() => {
    let filtered = [...initialProjects];

    const filterNormalized = normalizeCategory(selectedFilter);
    if (filterNormalized !== "all" && filterNormalized !== "") {
      filtered = filtered.filter(
        (p) => normalizeCategory(p.category || "") === filterNormalized
      );
    }

    const sorted = [...filtered];
    switch (selectedSort) {
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
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          const aVal = a.featuredOrder ?? a.order ?? 999;
          const bVal = b.featuredOrder ?? b.order ?? 999;
          return aVal - bVal;
        });
        break;
    }

    return sorted;
  }, [initialProjects, selectedFilter, selectedSort]);

  return (
    <div className="flex flex-col gap-16">
      <FilterBar
        categories={categoriesWithCount}
        activeFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        activeSort={selectedSort}
        onSortChange={setSelectedSort}
      />

      <AnimatePresence mode="popLayout">
        {sortedProjects.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-12 md:gap-16 lg:gap-24"
          >
            {sortedProjects.map((project, i) => (
              <motion.div
                key={project.id ?? project.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                className="h-full"
              >
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
          >
            <EmptyState
              title="No projects found."
              message="We are constantly working on new artifacts. Check back soon or view our other works."
              actionText="View All Projects"
              onAction={() => {
                setSelectedFilter("All");
                setSelectedSort("featured");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
