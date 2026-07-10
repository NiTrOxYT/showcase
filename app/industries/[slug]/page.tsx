import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/typography/Heading";
import { Navbar } from "@/features/navigation/Navbar";
import { Footer } from "@/features/navigation/Footer";
import { ContactInvite } from "@/features/contact/ContactInvite";
import { ProjectCard } from "@/components/showcase/cards/ProjectCard";
import { showcaseRepository } from "@/services/showcaseRepository";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { navigationRepository } from "@/services/navigationRepository";
import { constructMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Briefcase } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return constructMetadata({
    title: `${industryName} Case Studies & Projects | ANNEX`,
    description: `Explore our featured premium case studies and digital products built for the ${industryName} industry.`,
    path: `/industries/${slug}`,
  });
}

export default async function IndustryTaxonomyPage({ params }: PageProps) {
  const { slug } = await params;
  const industryFormatted = slug.toLowerCase().replace(/-/g, " ");

  const [projects, settings, headerNav, footerNav] = await Promise.all([
    showcaseRepository.getProjects(),
    SettingsRepository.getAll(),
    navigationRepository.getNavigation("header"),
    navigationRepository.getNavigation("footer"),
  ]);

  const filteredProjects = projects.filter(
    (p) => p.status === "Published" && p.industry && p.industry.toLowerCase() === industryFormatted
  );

  if (filteredProjects.length === 0 && projects.length > 0) {
    notFound();
  }

  const socialLinks = [
    { label: "GitHub", href: settings.social.github },
    { label: "LinkedIn", href: settings.social.linkedin },
    { label: "Instagram", href: settings.social.instagram },
  ];

  return (
    <>
      <Navbar
        navLinks={headerNav}
        logoUrl={settings.branding.logoUrl}
        contactEmail={settings.contact.email}
        contactAddress={settings.contact.address}
        theme="dark"
      />
      <main className="overflow-x-hidden w-full max-w-full text-foreground bg-background select-none">
        
        {/* Custom Premium Hero fold */}
        <Section className="relative py-24 bg-gradient-to-b from-surface/5 to-transparent border-b border-border/10 overflow-hidden">
          <Container className="relative z-10">
            <Stack gap={6} className="max-w-2xl">
              <Breadcrumbs
                items={[
                  { name: "Showcase", href: "/showcase" },
                  { name: `Industry: ${slug.toUpperCase()}`, href: `/industries/${slug}` },
                ]}
              />
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                  [ Industry Focus ]
                </span>
              </div>
              <Heading level={1} className="text-4xl md:text-5xl font-black tracking-tightest mt-2">
                {industryFormatted.toUpperCase()} Products.
              </Heading>
              <p className="text-sm md:text-base text-muted leading-relaxed">
                Explore premium digital solutions, performance upgrades, and custom case studies crafted by ANNEX for the {industryFormatted} market.
              </p>
            </Stack>
          </Container>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30 pointer-events-none" />
        </Section>

        {/* Filtered Grid fold */}
        <Section className="py-24">
          <Container>
            <Grid cols={1} colsMd={2} gap={10}>
              {filteredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </Grid>
          </Container>
        </Section>

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
