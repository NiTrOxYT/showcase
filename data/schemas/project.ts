import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().uuid().or(z.string()),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().optional(),
  coverImage: z.string().url("Cover image must be a valid URL").or(z.string()),
  images: z.array(z.string()).optional(),
  techStack: z.array(z.string()),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});
