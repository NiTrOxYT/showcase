import React from "react";
import type { Technology } from "@/types/project";

interface TechStackProps {
  technologies: Technology[];
}

export function TechStack({ technologies }: TechStackProps) {
  if (!technologies || technologies.length === 0) return null;

  const grouped = technologies.reduce((acc, tech) => {
    const cat = tech.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 py-4 border-b border-border/10">
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold sm:col-span-1 pt-0.5">
            [ {category} ]
          </span>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 sm:col-span-3">
            {items.map((tech) => (
              <div key={tech.name} className="flex items-center gap-1.5 group">
                {tech.website ? (
                  <a
                    href={tech.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-foreground/80 hover:text-foreground border-b border-transparent hover:border-foreground/30 pb-0.5 transition-all duration-300"
                  >
                    {tech.name}
                  </a>
                ) : (
                  <span className="font-sans text-sm text-foreground/85">
                    {tech.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
