import React from "react";
import { motion } from "framer-motion";
import { showcaseVariants } from "@/animations/variants/showcase";
import { cn } from "@/lib/cn";

export interface FilterCategory {
  name: string;
  count: number;
}

interface FilterBarProps {
  categories: FilterCategory[];
  activeFilter: string;
  onFilterChange: (category: string) => void;
  activeSort?: string;
  onSortChange?: (sort: string) => void;
}

export function FilterBar({
  categories,
  activeFilter,
  onFilterChange,
  activeSort = "featured",
  onSortChange,
}: FilterBarProps) {
  const allFilters = [
    { name: "All", count: categories.reduce((sum, c) => sum + c.count, 0) },
    ...categories,
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-border/10">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {allFilters.map((category) => {
          const isActive = activeFilter.toLowerCase() === category.name.toLowerCase();
          return (
            <button
              key={category.name}
              onClick={() => onFilterChange(category.name)}
              className={cn(
                "relative px-4 py-2 text-xs md:text-sm font-mono uppercase tracking-wider transition-colors duration-300 focus-visible:outline-none",
                isActive ? "text-background" : "text-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterPill"
                  transition={showcaseVariants.filterTransition}
                  className="absolute inset-0 bg-primary rounded-full z-0"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {category.name}
                <span className={cn(
                  "text-[9px] font-mono",
                  isActive ? "text-background/80" : "text-muted/60"
                )}>
                  ({category.count})
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Sorting selectors */}
      {onSortChange && (
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted/60">{"// Sort:"}</span>
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground bg-transparent border-none focus:outline-none cursor-pointer"
          >
            <option value="featured" className="bg-background text-foreground">Featured</option>
            <option value="newest" className="bg-background text-foreground">Newest</option>
            <option value="oldest" className="bg-background text-foreground">Oldest</option>
            <option value="alphabetical" className="bg-background text-foreground">Alphabetical</option>
          </select>
        </div>
      )}
    </div>
  );
}
