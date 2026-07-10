import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string | string[];
  type?: "website" | "article" | "profile" | "book";
  authors?: { name: string; url?: string }[];
  category?: string;
  technologies?: string[] | { name: string }[];
  services?: string[];
  tags?: string[];
  industry?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const DEFAULT_KEYWORDS = [
  "annex",
  "annex consultancy",
  "digital agency",
  "software engineering",
  "web development",
  "next.js studio",
  "premium design",
];

export function generateKeywords(
  baseKeywords: string[],
  additional?: {
    category?: string;
    technologies?: string[] | { name: string }[];
    services?: string[];
    tags?: string[];
    name?: string;
    industry?: string;
  }
): string[] {
  const keywordsSet = new Set<string>(baseKeywords.map(k => k.toLowerCase()));
  if (additional) {
    if (additional.category) keywordsSet.add(additional.category.toLowerCase());
    if (additional.name) keywordsSet.add(additional.name.toLowerCase());
    if (additional.industry) keywordsSet.add(additional.industry.toLowerCase());
    
    if (additional.technologies) {
      additional.technologies.forEach((tech) => {
        const val = typeof tech === "string" ? tech : tech.name;
        if (val) keywordsSet.add(val.toLowerCase());
      });
    }
    if (additional.services) {
      additional.services.forEach((service) => keywordsSet.add(service.toLowerCase()));
    }
    if (additional.tags) {
      additional.tags.forEach((tag) => keywordsSet.add(tag.toLowerCase()));
    }
  }
  return Array.from(keywordsSet);
}

export function constructMetadata({
  title,
  description,
  image,
  path = "",
  noIndex = false,
  keywords,
  type = "website",
  authors = [{ name: "ANNEX Team", url: "https://annex-consultancy.com" }],
  category,
  technologies,
  services,
  tags,
  industry,
  publishedTime,
  modifiedTime,
}: MetadataProps = {}): Metadata {
  const formattedTitle = title ? `${title} | ANNEX` : siteConfig.name;
  const formattedDesc = description || siteConfig.description;
  
  // Clean canonical link structure
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const absoluteCanonicalUrl = `${siteConfig.url}${cleanPath}`;

  // Dynamically resolve image fallback matching layout
  let finalImage = image;
  if (!finalImage) {
    if (cleanPath === "/") {
      finalImage = "/images/cover.png";
    } else if (cleanPath === "/book-call") {
      finalImage = "/images/bookacall.png";
    } else {
      // Dynamic fallback via og generator
      const ogParams = new URLSearchParams();
      if (title) ogParams.set("title", title);
      if (description) ogParams.set("description", description);
      if (category) ogParams.set("category", category);
      finalImage = `/api/og?${ogParams.toString()}`;
    }
  }

  const absoluteImageUrl = finalImage.startsWith("http")
    ? finalImage
    : `${siteConfig.url}${finalImage.startsWith("/") ? "" : "/"}${finalImage}`;

  // Dynamically construct keyword list
  const computedKeywords = generateKeywords(
    Array.isArray(keywords) ? keywords : keywords ? [keywords] : DEFAULT_KEYWORDS,
    { category, technologies, services, tags, name: title, industry }
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: formattedTitle,
    description: formattedDesc,
    keywords: computedKeywords,
    alternates: {
      canonical: absoluteCanonicalUrl,
    },
    authors,
    creator: "ANNEX",
    publisher: "ANNEX",
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: formattedTitle,
      description: formattedDesc,
      url: absoluteCanonicalUrl,
      siteName: "ANNEX",
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: formattedTitle,
        },
      ],
      locale: "en_US",
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description: formattedDesc,
      images: [absoluteImageUrl],
      creator: "@annex",
    },
    icons: {
      icon: "/favicons/favicon.ico",
      shortcut: "/favicons/favicon-16x16.png",
      apple: "/favicons/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "ANNEX",
    },
    other: {
      "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
      "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
    },
  };
}
