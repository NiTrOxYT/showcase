import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Navbar } from "@/features/navigation/Navbar";
import { Footer } from "@/features/navigation/Footer";
import { ContactInvite } from "@/features/contact/ContactInvite";
import { ServiceRepository } from "@/services/repositories/ServiceRepository";
import { SettingsRepository } from "@/services/repositories/SettingsRepository";
import { showcaseRepository } from "@/services/showcaseRepository";
import { navigationRepository } from "@/services/navigationRepository";
import { constructMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getServiceDetailBreadcrumb } from "@/lib/seo/breadcrumbs";
import {
  getServiceSchema,
  getFAQSchema,
  getProfessionalServiceSchema,
} from "@/lib/seo/structured-data";
import {
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  Check,
  Layers,
  HelpCircle,
  FolderKanban,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await ServiceRepository.getBySlug(slug);

  if (!service) {
    return constructMetadata({ title: "Service Not Found" });
  }

  const seo = await SettingsRepository.getModule("seo");
  return constructMetadata({
    title: service.seoTitle || (seo.titleTemplate ? seo.titleTemplate.replace("%s", service.title) : service.title),
    description: service.seoDescription || service.shortDescription,
    keywords: service.keywords,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [service, allServices, allProjects, settings, headerNav, footerNav] = await Promise.all([
    ServiceRepository.getBySlug(slug),
    ServiceRepository.getPublished(),
    showcaseRepository.getProjects(),
    SettingsRepository.getAll(),
    navigationRepository.getNavigation("header"),
    navigationRepository.getNavigation("footer"),
  ]);

  if (!service) {
    notFound();
  }

  // 1. Showcase Dynamic Integration: filter projects matching tags/category/technologies
  const techNames = service.technologies.map((t) => t.name.toLowerCase());
  const relatedProjects = allProjects.filter((p) => {
    // Check if category matches title/slug
    const catMatch =
      p.category.toLowerCase().includes(service.title.toLowerCase()) ||
      service.title.toLowerCase().includes(p.category.toLowerCase());
    
    // Check if project tech contains any of service technologies
    const projTech = p.technologies || [];
    const techMatch = projTech.some((t) => {
      const name = typeof t === "string" ? t : (t as { name?: string }).name;
      return name ? techNames.includes(name.toLowerCase()) : false;
    });

    return catMatch || techMatch;
  });

  // 2. Related Services internal linking (excluding current service)
  const relatedServices = allServices
    .filter((s) => s.id !== service.id)
    .slice(0, 3);

  // 3. Structured schemas
  const structuredData = [
    getProfessionalServiceSchema(),
    getServiceSchema({
      name: service.title,
      slug: service.slug,
      description: service.shortDescription,
      serviceType: service.title,
    }),
    getFAQSchema(service.faq),
  ];

  const socialLinks = [
    { label: "GitHub", href: settings.social.github },
    { label: "LinkedIn", href: settings.social.linkedin },
    { label: "Instagram", href: settings.social.instagram },
  ];

  return (
    <>
      {/* Dynamic JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Navbar
        navLinks={headerNav}
        logoUrl={settings.branding.logoUrl}
        contactEmail={settings.contact.email}
        contactAddress={settings.contact.address}
      />

      <main className="min-h-screen bg-background pt-32 pb-20 select-none">
        <Container>
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={getServiceDetailBreadcrumb(service)} />
          </div>

          {/* Hero Section */}
          <Section className="py-8 border-b border-border/10 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <span className="font-mono text-primary text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  ANNEX Commercial Money Page
                </span>
                <Heading level={1} className="text-4xl md:text-6xl font-black tracking-tightest leading-tight">
                  {service.heroTitle || service.title}
                </Heading>
                <Text className="text-muted text-base md:text-lg leading-relaxed max-w-[620px]">
                  {service.heroDescription || service.shortDescription}
                </Text>
                
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <Link
                    href="/book-call"
                    className="bg-foreground text-background hover:bg-neutral-200 px-6 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 font-bold shadow-lg"
                  >
                    Book a Free Call
                  </Link>
                  {relatedProjects.length > 0 && (
                    <a
                      href="#showcase"
                      className="border border-border/20 hover:border-foreground hover:bg-surface/30 px-6 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 font-bold"
                    >
                      View Related Projects ({relatedProjects.length})
                    </a>
                  )}
                </div>
              </div>

              {/* Cover Image mock mockup card */}
              <div className="lg:col-span-5 relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-border/10 bg-neutral-900 shadow-2xl">
                {service.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.coverImage}
                    alt={service.title}
                    className="object-cover w-full h-full opacity-80"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted">
                    ANNEX // Studio Landing Layout
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
            </div>
          </Section>

          {/* Detailed Overview */}
          {service.overview && (
            <Section className="py-16 border-b border-border/10">
              <div className="max-w-[800px]">
                <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6">[ Service Scope Overview ]</h3>
                <Text className="text-neutral-300 text-sm md:text-base leading-loose whitespace-pre-line font-medium">
                  {service.overview}
                </Text>
              </div>
            </Section>
          )}

          {/* Problem & Solution Double Panel */}
          <Section className="py-20 border-b border-border/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Problem Section */}
              <div className="border border-red-500/10 bg-red-500/5 p-8 rounded-2xl flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                  <Heading level={2} className="text-xl font-bold tracking-tight text-red-200">
                    {service.problem?.title || "The Challenge"}
                  </Heading>
                </div>
                <Text className="text-red-300/80 text-xs md:text-sm leading-relaxed">
                  {service.problem?.description}
                </Text>
                {service.problem?.points && service.problem.points.length > 0 && (
                  <ul className="flex flex-col gap-3 mt-4 border-t border-red-500/10 pt-4">
                    {service.problem.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-red-200/95 leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Solution Section */}
              <div className="border border-emerald-500/10 bg-emerald-500/5 p-8 rounded-2xl flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <Heading level={2} className="text-xl font-bold tracking-tight text-emerald-200">
                    {service.solution?.title || "The Solution"}
                  </Heading>
                </div>
                <Text className="text-emerald-300/80 text-xs md:text-sm leading-relaxed">
                  {service.solution?.description}
                </Text>
                {service.solution?.points && service.solution.points.length > 0 && (
                  <ul className="flex flex-col gap-3 mt-4 border-t border-emerald-500/10 pt-4">
                    {service.solution.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-emerald-200/95 leading-normal">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Section>

          {/* Benefits Grids */}
          {service.benefits && service.benefits.length > 0 && (
            <Section className="py-20 border-b border-border/10">
              <div className="flex flex-col gap-12">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">[ Outcomes & Benefits ]</h3>
                  <Heading level={2} className="text-2xl md:text-4xl font-black tracking-tight">
                    Engineered to Convert.
                  </Heading>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {service.benefits.map((b, idx) => (
                    <div key={idx} className="border border-border/10 bg-surface/5 p-6 rounded-xl flex flex-col gap-3 hover:border-foreground/20 transition-all duration-300">
                      <Heading level={4} className="text-base font-bold text-neutral-100">{b.title}</Heading>
                      <Text className="text-muted text-xs leading-relaxed">{b.description}</Text>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* Process Timeline */}
          {service.process && service.process.length > 0 && (
            <Section className="py-20 border-b border-border/10">
              <div className="flex flex-col gap-12">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">[ Implementation Process ]</h3>
                  <Heading level={2} className="text-2xl md:text-4xl font-black tracking-tight">
                    How We Deliver.
                  </Heading>
                </div>

                <div className="flex flex-col gap-4">
                  {service.process.map((step) => (
                    <div
                      key={step.step}
                      className="border border-border/10 bg-surface/5 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface/10 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <span className="font-mono text-xs font-bold text-primary px-3 py-1 bg-primary/10 border border-primary/20 rounded-md shrink-0">
                          Step 0{step.step}
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <Heading level={4} className="text-base font-bold text-neutral-100">{step.title}</Heading>
                          <Text className="text-muted text-xs leading-relaxed">{step.description}</Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* Technologies badges */}
          {service.technologies && service.technologies.length > 0 && (
            <Section className="py-20 border-b border-border/10">
              <div className="flex flex-col gap-10">
                <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400">[ Tools & Technology Stack ]</h3>
                <div className="flex flex-wrap gap-3">
                  {service.technologies.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 border border-border/10 bg-surface/5 px-4 py-2.5 rounded-lg text-xs font-mono font-bold text-neutral-200"
                    >
                      <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* Dynamic Showcase Integration */}
          {relatedProjects.length > 0 && (
            <Section id="showcase" className="py-20 border-b border-border/10 scroll-mt-24">
              <div className="flex flex-col gap-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">[ Showcase Proof ]</h3>
                    <Heading level={2} className="text-2xl md:text-4xl font-black tracking-tight">
                      Related Case Studies.
                    </Heading>
                  </div>
                  <Link
                    href="/showcase"
                    className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted hover:text-foreground transition-all"
                  >
                    View All Case Studies <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProjects.map((project) => (
                    <Link
                      href={`/showcase/${project.slug}`}
                      key={project.id}
                      className="group relative flex flex-col justify-between border border-border/15 bg-surface/5 hover:bg-surface/10 hover:border-foreground/30 p-8 rounded-2xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex flex-col gap-5">
                        <div className="flex justify-between items-start">
                          <FolderKanban className="w-4 h-4 text-neutral-500 group-hover:text-primary transition-colors" />
                          <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Heading level={3} className="text-xl font-bold tracking-tight text-neutral-100">
                            {project.title}
                          </Heading>
                          <Text className="text-muted text-xs leading-normal line-clamp-3">
                            {project.shortDescription}
                          </Text>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* FAQ Accordions using native details tags */}
          {service.faq && service.faq.length > 0 && (
            <Section className="py-20 border-b border-border/10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <span className="font-mono text-primary text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> FAQ
                  </span>
                  <Heading level={2} className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                    Frequently Asked Questions.
                  </Heading>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-4">
                  {service.faq.map((item, idx) => (
                    <details
                      key={idx}
                      className="group bg-surface/10 border border-border/10 rounded-2xl p-6 transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex justify-between items-center font-bold text-sm md:text-base cursor-pointer list-none select-none text-neutral-100 group-open:text-white">
                        <span>{item.question}</span>
                        <span className="text-muted transition-transform group-open:rotate-45 font-mono text-lg">+</span>
                      </summary>
                      <p className="mt-4 text-muted text-xs md:text-sm leading-relaxed border-t border-border/5 pt-4">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* Related Services Internal Linking */}
          {relatedServices.length > 0 && (
            <Section className="py-20">
              <div className="flex flex-col gap-12">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">[ Core Capabilities ]</h3>
                  <Heading level={2} className="text-2xl md:text-4xl font-black tracking-tight">
                    Other Services.
                  </Heading>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedServices.map((s) => (
                    <Link
                      href={`/services/${s.slug}`}
                      key={s.id}
                      className="border border-border/10 bg-surface/5 p-6 rounded-xl flex flex-col justify-between gap-6 hover:border-foreground/20 transition-all duration-300"
                    >
                      <div className="flex flex-col gap-3">
                        <Heading level={4} className="text-base font-bold text-neutral-100">{s.title}</Heading>
                        <Text className="text-muted text-xs leading-normal line-clamp-3">{s.shortDescription}</Text>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-primary font-bold uppercase tracking-wider mt-4">
                        Explore Scope <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </Section>
          )}
        </Container>
      </main>

      {/* Bottom CTA section */}
      <ContactInvite
        title={service.ctaTitle || "Let's Build Something Exceptional."}
        description={service.ctaDescription || "Schedule a free strategic call to discuss scope, process, and architecture."}
        supportEmail={settings.contact.email}
      />
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
export async function generateStaticParams() {
  const services = await ServiceRepository.getAll();
  return services.map((s) => ({ slug: s.slug }));
}
