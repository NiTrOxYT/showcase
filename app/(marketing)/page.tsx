import React from "react";
import { Navbar } from "@/features/navigation/Navbar";
import { Hero } from "@/features/home/Hero";
import { Trust } from "@/features/home/Trust";
import { ShowcaseFeatured } from "@/features/showcase/ShowcaseFeatured";
import { Services } from "@/features/home/Services";
import { Process } from "@/features/home/Process";
import { ContactInvite } from "@/features/contact/ContactInvite";
import { Footer } from "@/features/navigation/Footer";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { navigationRepository } from "@/services/navigationRepository";
import { constructMetadata } from "@/lib/seo/metadata";
import { getProfessionalServiceSchema } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

// App Router config to fetch dynamic metadata and database rows
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await SettingsRepository.getModule("seo");
  return constructMetadata({
    title: seo.meta_title || seo.defaultTitle || "Independent Digital Studio",
    description: seo.meta_description || seo.defaultDescription,
    path: "/",
  });
}

export default async function HomePage() {
  // Fetch settings and navigation tree rows in parallel
  const [settings, headerNav, footerNav] = await Promise.all([
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
      {/* LocalBusiness & ProfessionalService JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getProfessionalServiceSchema()) }}
      />
      <Navbar
        navLinks={headerNav}
        logoUrl={settings.branding.logoUrl}
        contactEmail={settings.contact.email}
        contactAddress={settings.contact.address}
        theme="light"
      />
      <main className="overflow-x-hidden w-full max-w-full">
        <Hero settings={settings.homepage.hero} />
        <Trust />
        <ShowcaseFeatured />
        <Services />
        <Process />
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
