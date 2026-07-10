// Blog type definitions

export type BlogPostStatus =
  | "Draft"
  | "AI Generated"
  | "In Review"
  | "Approved"
  | "Scheduled"
  | "Published"
  | "Archived";

export type BlogNewsletterStatus = "none" | "send" | "queue";

// ----- Block-based rich text content -----

export type BlogBlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "gallery"
  | "video"
  | "quote"
  | "table"
  | "code"
  | "callout"
  | "cta"
  | "faq"
  | "divider"
  | "checklist";

export interface BlogBlock {
  id: string;
  type: BlogBlockType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

// ----- Sub-types -----

export interface BlogSocialCaptions {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  threads?: string;
  facebook?: string;
}

export interface BlogAuthorSocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

// ----- Core entities -----

export interface BlogAuthor {
  id: string;
  name: string;
  slug: string;
  avatar: string | null;
  bio: string | null;
  socialLinks: BlogAuthorSocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface BlogPostRevision {
  id: string;
  postId: string;
  content: BlogBlock[];
  seoData: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdBy: string | null;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: BlogBlock[];
  coverImage: string | null;
  authorId: string | null;
  author?: BlogAuthor | null;
  categoryId: string | null;
  category?: BlogCategory | null;
  tags?: BlogTag[];
  // SEO
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  ogImage: string | null;
  // Metadata
  readingTime: number;
  featured: boolean;
  status: BlogPostStatus;
  publishedAt: string | null;
  // AI tracking
  aiGenerated: boolean;
  aiModel: string | null;
  contentStatus: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  lastAiUpdate: string | null;
  aiPrompt: string | null;
  aiContext: string | null;
  aiNotes: string | null;
  // Related content
  relatedPosts: string[];
  relatedServices: string[];
  relatedCaseStudies: string[];
  // Social
  socialCaptions: BlogSocialCaptions;
  // Newsletter
  newsletterStatus: BlogNewsletterStatus;
  // Analytics
  views: number;
  ctaClicks: number;
  newsletterSignups: number;
  consultationClicks: number;
  createdAt: string;
  updatedAt: string;
}
