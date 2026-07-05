"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterBar } from "@/components/showcase/filters/FilterBar";
import { ProjectCard } from "@/components/showcase/cards/ProjectCard";
import { EmptyState } from "@/components/showcase/layout/EmptyState";
import type { Project } from "@/types/project";
import { showcaseVariants } from "@/animations/variants/showcase";

interface ShowcaseContainerProps {
  initialProjects: Project[];
  categories: string[];
}

export function ShowcaseContainer({ initialProjects, categories }: ShowcaseContainerProps) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("featured");

  const categoriesWithCount = useMemo(() => {
    return categories.map((cat) => ({
      name: cat,
      count: initialProjects.filter(
        (p) => p.category.toLowerCase() === cat.toLowerCase() || p.type.toLowerCase() === cat.toLowerCase()
      ).length,
    }));
  }, [categories, initialProjects]);

  const processedProjects = useMemo(() => {
    let result = [...initialProjects];

    if (filter !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === filter.toLowerCase() || p.type.toLowerCase() === filter.toLowerCase()
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
          const aVal = a.featuredOrder ?? a.order;
          const bVal = b.featuredOrder ?? b.order;
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

      <AnimatePresence mode="popLayout">
        {processedProjects.length > 0 ? (
          <motion.div
            layout
            variants={showcaseVariants.staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-16 md:gap-24"
          >
            {processedProjects.map((project) => (
              <motion.div key={project.id} layout>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
          >
            <EmptyState
              title="No projects found"
              message={`We couldn't find any projects matching the "${filter}" filter. Try checking another category.`}
              actionText="Reset Filters"
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
