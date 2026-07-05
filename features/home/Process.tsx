"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { MotionSection } from "@/components/motion/MotionSection";
import { motion } from "framer-motion";
import { containerReveal, itemReveal } from "@/animations/variants/transitions";

const steps = [
  {
    phase: "PHASE 01",
    title: "Discovery & Strategy",
    description:
      "We analyze your audience context, audit competitor gaps, and define a distinct strategic roadmap for your digital presence.",
  },
  {
    phase: "PHASE 02",
    title: "Bespoke Visual Design",
    description:
      "We construct custom layouts, typographic hierarchy, and visual motion paths. Every design element is tailored to match your brand personality.",
  },
  {
    phase: "PHASE 03",
    title: "Production Engineering",
    description:
      "Clean, performant compilation using React 19, Next.js 15, strict type checking, and modular layout primitives optimized for conversion.",
  },
  {
    phase: "PHASE 04",
    title: "Deployment & Optimization",
    description:
      "Global delivery on fast edge servers, database provisioning via Supabase, and dynamic asset management using Cloudinary.",
  },
];

export function Process() {
  return (
    <Section id="process" className="border-t border-border/20 bg-background/20 relative">
      <Container>
        <Stack gap={16}>
          <MotionSection as="div" variant="rise">
            <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl max-w-2xl tracking-tightest leading-none">
              Our developmental timeline.
            </Heading>
          </MotionSection>

          <motion.div
            variants={containerReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-5%" }}
            className="relative pl-8 md:pl-16 border-l border-border/50 flex flex-col gap-20 md:gap-28 max-w-4xl mt-8"
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemReveal} className="relative group">
                {/* Custom glowing timeline node */}
                <div className="absolute -left-[37px] md:-left-[69px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary/50 group-hover:border-primary group-hover:scale-110 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <Stack gap={3} className="transition-transform duration-500 ease-out group-hover:translate-x-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                    {step.phase}
                  </span>
                  <Heading level={3} className="text-2xl md:text-3xl font-bold tracking-tightest leading-tight">
                    {step.title}
                  </Heading>
                  <Text className="text-muted/80 text-sm md:text-base leading-relaxed max-w-2xl">
                    {step.description}
                  </Text>
                </Stack>
              </motion.div>
            ))}
          </motion.div>
        </Stack>
      </Container>
    </Section>
  );
}
