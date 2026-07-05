import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Grid } from "@/components/layout/Grid";
import { mockProjects } from "@/data/mock/projects";
import Image from "next/image";

export function ShowcaseFeatured() {
  return (
    <Section id="showcase" className="border-t border-border/20 relative">
      <Container>
        <Stack gap={16}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl max-w-2xl tracking-tightest leading-none">
              Selected showcase entries.
            </Heading>
            <Text className="text-muted/80 max-w-sm font-sans text-sm md:text-base mb-1">
              Explore bespoke platforms built for clients demanding clean design and lightning execution.
            </Text>
          </div>

          <Grid cols={1} colsMd={2} gap={10}>
            {mockProjects.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-2xl border border-border/30 bg-surface/10 overflow-hidden flex flex-col justify-between hover:border-foreground/15 hover:bg-surface/20 transition-all duration-700 ease-out shadow-[0_16px_50px_rgba(0,0,0,0.6)]"
              >
                {/* Immersive Image Container */}
                <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-border/20">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover filter contrast-[1.15] brightness-[0.9] transition-transform duration-[1800ms] ease-out group-hover:scale-103 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                </div>

                {/* Details Panel */}
                <Stack gap={5} className="p-8 md:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                      {project.techStack[0]}
                    </span>
                    <span className="font-sans text-[11px] text-muted/70 tracking-wide font-medium">
                      {project.techStack.join(" · ")}
                    </span>
                  </div>
                  
                  <Heading level={3} className="text-2xl md:text-3xl font-bold tracking-tightest leading-tight">
                    {project.title}
                  </Heading>
                  
                  <Text className="text-muted/80 text-sm md:text-base leading-relaxed">
                    {project.description}
                  </Text>
                </Stack>
              </div>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
