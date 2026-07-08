import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/features/navigation/Navbar";
import { Footer } from "@/features/navigation/Footer";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { navigationRepository } from "@/services/navigationRepository";
import { BookCallForm } from "@/app/book-call/BookCallForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Free Consultation | ANNEX",
  description: "Book a free consultation with ANNEX and discover how we can help build your next digital product.",
  openGraph: {
    title: "Book a Free Consultation | ANNEX",
    description: "Book a free consultation with ANNEX and discover how we can help build your next digital product.",
    url: "https://showcase.annex-consultancy.com/book-call",
    siteName: "ANNEX",
    images: [
      {
        url: "/images/bookacall.png",
        width: 1200,
        height: 630,
        alt: "Book a Free Consultation with ANNEX",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Free Consultation | ANNEX",
    description: "Book a free consultation with ANNEX and discover how we can help build your next digital product.",
    images: ["/images/bookacall.png"],
  },
};

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
      <Navbar
        navLinks={headerNav}
        logoUrl={settings.branding.logoUrl}
        contactEmail={settings.contact.email}
        contactAddress={settings.contact.address}
      />
      <main className="min-h-screen pt-24 bg-background overflow-x-hidden w-full max-w-full">
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
