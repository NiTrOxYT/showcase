import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/features/navigation/Navbar";
import { Footer } from "@/features/navigation/Footer";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { navigationRepository } from "@/services/navigationRepository";
import { ContactFormClient } from "./ContactFormClient";
import { constructMetadata } from "@/lib/seo/metadata";

import { ServiceRepository } from "@/services/repositories/ServiceRepository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us",
  description: "Get in touch with ANNEX. Let's discuss your project, requirements, and build options.",
  path: "/contact",
});

export default async function ContactPage() {
  const [settings, headerNav, footerNav, services] = await Promise.all([
    SettingsRepository.getAll(),
    navigationRepository.getNavigation("header"),
    navigationRepository.getNavigation("footer"),
    ServiceRepository.getAll()
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
        theme="dark"
      />
      <main className="min-h-screen pt-24 bg-background overflow-x-hidden w-full max-w-full">
        <ContactFormClient categories={services} />
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
