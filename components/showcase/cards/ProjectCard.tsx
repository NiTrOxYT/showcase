"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/types/project";
import { showcaseVariants } from "@/animations/variants/showcase";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Magnetic } from "@/components/motion/Magnetic";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      variants={showcaseVariants.cardReveal}
      className="group relative flex flex-col justify-between transition-all duration-700 ease-out py-6 border-b border-border/10 last:border-b-0 md:border-0 md:bg-surface/5 md:p-6 md:rounded-2xl md:border md:border-border/25 md:shadow-sm lg:bg-transparent lg:p-0 lg:rounded-none lg:border-0 lg:border-b lg:border-border/10 lg:py-8 lg:last:border-b-0 h-full"
    >
      <Link href={`/showcase/${project.slug}`} className="block w-full h-full">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-12 items-stretch lg:items-center h-full">
          {/* Cover image with grayscale shift */}
          <div className="w-full lg:col-span-6 aspect-[16/10] overflow-hidden relative rounded-xl border border-border/25 bg-surface/5">
            <Image
              src={project.thumbnail}
              alt={project.thumbnailAlt || project.title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover filter grayscale contrast-[1.1] brightness-[0.85] transition-all duration-[1200ms] ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Context Details */}
          <div className="w-full lg:col-span-6 flex flex-col gap-4 lg:gap-5 justify-center flex-1">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-xs text-primary font-bold">
                {"//"} {project.category}
              </span>
              <span className="text-[11px] text-muted/65 tracking-widest uppercase font-medium">
                {project.platform}
              </span>
            </div>

            <Heading level={3} className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tightest leading-tight">
              {project.title}
            </Heading>

            <Text className="text-muted/80 text-sm md:text-base leading-relaxed max-w-xl">
              {project.shortDescription}
            </Text>

            <div className="flex flex-wrap gap-x-6 gap-y-2 py-2">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted/40 font-bold">[ Client ]</span>
                <span className="font-sans text-xs text-foreground/80 font-medium">{project.client}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted/40 font-bold">[ Technologies ]</span>
                <span className="font-sans text-xs text-foreground/80 font-medium">
                  {project.technologies.slice(0, 3).map((t) => t.name).join(" · ")}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Magnetic strength={0.2}>
                <span className="font-sans text-xs uppercase tracking-widest text-foreground group-hover:text-primary border-b border-foreground/30 group-hover:border-primary pb-1 transition-all duration-300 ease-out inline-block">
                  View Project
                </span>
              </Magnetic>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
