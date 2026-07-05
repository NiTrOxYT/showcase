import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/types/project";
import { showcaseVariants } from "@/animations/variants/showcase";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      variants={showcaseVariants.cardReveal}
      className="group relative rounded-2xl border border-border/30 bg-surface/10 overflow-hidden flex flex-col justify-between hover:border-foreground/15 hover:bg-surface/20 transition-all duration-700 ease-out shadow-[0_16px_50px_rgba(0,0,0,0.6)]"
    >
      <Link href={`/showcase/${project.slug}`} className="block h-full">
        {/* Immersive Image Container */}
        <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-border/20">
          <Image
            src={project.thumbnail}
            alt={project.thumbnailAlt || project.title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover filter contrast-[1.15] brightness-[0.9] transition-transform duration-[1800ms] ease-out group-hover:scale-103 group-hover:brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
        </div>

        {/* Details Panel */}
        <div className="p-8 md:p-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
              {project.category}
            </span>
            <span className="font-sans text-[11px] text-muted/70 tracking-wide font-medium">
              {project.technologies.slice(0, 3).map((t) => t.name).join(" · ")}
            </span>
          </div>
          
          <Heading level={3} className="text-2xl md:text-3xl font-bold tracking-tightest leading-tight">
            {project.title}
          </Heading>
          
          <Text className="text-muted/80 text-sm md:text-base leading-relaxed">
            {project.shortDescription}
          </Text>
        </div>
      </Link>
    </motion.div>
  );
}
