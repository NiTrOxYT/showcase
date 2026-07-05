// Server Component — data fetched at request time, no client re-render mismatch

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { showcaseRepository } from "@/services/showcaseRepository";
import { MotionSection } from "@/components/motion/MotionSection";
import { Magnetic } from "@/components/motion/Magnetic";

export function ShowcaseFeatured() {
  const featuredProjects = showcaseRepository.getProjects("all", "featured").slice(0, 2);

  return (
    <Section id="showcase" className="border-t border-border/20 bg-background relative overflow-hidden py-32 md:py-48">
      <Container>
        <Stack gap={24}>
          <MotionSection as="div" variant="rise" className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/10 pb-8">
            <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl max-w-2xl tracking-tightest leading-none">
              Selected artifacts.
            </Heading>
            <Text className="text-muted/80 max-w-sm font-sans text-sm md:text-base leading-relaxed">
              Explore bespoke digital systems designed and built for brands demanding absolute visual and technical performance.
            </Text>
          </MotionSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-12 md:gap-16 lg:gap-48">
            {featuredProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={project.id}
                  className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-20 items-stretch lg:items-center group"
                >
                  {/* Image Block */}
                  <div
                    className={`w-full lg:col-span-7 aspect-[16/10] overflow-hidden rounded-xl bg-surface/10 border border-border/25 relative ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <Link href={`/showcase/${project.slug}`} className="block w-full h-full">
                      <Image
                        src={project.coverImage}
                        alt={project.thumbnailAlt || project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 800px"
                        className="object-cover filter grayscale contrast-[1.1] brightness-[0.85] transition-all duration-[1200ms] ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
                    </Link>
                  </div>

                  {/* Content Block */}
                  <div
                    className={`w-full lg:col-span-5 flex flex-col justify-center ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <Stack gap={6}>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-primary font-bold">
                          0{index + 1} {"//"}
                        </span>
                        <span className="font-sans text-xs text-muted/65 uppercase tracking-widest">
                          {project.category}
                        </span>
                      </div>

                      <Heading level={3} className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tightest leading-tight">
                        {project.title}
                      </Heading>

                      <Text className="text-muted/80 text-sm md:text-base leading-relaxed">
                        {project.shortDescription}
                      </Text>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border/10 py-4 my-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-muted/40 font-bold">[ Client ]</span>
                          <span className="font-sans text-xs text-foreground/80 font-medium">{project.client}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-muted/40 font-bold">[ Deliverables ]</span>
                          <span className="font-sans text-xs text-foreground/80 font-medium">{project.deliverables.slice(0, 2).join(" · ")}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Magnetic strength={0.25}>
                          <Link
                            href={`/showcase/${project.slug}`}
                            className="font-sans text-xs uppercase tracking-widest text-foreground hover:text-primary border-b border-foreground/30 hover:border-primary pb-1 transition-all duration-300 ease-out inline-block"
                          >
                            Explore Case Study
                          </Link>
                        </Magnetic>
                      </div>
                    </Stack>
                  </div>
                </div>
              );
            })}
          </div>
        </Stack>
      </Container>
    </Section>
  );
}
