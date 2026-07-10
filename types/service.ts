export interface ServiceTechnology {
  name: string;
  category: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceProblem {
  title: string;
  description: string;
  points: string[];
}

export interface ServiceSolution {
  title: string;
  description: string;
  points: string[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  heroTitle: string | null;
  heroDescription: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  keywords: string[];
  coverImage: string | null;
  gallery: string[];
  overview: string | null;
  problem: ServiceProblem;
  solution: ServiceSolution;
  process: ServiceProcessStep[];
  technologies: ServiceTechnology[];
  benefits: ServiceBenefit[];
  deliverables: string[];
  faq: ServiceFAQ[];
  ctaTitle: string | null;
  ctaDescription: string | null;
  featured: boolean;
  sortOrder: number;
  status: "Draft" | "Published";
  createdAt: string;
  updatedAt: string;
}
