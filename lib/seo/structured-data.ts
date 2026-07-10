import { siteConfig } from "@/config/site";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    "name": "ANNEX",
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/images/logo.png`,
    "sameAs": [
      "https://www.linkedin.com/in/annex-consultancy-880a18420/",
      "https://github.com/NiTrOxYT",
      "https://www.facebook.com/profile.php?id=61558767534473",
      "https://www.instagram.com/annexconsultancy1/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@annex-consultancy.com",
      "contactType": "customer service",
      "areaServed": "worldwide",
      "availableLanguage": "English"
    }
  };
}

export function getProfessionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#service`,
    "name": "ANNEX",
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/images/logo.png`,
    "image": `${siteConfig.url}/images/cover.png`,
    "description": siteConfig.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "addressCountry": "IN"
    },
    "telephone": "",
    "priceRange": "$$$$"
  };
}

export function getCollectionPageSchema(projects: Array<{ title: string; slug: string; shortDescription: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/showcase/#collection`,
    "name": "ANNEX Showcase",
    "description": "Bespoke digital platforms, telemetry dashboards, and marketing sites built by ANNEX.",
    "url": `${siteConfig.url}/showcase`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": projects.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${siteConfig.url}/showcase/${p.slug}`,
        "name": p.title,
        "description": p.shortDescription
      }))
    }
  };
}

export interface CaseStudyModel {
  title: string;
  slug: string;
  subtitle: string;
  shortDescription: string;
  coverImage?: string;
  client: string;
  technologies: Array<{ name: string }>;
  deliverables?: string[];
  completionDate?: string;
}

export function getCaseStudySchema(project: CaseStudyModel) {
  const imageUrl = project.coverImage
    ? project.coverImage.startsWith("http")
      ? project.coverImage
      : `${siteConfig.url}${project.coverImage.startsWith("/") ? "" : "/"}${project.coverImage}`
    : `${siteConfig.url}/images/cover.png`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${siteConfig.url}/showcase/${project.slug}/#work`,
    "name": project.title,
    "headline": project.title,
    "alternativeHeadline": project.subtitle,
    "description": project.shortDescription,
    "url": `${siteConfig.url}/showcase/${project.slug}`,
    "image": imageUrl,
    "datePublished": project.completionDate || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "ANNEX"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ANNEX",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/images/logo.png`
      }
    },
    "about": project.technologies.map(t => t.name),
    "provider": {
      "@type": "Organization",
      "name": "ANNEX"
    }
  };
}

export interface BreadcrumbItemModel {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItemModel[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Future Blog / Article Schema
export interface ArticleModel {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
}

export function getArticleSchema(article: ArticleModel) {
  const imageUrl = article.coverImage.startsWith("http")
    ? article.coverImage
    : `${siteConfig.url}${article.coverImage.startsWith("/") ? "" : "/"}${article.coverImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteConfig.url}/blog/${article.slug}/#post`,
    "headline": article.title,
    "description": article.description,
    "image": imageUrl,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "author": {
      "@type": "Person",
      "name": article.authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "ANNEX",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/images/logo.png`
      }
    }
  };
}

// Future Service Schema
export interface ServiceModel {
  name: string;
  slug: string;
  description: string;
  serviceType: string;
  priceRange?: string;
}

export function getServiceSchema(service: ServiceModel) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.url}/services/${service.slug}/#service`,
    "name": service.name,
    "serviceType": service.serviceType,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "ANNEX",
      "url": siteConfig.url,
      "logo": `${siteConfig.url}/images/logo.png`
    }
  };
}

export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };
}
