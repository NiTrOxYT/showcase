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

const services = [
  {
    title: "Marketing Websites",
    description:
      "Immersive landing pages and portfolios featuring premium motion design, custom typographic grids, and verified Core Web Vitals performance.",
  },
  {
    title: "SaaS Platforms",
    description:
      "Highly responsive application dashboards and portals optimized for seamless user onboarding, data density, and sub-second updates.",
  },
  {
    title: "Bespoke Web Apps",
    description:
      "Custom digital tools engineered on server-first routing frameworks with secure database schemas and modular cloud services.",
  },
];

export function Services() {
  return (
    <Section className="border-t border-border/20 relative">
      <Container>
        <Stack gap={16}>
          <MotionSection as="div" variant="rise">
            <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl max-w-2xl tracking-tightest leading-none">
              Core digital capabilities.
            </Heading>
          </MotionSection>

          <motion.div
            variants={containerReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-5%" }}
            className="flex flex-col border-t border-border/20 mt-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemReveal}
                className="py-12 md:py-16 border-b border-border/20 flex flex-col md:flex-row justify-between items-start gap-8 hover:bg-surface/10 px-6 md:px-10 rounded-2xl transition-all duration-500 ease-out group"
              >
                <div className="flex gap-6 md:gap-12 items-start max-w-2xl">
                  <span className="font-mono text-xs text-primary font-bold pt-1.5">[ 0{index + 1} ]</span>
                  <Stack gap={3}>
                    <Heading level={3} className="text-2xl md:text-3xl font-bold tracking-tightest leading-tight">
                      {service.title}
                    </Heading>
                    <Text className="text-muted/80 leading-relaxed text-sm md:text-base">
                      {service.description}
                    </Text>
                  </Stack>
                </div>

                <div className="self-end md:self-center font-mono text-[10px] uppercase tracking-widest text-muted/40 group-hover:text-primary transition-colors duration-300">
                  {"// Custom Crafted"}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Stack>
      </Container>
    </Section>
  );
}
