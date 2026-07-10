export interface BreadcrumbLink {
  name: string;
  href: string;
}

export function getHomeBreadcrumb(): BreadcrumbLink[] {
  return [];
}

export function getShowcaseBreadcrumb(): BreadcrumbLink[] {
  return [{ name: "Showcase", href: "/showcase" }];
}

export function getProjectBreadcrumb(projectTitle: string, projectSlug: string): BreadcrumbLink[] {
  return [
    { name: "Showcase", href: "/showcase" },
    { name: projectTitle, href: `/showcase/${projectSlug}` },
  ];
}

export function getBookCallBreadcrumb(): BreadcrumbLink[] {
  return [{ name: "Book a Call", href: "/book-call" }];
}

// Future Service Pages
export function getServiceBreadcrumb(serviceName: string, serviceSlug: string): BreadcrumbLink[] {
  return [
    { name: "Services", href: "/services" },
    { name: serviceName, href: `/services/${serviceSlug}` },
  ];
}

// Future Blog Posts
export function getBlogBreadcrumb(articleTitle?: string, articleSlug?: string): BreadcrumbLink[] {
  const base = [{ name: "Blog", href: "/blog" }];
  if (articleTitle && articleSlug) {
    base.push({ name: articleTitle, href: `/blog/${articleSlug}` });
  }
  return base;
}

// Future Location Pages
export function getLocationBreadcrumb(locationName: string, locationSlug: string): BreadcrumbLink[] {
  return [
    { name: "Locations", href: "/locations" },
    { name: locationName, href: `/locations/${locationSlug}` },
  ];
}
