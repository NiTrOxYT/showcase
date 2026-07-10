import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/features/navigation/Navbar";
import { Footer } from "@/features/navigation/Footer";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { navigationRepository } from "@/services/navigationRepository";
import { BookCallForm } from "@/app/book-call/BookCallForm";
import { constructMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getBookCallBreadcrumb } from "@/lib/seo/breadcrumbs";
import { getProfessionalServiceSchema } from "@/lib/seo/structured-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "Book a Free Consultation",
  description: "Book a free consultation with ANNEX and discover how we can help build your next digital product.",
  image: "/images/bookacall.png",
  path: "/book-call",
});

export default async function BookCallPage() {
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
      {/* ProfessionalService JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getProfessionalServiceSchema()) }}
      />
      <Navbar
        navLinks={headerNav}
        logoUrl={settings.branding.logoUrl}
        contactEmail={settings.contact.email}
        contactAddress={settings.contact.address}
        theme="dark"
      />
      <main className="min-h-screen pt-24 bg-background overflow-x-hidden w-full max-w-full">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12 pt-6">
          <Breadcrumbs items={getBookCallBreadcrumb()} />
        </div>
        <BookCallForm />
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
