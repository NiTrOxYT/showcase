import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/features/navigation/Navbar";
import { Footer } from "@/features/navigation/Footer";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { navigationRepository } from "@/services/navigationRepository";
import { ProposalsFormClient } from "./ProposalsFormClient";
import { constructMetadata } from "@/lib/seo/metadata";
import { ServiceRepository } from "@/services/repositories/ServiceRepository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "Request a Project Proposal (RFP)",
  description: "Submit your request for proposal (RFP) to ANNEX. Upload documents and get detailed build estimates.",
  path: "/proposals",
});

export default async function ProposalsPage() {
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
        <ProposalsFormClient services={services} />
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
