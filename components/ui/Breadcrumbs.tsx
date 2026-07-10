import React from "react";
import Link from "next/link";
import { getBreadcrumbSchema } from "@/lib/seo/structured-data";
import { BreadcrumbLink } from "@/lib/seo/breadcrumbs";
import { siteConfig } from "@/config/site";

interface BreadcrumbsProps {
  items: BreadcrumbLink[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Always prepend Home
  const allItems = [
    { name: "Home", href: "/" },
    ...items,
  ];

  // Construct structured data schema using absolute URL endpoints
  const schemaItems = allItems.map((item) => ({
    name: item.name,
    url: `${siteConfig.url}${item.href}`,
  }));
  const schema = getBreadcrumbSchema(schemaItems);

  return (
    <>
      {/* Inject BreadcrumbList JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="select-none py-2">
        <ol className="flex items-center flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-400">
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {idx > 0 && <span className="text-neutral-600/80" aria-hidden="true">/</span>}
                {isLast ? (
                  <span className="text-neutral-200 font-semibold" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumbs;
