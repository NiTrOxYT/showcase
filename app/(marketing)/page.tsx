import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function HomePage() {
  return (
    <PageWrapper>
      <main className="overflow-x-hidden w-full max-w-full min-h-screen flex items-center">
        <Section className="w-full">
          <Container>
            <Stack gap={6} align="center" className="text-center">
              <span className="font-sans text-xs md:text-sm uppercase tracking-widest text-primary font-semibold">
                Foundation Shell
              </span>
              <Heading level={1} className="text-5xl md:text-7xl font-extrabold max-w-4xl tracking-tightest">
                AVENIQ Showcase
              </Heading>
              <Text className="text-muted text-center max-w-xl mx-auto">
                Next.js 15, Tailwind v3, TypeScript, and motion frameworks integrated. Ready for Phase 2.
              </Text>
            </Stack>
          </Container>
        </Section>
      </main>
    </PageWrapper>
  );
}
