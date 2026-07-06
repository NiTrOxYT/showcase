"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { MotionSection } from "@/components/motion/MotionSection";
import { MotionCard } from "@/components/motion/MotionCard";
import { containerReveal } from "@/animations/variants/transitions";
import { motion } from "framer-motion";

export function Trust() {
  return (
    <Section id="about" className="border-t border-border/20 bg-background/30 relative">
      {/* Background ambient radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2/3 h-1/3 bg-accent/3 blur-[180px] rounded-full pointer-events-none" />

      <Container>
        <MotionSection as="div" variant="rise" className="mb-24">
          <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl max-w-3xl tracking-tightest leading-tight">
            Built for those who demand absolute excellence.
          </Heading>
        </MotionSection>

        <motion.div
          variants={containerReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-5%" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-none"
        >
          {/* Card 1: Speed - md:col-span-2 */}
          <MotionCard withReveal={false} className="md:col-span-2 p-8 md:p-14 rounded-2xl bg-surface/20 border border-border/40 hover:border-foreground/20 hover:bg-surface/35 transition-all duration-700 ease-out glassmorphism relative overflow-hidden group">
            {/* Visual shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms]" />
            <div className="absolute top-0 right-0 p-8 text-[10px] font-mono text-primary tracking-widest uppercase">
              01 // speed telemetry
            </div>

            <Stack gap={6} className="h-full justify-between pt-20 md:pt-32">
              <Heading level={3} className="text-2xl md:text-4xl font-bold tracking-tightest">
                Lightning performance.
              </Heading>
              <Text className="text-muted/80 max-w-lg leading-relaxed text-sm md:text-base">
                Every component is hand-crafted and compiled for raw execution speed. Sub-second initial loads keep user engagement high and skip bounce drops.
              </Text>
            </Stack>
          </MotionCard>

          {/* Card 2: Mobile - md:col-span-1 */}
          <MotionCard withReveal={false} className="md:col-span-1 p-8 md:p-12 rounded-2xl bg-surface/20 border border-border/40 hover:border-foreground/20 hover:bg-surface/35 transition-all duration-700 ease-out glassmorphism flex flex-col justify-between group relative overflow-hidden">
            <div className="text-[10px] font-mono text-muted/60 tracking-widest uppercase mb-16">
              02 // viewport scaling
            </div>
            <Stack gap={4}>
              <Heading level={3} className="text-2xl md:text-3xl font-bold tracking-tightest">
                Responsive layouts.
              </Heading>
              <Text className="text-muted/80 text-sm md:text-base leading-relaxed">
                Adaptive typography and layout grids that scale perfectly to laptops, tablets, and phones.
              </Text>
            </Stack>
          </MotionCard>

          {/* Card 3: SEO - md:col-span-1 */}
          <MotionCard withReveal={false} className="md:col-span-1 p-8 md:p-12 rounded-2xl bg-surface/20 border border-border/40 hover:border-foreground/20 hover:bg-surface/35 transition-all duration-700 ease-out glassmorphism flex flex-col justify-between group relative overflow-hidden">
            <div className="text-[10px] font-mono text-muted/60 tracking-widest uppercase mb-16">
              03 // organic crawler index
            </div>
            <Stack gap={4}>
              <Heading level={3} className="text-2xl md:text-3xl font-bold tracking-tightest">
                SEO optimized.
              </Heading>
              <Text className="text-muted/80 text-sm md:text-base leading-relaxed">
                Structured schemas, semantic hierarchies, dynamic XML generation, and fast Core Web Vitals score tags.
              </Text>
            </Stack>
          </MotionCard>

          {/* Card 4: Modern Tech - md:col-span-2 */}
          <MotionCard withReveal={false} className="md:col-span-2 p-8 md:p-14 rounded-2xl bg-surface/20 border border-border/40 hover:border-foreground/20 hover:bg-surface/35 transition-all duration-700 ease-out glassmorphism relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms]" />
            <div className="absolute top-0 right-0 p-8 text-[10px] font-mono text-muted/60 tracking-widest uppercase">
              04 // runtime composition
            </div>

            <Stack gap={6} className="h-full justify-between pt-20 md:pt-32">
              <Heading level={3} className="text-2xl md:text-4xl font-bold tracking-tightest">
                Modern technology.
              </Heading>
              <Text className="text-muted/80 max-w-lg leading-relaxed text-sm md:text-base">
                Engineered with React 19, Next.js 15, strict type interfaces, and modular directory structures to ensure painless scalability for years.
              </Text>
            </Stack>
          </MotionCard>
        </motion.div>
      </Container>
    </Section>
  );
}
