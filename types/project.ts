export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  device: "desktop" | "laptop" | "tablet" | "mobile" | "browser";
  title: string;
  order: number;
}

export interface Technology {
  name: string;
  icon?: string;
  category: string;
  website?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  type: "Website" | "Web App" | "Dashboard" | "Mobile App";
  featured: boolean;
  order: number;
  client: string;
  industry: string;
  shortDescription: string;
  fullDescription: string;
  technologies: Technology[];
  thumbnail: string;
  coverImage: string;
  gallery: GalleryItem[];
  colors: {
    primary: string;
    background: string;
  };
  liveUrl?: string;
  githubUrl?: string;
  completionDate: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  status: "Draft" | "Published";
  featuredOrder?: number;
  tags: string[];
  services: string[];
  deliverables: string[];
  platform: "Web" | "Mobile" | "Desktop" | "TV";
  duration?: string;
  teamSize?: number;
  repositoryVisibility: "Public" | "Private";
  livePreviewAvailable: boolean;
  caseStudyAvailable: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  favicon?: string;
  thumbnailAlt: string;
  createdAt: string;
  updatedAt: string;
}
