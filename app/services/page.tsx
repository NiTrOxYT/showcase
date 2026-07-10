import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Navbar } from "@/features/navigation/Navbar";
import { Footer } from "@/features/navigation/Footer";
import { ContactInvite } from "@/features/contact/ContactInvite";
import { ServiceRepository } from "@/services/repositories/ServiceRepository";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { navigationRepository } from "@/services/navigationRepository";
import { constructMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getServicesBreadcrumb } from "@/lib/seo/breadcrumbs";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await SettingsRepository.getModule("seo");
  return constructMetadata({
    title: seo.titleTemplate ? seo.titleTemplate.replace("%s", "Our Services") : "Services | ANNEX",
    description: "Explore our range of dynamic engineering and UI/UX design services tailored to build high-performance digital products.",
    path: "/services",
  });
}

export default async function ServicesDirectoryPage() {
  const [services, settings, headerNav, footerNav] = await Promise.all([
    ServiceRepository.getPublished(),
    SettingsRepository.getAll(),
    navigationRepository.getNavigation("header"),
    navigationRepository.getNavigation("footer"),
  ]);

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
      />

      <main className="min-h-screen bg-background pt-32 pb-20 select-none">
        <Container>
          <div className="mb-6">
            <Breadcrumbs items={getServicesBreadcrumb()} />
          </div>

          <Section className="py-8">
            <Stack gap={6} className="max-w-[700px] mb-16">
              <Heading level={1} className="text-4xl md:text-6xl font-black tracking-tightest">
                Our Services.
              </Heading>
              <Text className="text-muted text-base md:text-lg leading-relaxed font-mono uppercase tracking-wide">
                Bespoke technical execution engineered for speed, conversions, and dynamic topical authority.
              </Text>
            </Stack>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Link
                  href={`/services/${service.slug}`}
                  key={service.id}
                  className="group relative flex flex-col justify-between border border-border/15 bg-surface/5 hover:bg-surface/10 hover:border-foreground/30 p-8 rounded-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle top decoration glowing line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-neutral-500 text-[10px] uppercase font-bold tracking-widest">
                        0{index + 1}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Heading level={3} className="text-xl font-bold tracking-tight text-neutral-100 group-hover:text-white transition-colors">
                        {service.title}
                      </Heading>
                      <Text className="text-muted text-xs leading-normal line-clamp-3">
                        {service.shortDescription}
                      </Text>
                    </div>
                  </div>

                  {/* Badges footer */}
                  {service.technologies && service.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-8 border-t border-border/10 pt-4">
                      {service.technologies.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-neutral-800/40 text-neutral-400 border border-border/10 text-[9px] font-mono px-2 py-0.5 rounded"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}

              {services.length === 0 && (
                <div className="col-span-full py-20 text-center border border-dashed border-border/20 rounded-2xl flex flex-col gap-3 justify-center items-center">
                  <Text className="text-muted font-mono text-xs">No service pages published yet.</Text>
                  <Link
                    href="/admin/services/new"
                    className="text-foreground hover:underline text-xs font-mono uppercase tracking-wider"
                  >
                    Create Service Node
                  </Link>
                </div>
              )}
            </div>
          </Section>
        </Container>
      </main>

      <ContactInvite supportEmail={settings.contact.email} />
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
