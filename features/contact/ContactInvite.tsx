import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { SITE_METADATA } from "@/constants/site";

export function ContactInvite() {
  return (
    <Section id="contact" className="border-t border-border/20 bg-background/40 relative overflow-hidden py-40 md:py-56">
      {/* Immersive glow backdrop */}
      <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-4/5 h-2/3 bg-primary/4 blur-[160px] rounded-full pointer-events-none" />

      <Container>
        <Stack gap={10} align="center" className="text-center">
          <span className="font-sans text-xs uppercase tracking-widest text-primary font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
            Get in Touch
          </span>
          
          <Heading level={2} className="text-5xl md:text-7xl lg:text-[5.5rem] max-w-4xl tracking-tightest leading-[1.05] font-black">
            Let&apos;s build something exceptional.
          </Heading>
          
          <Text className="text-muted/80 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Whether you want to discuss a new design brief, system architecture, or schedule an initial discovery call, we are here.
          </Text>

          <Stack gap={6} align="center" className="pt-8 w-full">
            <a
              href={`mailto:${SITE_METADATA.SUPPORT_EMAIL}`}
              className="text-2xl md:text-4xl lg:text-5xl font-display font-black tracking-tightest border-b-2 border-foreground/30 hover:border-primary hover:text-primary pb-2 transition-all duration-500 ease-out"
            >
              {SITE_METADATA.SUPPORT_EMAIL}
            </a>
            
            <a
              href="#contact"
              className="font-sans text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors duration-300 pt-6"
            >
              Schedule Discovery Call
            </a>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
