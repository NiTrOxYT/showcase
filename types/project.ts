export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  coverImage: string;
  images?: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
