import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

export function Trust() {
  return (
    <Section className="border-t border-border/20 bg-background/30 relative">
      {/* Background ambient radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2/3 h-1/3 bg-accent/3 blur-[180px] rounded-full pointer-events-none" />

      <Container>
        <Stack gap={12} className="mb-24">
          <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl max-w-3xl tracking-tightest leading-tight">
            Built for those who demand absolute excellence.
          </Heading>
        </Stack>

        <Grid cols={1} colsMd={3} gap={6} dense className="max-w-none">
          {/* Card 1: Speed - md:col-span-2 */}
          <div className="md:col-span-2 p-8 md:p-14 rounded-2xl bg-surface/20 border border-border/40 hover:border-foreground/20 hover:bg-surface/35 transition-all duration-700 ease-out glassmorphism relative overflow-hidden group">
            {/* Visual shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms]" />
            <div className="absolute top-0 right-0 p-8 text-[10px] font-mono text-primary tracking-widest uppercase">
              [ Speed Index · 100/100 ]
            </div>
            
            <Stack gap={6} className="h-full justify-between pt-20 md:pt-32">
              <Heading level={3} className="text-2xl md:text-4xl font-bold tracking-tightest">
                Lightning performance.
              </Heading>
              <Text className="text-muted/80 max-w-lg leading-relaxed text-sm md:text-base">
                Every component is hand-crafted and compiled for raw execution speed. Sub-second initial loads keep user engagement high and skip bounce drops.
              </Text>
            </Stack>
          </div>

          {/* Card 2: Mobile - md:col-span-1 */}
          <div className="md:col-span-1 p-8 md:p-12 rounded-2xl bg-surface/20 border border-border/40 hover:border-foreground/20 hover:bg-surface/35 transition-all duration-700 ease-out glassmorphism flex flex-col justify-between group relative overflow-hidden">
            <div className="text-[10px] font-mono text-muted tracking-widest uppercase mb-16">
              [ Responsive Primitives ]
            </div>
            <Stack gap={4}>
              <Heading level={3} className="text-2xl md:text-3xl font-bold tracking-tightest">
                Responsive layouts.
              </Heading>
              <Text className="text-muted/80 text-sm md:text-base leading-relaxed">
                Adaptive typography and layout grids that scale perfectly to laptops, tablets, and phones.
              </Text>
            </Stack>
          </div>

          {/* Card 3: SEO - md:col-span-1 */}
          <div className="md:col-span-1 p-8 md:p-12 rounded-2xl bg-surface/20 border border-border/40 hover:border-foreground/20 hover:bg-surface/35 transition-all duration-700 ease-out glassmorphism flex flex-col justify-between group relative overflow-hidden">
            <div className="text-[10px] font-mono text-muted tracking-widest uppercase mb-16">
              [ Search Engine Authority ]
            </div>
            <Stack gap={4}>
              <Heading level={3} className="text-2xl md:text-3xl font-bold tracking-tightest">
                SEO optimized.
              </Heading>
              <Text className="text-muted/80 text-sm md:text-base leading-relaxed">
                Structured schemas, semantic hierarchies, dynamic XML generation, and fast Core Web Vitals score tags.
              </Text>
            </Stack>
          </div>

          {/* Card 4: Modern Tech - md:col-span-2 */}
          <div className="md:col-span-2 p-8 md:p-14 rounded-2xl bg-surface/20 border border-border/40 hover:border-foreground/20 hover:bg-surface/35 transition-all duration-700 ease-out glassmorphism relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms]" />
            <div className="absolute top-0 right-0 p-8 text-[10px] font-mono text-muted tracking-widest uppercase">
              [ Compiled Architecture ]
            </div>
            
            <Stack gap={6} className="h-full justify-between pt-20 md:pt-32">
              <Heading level={3} className="text-2xl md:text-4xl font-bold tracking-tightest">
                Modern technology.
              </Heading>
              <Text className="text-muted/80 max-w-lg leading-relaxed text-sm md:text-base">
                Engineered with React 19, Next.js 15, strict type interfaces, and modular directory structures to ensure painless scalability for years.
              </Text>
            </Stack>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
