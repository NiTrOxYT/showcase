import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Navbar } from "@/features/navigation/Navbar";
import { Footer } from "@/features/navigation/Footer";
import { ContactInvite } from "@/features/contact/ContactInvite";
import { ShowcaseContainer } from "@/features/showcase/sections/ShowcaseContainer";
import { showcaseRepository } from "@/services/showcaseRepository";

import { SettingsRepository } from "@/services/repositories/SettingsRepository";

export async function generateMetadata(): Promise<Metadata> {
  const seo = SettingsRepository.getModule("seo");
  return {
    title: seo.titleTemplate ? seo.titleTemplate.replace("%s", "Showcase") : "Showcase | ANNEX",
    description: seo.defaultDescription || "Bespoke digital platforms built for scale.",
  };
}

export default function ShowcasePage() {
  const initialProjects = showcaseRepository.getProjects();
  const categories = showcaseRepository.getUniqueCategories();

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden w-full max-w-full">
        {/* Showcase Hero Section */}
        <Section className="pt-40 pb-16 border-b border-border/10 bg-background/50">
          <Container>
            <Stack gap={6} className="max-w-3xl">
              <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
                [ Selected Artifacts ]
              </span>
              <Heading level={1} className="text-5xl md:text-7xl tracking-tightest leading-none">
                Bespoke digital products.
              </Heading>
              <Text className="text-muted/80 text-lg md:text-xl leading-relaxed">
                Explore a curated list of marketing platforms, telemetry dashboards, and ecommerce storefronts engineered for fast execution and high conversion.
              </Text>
            </Stack>
          </Container>
        </Section>

        {/* Dynamic Showcase List Grid */}
        <Section className="py-24 bg-background/25">
          <Container>
            <ShowcaseContainer
              initialProjects={initialProjects}
              categories={categories}
            />
          </Container>
        </Section>

        {/* Call to Action */}
        <ContactInvite />
      </main>
      <Footer />
    </>
  );
}
