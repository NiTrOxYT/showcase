import React from "react";
import Image from "next/image";
import type { Project } from "@/types/project";
import { Heading } from "@/components/typography/Heading";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";
import { safeSrc } from "@/lib/images";

interface ProjectHeroProps {
  project: Project;
  breadcrumbs?: React.ReactNode;
}

export function ProjectHero({ project, breadcrumbs }: ProjectHeroProps) {
  return (
    <section className="relative min-h-[75vh] flex items-end pt-40 pb-20 overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <Image
          src={safeSrc(project.coverImage)}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover filter brightness-[0.4] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <Stack gap={6} className="lg:col-span-8">
            {breadcrumbs}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
                {project.category}
              </span>
              <span className="font-mono text-xs text-muted/60 tracking-wider">
                {project.completionDate}
              </span>
            </div>
            <Heading level={1} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tightest leading-[1.1]">
              {project.title}
            </Heading>
            <p className="font-sans text-lg md:text-xl text-muted/90 max-w-2xl leading-relaxed">
              {project.subtitle}
            </p>
          </Stack>

          <div className="lg:col-span-4 grid grid-cols-2 gap-x-8 gap-y-6 border-l border-border/20 pl-8">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">[ Client ]</span>
              <span className="font-sans text-sm text-foreground/80 font-medium">{project.client}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">[ Industry ]</span>
              <span className="font-sans text-sm text-foreground/80 font-medium">{project.industry}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">[ Platform ]</span>
              <span className="font-sans text-sm text-foreground/80 font-medium">{project.platform}</span>
            </div>
            {project.duration && (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 font-bold">[ Duration ]</span>
                <span className="font-sans text-sm text-foreground/80 font-medium">{project.duration}</span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
