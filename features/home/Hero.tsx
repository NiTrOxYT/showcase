import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import Image from "next/image";

import { SettingsRepository } from "@/services/repositories/SettingsRepository";

export function Hero() {
  const homepageSettings = SettingsRepository.getModule("homepage");
  const heroTitle = homepageSettings.hero?.title || "Digital experiences that grow businesses.";
  const heroSubtitle = homepageSettings.hero?.subtitle || "We design and build bespoke, high-end digital products for brands who refuse to look average. Complete creative control, custom code, and pixel perfection.";

  return (
    <Section className="min-h-screen flex flex-col justify-center pt-36 pb-20 relative">
      <Container>
        <Stack gap={10} align="center" className="text-center">
          <span className="font-sans text-xs uppercase tracking-widest text-primary font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
            Premium Digital Craft
          </span>
          <Heading level={1} className="text-5xl md:text-7xl lg:text-[5.5rem] max-w-6xl tracking-tightest leading-[1.05] font-black">
            {heroTitle}
          </Heading>
          <Text className="text-muted/95 text-center max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            {heroSubtitle}
          </Text>
          
          <div className="pt-4">
            <a
              href="#showcase"
              className="font-sans text-xs uppercase tracking-widest border-b border-foreground/50 pb-1.5 hover:text-primary hover:border-primary transition-all duration-300 ease-out"
            >
              Explore Our Work
            </a>
          </div>

          <div className="w-full max-w-5xl aspect-[16/9] rounded-xl bg-surface/30 border border-border/80 relative overflow-hidden mt-12 shadow-[0_24px_80px_rgba(0,0,0,0.8)] group glassmorphism">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 opacity-70 group-hover:opacity-90 transition-opacity duration-1000" />
            <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-primary/10 blur-[140px] rounded-full" />
            
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80"
              alt="Bespoke digital artwork texture representing premium digital craftsmanship"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover opacity-90 transition-transform duration-[2000ms] group-hover:scale-103"
            />
          </div>
        </Stack>
      </Container>

      {/* Infinite scrolling marquee */}
      <div className="w-full overflow-hidden border-y border-border/10 py-8 mt-24 bg-background/20 relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee gap-24 md:gap-36 flex items-center pr-24 md:pr-36">
          {["PERFORMANCE", "BESPOKE DESIGN", "FLUID MOTION", "ACCESSIBILITY FIRST", "SEO OPTIMIZED", "PRODUCTION READY"].map((text, idx) => (
            <span key={idx} className="font-display text-sm md:text-base font-black tracking-[0.2em] text-muted/40 whitespace-nowrap">
              {text}
            </span>
          ))}
          {["PERFORMANCE", "BESPOKE DESIGN", "FLUID MOTION", "ACCESSIBILITY FIRST", "SEO OPTIMIZED", "PRODUCTION READY"].map((text, idx) => (
            <span key={`dup-${idx}`} className="font-display text-sm md:text-base font-black tracking-[0.2em] text-muted/40 whitespace-nowrap">
              {text}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
