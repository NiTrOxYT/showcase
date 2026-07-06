import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  metadataBase: new URL("https://showcase.annex-consultancy.com"),

  title: "ANNEX Showcase",

  description:
    "Premium websites, web applications, and digital experiences by ANNEX.",

  openGraph: {
    title: "ANNEX Showcase",
    description:
      "Premium websites, web applications, and digital experiences by ANNEX.",
    url: "https://showcase.annex-consultancy.com",
    siteName: "ANNEX",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/cover.png",
        width: 1200,
        height: 630,
        alt: "ANNEX Showcase",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ANNEX Showcase",
    description:
      "Premium websites, web applications, and digital experiences by ANNEX.",
    images: ["/images/cover.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon-16x16.png",
    apple: "/favicons/apple-touch-icon.png",
  },
};
