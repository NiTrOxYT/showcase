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

  // Extended Case Study Fields
  clientWebsite?: string;
  businessProblem?: string;
  projectGoal?: string;
  research?: string;
  strategy?: string;
  designProcess?: string;
  developmentProcess?: string;
  overview?: string;
  technicalChallenges?: CaseStudyChallenge[];
  performanceImprovements?: CaseStudyPerformanceImprovement[];
  results?: CaseStudyResult[];
  timeline?: CaseStudyTimelineMilestone[];
  metrics?: CaseStudyResult[];
  faq?: CaseStudyFAQ[];
  relatedProjects?: string[];
  relatedServices?: string[];
  beforeAfter?: CaseStudyBeforeAfter[];
  downloadableAssets?: CaseStudyAsset[];
  testimonialDetails?: CaseStudyTestimonialDetails;
}

export interface CaseStudyChallenge {
  title: string;
  problem: string;
  solution: string;
  outcome: string;
}

export interface CaseStudyPerformanceImprovement {
  label: string;
  before: string;
  after: string;
}

export interface CaseStudyResult {
  value: string;
  unit?: string;
  label: string;
  icon?: string;
  improvement?: string;
}

export interface CaseStudyTimelineMilestone {
  step: number;
  title: string;
  description: string;
  date?: string;
  icon?: string;
  image?: string;
}

export interface CaseStudyFAQ {
  question: string;
  answer: string;
}

export interface CaseStudyBeforeAfter {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  impact?: string;
}

export interface CaseStudyAsset {
  name: string;
  url: string;
  type: string;
  size?: string;
}

export interface CaseStudyTestimonialDetails {
  rating?: number;
  avatar?: string;
  logo?: string;
  videoUrl?: string;
}

