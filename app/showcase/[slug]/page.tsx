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
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { navigationRepository } from "@/services/navigationRepository";
import { constructMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getProjectBreadcrumb } from "@/lib/seo/breadcrumbs";
import { getCaseStudySchema } from "@/lib/seo/structured-data";
import { CheckCircle2, Award, Clock, ArrowRight, Download } from "lucide-react";
import type { Project } from "@/types/project";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await showcaseRepository.getProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await showcaseRepository.getProjectBySlug(slug);

  if (!project) {
    return constructMetadata({
      title: "Project Not Found",
      path: `/showcase/${slug}`,
    });
  }

  return constructMetadata({
    title: project.seoTitle || `${project.title} Case Study | ANNEX`,
    description: project.seoDescription || project.shortDescription,
    image: project.ogImage || project.coverImage || undefined,
    path: `/showcase/${project.slug}`,
    type: "article",
    category: project.category,
    technologies: project.technologies,
    services: project.services,
    tags: project.deliverables,
    publishedTime: project.completionDate ? new Date(project.completionDate).toISOString() : undefined,
    modifiedTime: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined,
  });
}

// Calculate reading time
function calculateReadingTime(project: Project): number {
  const textParts = [
    project.fullDescription,
    project.businessProblem,
    project.projectGoal,
    project.research,
    project.strategy,
    project.designProcess,
    project.developmentProcess,
  ].filter(Boolean);
  const wordCount = textParts.join(" ").split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Weighted Related Content Algorithm
function getWeightedRecommendations(currentProject: Project, allProjects: Project[], limit: number = 2): Project[] {
  const scored = allProjects
    .filter((p) => p.slug !== currentProject.slug && p.status === "Published")
    .map((p) => {
      let score = 0;
      if (p.category === currentProject.category) score += 5;
      if (p.industry && currentProject.industry && p.industry.toLowerCase() === currentProject.industry.toLowerCase()) score += 4;

      const currentTechs = currentProject.technologies.map(t => t.name.toLowerCase());
      const otherTechs = p.technologies.map(t => t.name.toLowerCase());
      const techIntersection = currentTechs.filter(t => t && otherTechs.includes(t));
      score += techIntersection.length * 2;

      const currentServices = currentProject.services.map(s => s.toLowerCase());
      const otherServices = p.services.map(s => s.toLowerCase());
      const serviceIntersection = currentServices.filter(s => otherServices.includes(s));
      score += serviceIntersection.length * 3;

      return { project: p, score };
    });

  return scored
    .sort((a, b) => b.score - a.score)
    .map((s) => s.project)
    .slice(0, limit);
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const [project, allProjects, settings, headerNav, footerNav] = await Promise.all([
    showcaseRepository.getProjectBySlug(slug),
    showcaseRepository.getProjects(),
    SettingsRepository.getAll(),
    navigationRepository.getNavigation("header"),
    navigationRepository.getNavigation("footer"),
  ]);

  if (!project) {
    notFound();
  }

  const relatedProjects = getWeightedRecommendations(project, allProjects, 2);

  const currentIdx = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : null;
  const nextProject = currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : null;

  const socialLinks = [
    { label: "GitHub", href: settings.social.github },
    { label: "LinkedIn", href: settings.social.linkedin },
    { label: "Instagram", href: settings.social.instagram },
  ];

  const readingTime = calculateReadingTime(project);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getCaseStudySchema(project)),
        }}
      />
      <ScrollProgress />
      <Navbar
        navLinks={headerNav}
        logoUrl={settings.branding.logoUrl}
        contactEmail={settings.contact.email}
        contactAddress={settings.contact.address}
        theme="dark"
      />
      <ProjectNavigationListener
        prevSlug={prevProject ? prevProject.slug : null}
        nextSlug={nextProject ? nextProject.slug : null}
      />
      <main className="overflow-x-hidden w-full max-w-full text-foreground bg-background select-none">
        
        {/* Project Cinematic Hero */}
        <ProjectHero
          project={project}
          breadcrumbs={
            <Breadcrumbs items={getProjectBreadcrumb(project.title, project.slug)} />
          }
        />

        {/* Reading indicators panel */}
        <div className="border-y border-border/10 bg-surface/5 py-4">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>ESTIMATED READING TIME: {readingTime} MIN</span>
              </div>
              <div className="flex items-center gap-6">
                <span>CLIENT SITE: <a href={project.clientWebsite || "#"} className="text-primary hover:underline">{project.clientWebsite || "N/A"}</a></span>
              </div>
            </div>
          </Container>
        </div>

        {/* Bento Case Study Layout */}
        <Section className="py-24">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Sticky TOC Widget */}
              <div className="lg:col-span-3 hidden lg:block">
                <div className="sticky top-28 flex flex-col gap-6">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">[ Case Index ]</span>
                  <nav className="flex flex-col gap-3 font-mono text-xs text-muted">
                    <a href="#overview" className="hover:text-foreground transition-colors">01. OVERVIEW</a>
                    <a href="#challenge" className="hover:text-foreground transition-colors">02. THE CHALLENGE</a>
                    <a href="#strategy" className="hover:text-foreground transition-colors">03. STRATEGY & IA</a>
                    {project.beforeAfter && project.beforeAfter.length > 0 && (
                      <a href="#comparisons" className="hover:text-foreground transition-colors">04. BEFORE / AFTER</a>
                    )}
                    <a href="#design" className="hover:text-foreground transition-colors">05. DESIGN PRINCIPLES</a>
                    <a href="#development" className="hover:text-foreground transition-colors">06. ARCHITECTURE</a>
                    {project.metrics && project.metrics.length > 0 && (
                      <a href="#results" className="hover:text-foreground transition-colors">07. IMPACT METRICS</a>
                    )}
                    {project.faq && project.faq.length > 0 && (
                      <a href="#faq" className="hover:text-foreground transition-colors">08. FAQS</a>
                    )}
                  </nav>
                </div>
              </div>

              {/* Main Content Pane */}
              <div className="lg:col-span-9 flex flex-col gap-16">
                
                {/* 1. Overview */}
                <div id="overview" className="flex flex-col gap-6 scroll-mt-24">
                  <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ 01. Overview ]</span>
                  <Heading level={2} className="text-3xl font-black tracking-tightest">
                    The Product Vision.
                  </Heading>
                  <Text className="text-muted/80 leading-relaxed text-sm md:text-base">
                    {project.fullDescription}
                  </Text>
                  {project.overview && (
                    <Text className="text-muted/80 leading-relaxed text-sm md:text-base border-t border-border/10 pt-4">
                      {project.overview}
                    </Text>
                  )}
                </div>

                {/* 2. Business Challenge */}
                <div id="challenge" className="flex flex-col gap-6 border-t border-border/10 pt-16 scroll-mt-24">
                  <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ 02. The Challenge ]</span>
                  <Heading level={2} className="text-3xl font-black tracking-tightest">
                    Business Problem & Core Goal.
                  </Heading>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3 bg-surface/5 border border-border/10 p-6 rounded-2xl">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">The Pain Point</h4>
                      <Text className="text-muted text-xs leading-relaxed">
                        {project.businessProblem || "Legacy workflows lacked standard performance optimization, resulting in elevated user drop-off rates and suboptimal indexing capabilities."}
                      </Text>
                    </div>
                    <div className="flex flex-col gap-3 bg-surface/5 border border-border/10 p-6 rounded-2xl">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">The Objective</h4>
                      <Text className="text-muted text-xs leading-relaxed">
                        {project.projectGoal || "Establish a high-performance modern user landing flow ensuring swift page speeds, secure database queries, and enhanced SEO footprint."}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* 3. Research & Strategy */}
                <div id="strategy" className="flex flex-col gap-6 border-t border-border/10 pt-16 scroll-mt-24">
                  <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ 03. Research & Strategy ]</span>
                  <Heading level={2} className="text-3xl font-black tracking-tightest">
                    UX Audits & Indexing Architecture.
                  </Heading>
                  <Text className="text-muted/80 leading-relaxed text-sm">
                    {project.research || "We conducted exhaustive user feedback session groups, analyzed competitor design methodologies, and built high-fidelity flowcharts to map out the target user path."}
                  </Text>
                  {project.strategy && (
                    <Text className="text-muted/80 leading-relaxed text-sm border-t border-border/10 pt-4">
                      {project.strategy}
                    </Text>
                  )}
                </div>

                {/* Before & After comparison slide */}
                {project.beforeAfter && project.beforeAfter.length > 0 && (
                  <div id="comparisons" className="flex flex-col gap-6 border-t border-border/10 pt-16 scroll-mt-24">
                    <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ 04. Before / After ]</span>
                    <Heading level={2} className="text-3xl font-black tracking-tightest">
                      Visual & Performance Redesign.
                    </Heading>
                    <div className="flex flex-col gap-8">
                      {project.beforeAfter.map((ba, idx) => (
                        <div key={idx} className="bg-surface/5 border border-border/10 p-6 rounded-2xl flex flex-col gap-6">
                          <div>
                            <h4 className="text-lg font-bold text-foreground">{ba.title}</h4>
                            <p className="text-xs text-muted mt-1">{ba.description}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-rose-400">Before</span>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={ba.beforeImage} alt="Legacy layout screenshot" className="w-full h-auto aspect-video object-cover rounded-xl border border-border/10" />
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">After Redesign</span>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={ba.afterImage} alt="New layout screenshot" className="w-full h-auto aspect-video object-cover rounded-xl border border-border/10" />
                            </div>
                          </div>
                          {ba.impact && (
                            <div className="border-t border-border/10 pt-4 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">BUSINESS IMPACT: {ba.impact}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Design Principles */}
                <div id="design" className="flex flex-col gap-6 border-t border-border/10 pt-16 scroll-mt-24">
                  <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ 05. Design Principles ]</span>
                  <Heading level={2} className="text-3xl font-black tracking-tightest">
                    Aesthetics, Accessibility & Visual Systems.
                  </Heading>
                  <Text className="text-muted/80 leading-relaxed text-sm">
                    {project.designProcess || "Utilizing responsive grids, warm dark interfaces, typographic contrast scales, and accessible color components meeting WCAG AA requirements."}
                  </Text>
                </div>

                {/* 6. Development & Architecture */}
                <div id="development" className="flex flex-col gap-6 border-t border-border/10 pt-16 scroll-mt-24">
                  <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ 06. Architecture ]</span>
                  <Heading level={2} className="text-3xl font-black tracking-tightest">
                    Engineering, Infrastructure & Security.
                  </Heading>
                  <Text className="text-muted/80 leading-relaxed text-sm">
                    {project.developmentProcess || "NextJS core architecture rendering Server Components for ultra-fast LCP, static routes compilation, and Supabase database connection layers."}
                  </Text>

                  {/* Tech stack badge grid */}
                  <div className="mt-4 pt-6 border-t border-border/10">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold block mb-4">Technologies utilized:</span>
                    <TechStack technologies={project.technologies} />
                  </div>
                </div>

                {/* 7. Results Dashboard */}
                {project.metrics && project.metrics.length > 0 && (
                  <div id="results" className="flex flex-col gap-6 border-t border-border/10 pt-16 scroll-mt-24">
                    <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ 07. Impact Metrics ]</span>
                    <Heading level={2} className="text-3xl font-black tracking-tightest">
                      KPI performance & outcomes.
                    </Heading>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {project.metrics.map((metric, idx) => (
                        <div key={idx} className="bg-surface/5 border border-border/10 p-6 rounded-2xl flex flex-col gap-2">
                          <span className="font-mono text-3xl font-black text-primary tracking-tight">
                            {metric.value}
                            {metric.unit && <span className="text-lg font-bold">{metric.unit}</span>}
                          </span>
                          <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold mt-1">{metric.label}</span>
                          {metric.improvement && (
                            <span className="text-[10px] font-mono text-emerald-400 font-bold mt-0.5">({metric.improvement})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Downloadable Assets */}
                {project.downloadableAssets && project.downloadableAssets.length > 0 && (
                  <div className="bg-surface/5 border border-border/10 p-6 rounded-2xl flex flex-col gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-200 font-bold">Case Study Assets Available</h4>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {project.downloadableAssets.map((asset, idx) => (
                        <a
                          key={idx}
                          href={asset.url}
                          className="inline-flex items-center gap-2 bg-background border border-border/20 hover:border-foreground hover:bg-surface/30 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200"
                        >
                          <Download className="w-3.5 h-3.5 text-primary" />
                          <span>{asset.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. FAQs fold */}
                {project.faq && project.faq.length > 0 && (
                  <div id="faq" className="flex flex-col gap-6 border-t border-border/10 pt-16 scroll-mt-24">
                    <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">[ 08. FAQs ]</span>
                    <Heading level={2} className="text-3xl font-black tracking-tightest">
                      Frequently Asked Questions.
                    </Heading>
                    <div className="flex flex-col gap-4">
                      {project.faq.map((item, idx) => (
                        <details key={idx} className="group bg-surface/5 border border-border/10 rounded-xl p-5 [&_summary::-webkit-details-marker]:hidden">
                          <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                            <span className="text-xs font-bold text-neutral-200">{item.question}</span>
                            <span className="text-xs font-mono text-muted group-open:rotate-180 transition-transform duration-200">↓</span>
                          </summary>
                          <p className="text-xs text-muted leading-relaxed mt-3 pt-3 border-t border-border/5">
                            {item.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </Container>
        </Section>

        {/* Cinematic Gallery Mockups Grid */}
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

        {/* Dynamic Related Projects fold */}
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

        {/* Dynamic Related Services Recommendation panel */}
        {project.services && project.services.length > 0 && (
          <Section className="py-24 border-t border-border/10 bg-background/40">
            <Container>
              <div className="flex flex-col gap-8">
                <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold block">[ Recommended Services ]</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.services.map((serviceName, idx) => (
                    <div key={idx} className="bg-surface/5 border border-border/10 p-6 rounded-2xl flex items-center justify-between hover:border-foreground/30 transition-all duration-300">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-neutral-200">{serviceName}</span>
                        <span className="text-[10px] text-muted font-mono mt-1">ANNEX CORE Service Page capability</span>
                      </div>
                      <Link
                        href={`/services/${serviceName.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border/20 group-hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </Section>
        )}

        <ContactInvite />
      </main>
      <Footer
        navLinks={footerNav}
        logoUrl={settings.branding.logoUrl}
        contactEmail={settings.contact.email}
        contactAddress={settings.contact.address}
        closingCopy={settings.footer.finalClosingCopy}
        copyrightText={settings.footer.copyrightText}
        socialLinks={socialLinks}
      />
    </>
  );
}
