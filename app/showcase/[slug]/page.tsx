import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Navbar } from "@/features/navigation/Navbar";
import { Footer } from "@/features/navigation/Footer";
import { ContactInvite } from "@/features/contact/ContactInvite";
import { ProjectHero } from "@/components/showcase/ProjectHero";
import { TechStack } from "@/components/showcase/typography/TechStack";
import { ProjectGallery } from "@/components/showcase/gallery/ProjectGallery";
import { ProjectCard } from "@/components/showcase/cards/ProjectCard";
import { ProjectNavigationListener } from "@/features/showcase/components/ProjectNavigationListener";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { showcaseRepository } from "@/services/showcaseRepository";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = showcaseRepository.getProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = showcaseRepository.getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.seoTitle || project.title} | ANNEX`,
    description: project.seoDescription || project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.ogImage ? [{ url: project.ogImage }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = showcaseRepository.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Get dynamic pagination targets
  const allProjects = showcaseRepository.getProjects();
  const currentIdx = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : null;
  const nextProject = currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : null;

  // Get related project cards
  const relatedProjects = showcaseRepository.getRelatedProjects(slug, 2);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <ProjectNavigationListener
        prevSlug={prevProject ? prevProject.slug : null}
        nextSlug={nextProject ? nextProject.slug : null}
      />
      <main className="overflow-x-hidden w-full max-w-full">
        {/* Cinematic Cover Header */}
        <ProjectHero project={project} />

        {/* Project Overview */}
        <Section className="py-24 bg-background border-t border-border/10">
          <Container>
            <Grid cols={1} colsMd={12} gap={12}>
              {/* Left Column: Scope details */}
              <div className="md:col-span-7 flex flex-col gap-6">
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ Overview ]</span>
                <Heading level={2} className="text-3xl md:text-4xl font-bold tracking-tightest">
                  The Product Vision.
                </Heading>
                <Text className="text-muted/80 text-sm md:text-base leading-relaxed">
                  {project.fullDescription}
                </Text>

                {/* Scope details */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/10 mt-6">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted/50 font-bold">[ Services ]</span>
                    <ul className="flex flex-col gap-1">
                      {project.services.map((item) => (
                        <li key={item} className="font-sans text-xs text-foreground/80">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted/50 font-bold">[ Deliverables ]</span>
                    <ul className="flex flex-col gap-1">
                      {project.deliverables.map((item) => (
                        <li key={item} className="font-sans text-xs text-foreground/80">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Tech Stack */}
              <div className="md:col-span-5 flex flex-col gap-6 md:border-l md:border-border/10 md:pl-12">
                <span className="font-mono text-xs text-muted uppercase tracking-widest">[ Stack Architectures ]</span>
                <TechStack technologies={project.technologies} />

                {/* External Actions */}
                <div className="flex flex-wrap gap-6 pt-6">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-widest px-6 py-2.5 rounded-full border border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                    >
                      Visit Product
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-widest px-6 py-2.5 rounded-full border border-border hover:border-foreground transition-all duration-300 text-muted hover:text-foreground"
                    >
                      GitHub Repo
                    </a>
                  )}
                </div>
              </div>
            </Grid>
          </Container>
        </Section>

        {/* Dynamic Gallery Mockups Grid */}
        {project.gallery && project.gallery.length > 0 && (
          <Section className="py-24 bg-background/30 border-t border-border/10">
            <Container className="max-w-4xl">
              <Stack gap={16}>
                <div className="text-center">
                  <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ Gallery Mockups ]</span>
                  <Heading level={2} className="text-3xl md:text-4xl font-bold tracking-tightest mt-2">
                    High-Fidelity Renders
                  </Heading>
                </div>
                <ProjectGallery gallery={project.gallery} />
              </Stack>
            </Container>
          </Section>
        )}

        {/* Testimonial / Results fold */}
        {project.testimonial && (
          <Section className="py-24 border-t border-border/10 bg-background/50">
            <Container className="max-w-3xl">
              <Stack gap={6} className="text-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                  [ Partner Feedback ]
                </span>
                <blockquote className="py-4">
                  <p className="font-display text-xl md:text-3xl italic text-foreground/95 leading-normal">
                    &ldquo;{project.testimonial.quote}&rdquo;
                  </p>
                  <cite className="block font-sans text-xs uppercase tracking-widest text-muted mt-6 not-italic font-bold">
                    — {project.testimonial.author} · <span className="font-normal text-muted/60">{project.testimonial.role}</span>
                  </cite>
                </blockquote>
              </Stack>
            </Container>
          </Section>
        )}

        {/* Next/Prev Navigation controls */}
        <Section className="py-16 border-t border-border/10 bg-background">
          <Container>
            <div className="flex justify-between items-center">
              {prevProject ? (
                <Link
                  href={`/showcase/${prevProject.slug}`}
                  className="group flex flex-col items-start gap-1"
                >
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 group-hover:text-primary transition-colors">
                    ← Previous Project [Left]
                  </span>
                  <span className="font-display text-sm md:text-base font-bold text-foreground">
                    {prevProject.title}
                  </span>
                </Link>
              ) : (
                <div className="opacity-0 pointer-events-none" />
              )}

              <Link
                href="/showcase"
                className="font-mono text-[10px] uppercase tracking-widest text-muted hover:text-foreground border-b border-border/40 pb-1 hover:border-foreground transition-all duration-300"
              >
                All Projects
              </Link>

              {nextProject ? (
                <Link
                  href={`/showcase/${nextProject.slug}`}
                  className="group flex flex-col items-end gap-1"
                >
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted/50 group-hover:text-primary transition-colors">
                    Next Project [Right] →
                  </span>
                  <span className="font-display text-sm md:text-base font-bold text-foreground">
                    {nextProject.title}
                  </span>
                </Link>
              ) : (
                <div className="opacity-0 pointer-events-none" />
              )}
            </div>
          </Container>
        </Section>

        {/* Related Projects grid */}
        {relatedProjects.length > 0 && (
          <Section className="py-24 border-t border-border/10 bg-background/25">
            <Container>
              <Stack gap={12}>
                <Heading level={2} className="text-3xl md:text-4xl font-bold tracking-tightest">
                  Related Projects
                </Heading>
                <Grid cols={1} colsMd={2} gap={10}>
                  {relatedProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </Grid>
              </Stack>
            </Container>
          </Section>
        )}

        {/* Standard CTA invite */}
        <ContactInvite />
      </main>
      <Footer />
    </>
  );
}
