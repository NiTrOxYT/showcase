import { constructMetadata } from "@/lib/seo/metadata";
import { BlogRepository } from "@/services/repositories/BlogRepository";
import { BlogIndex } from "./BlogIndex";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Blog",
  description:
    "Expert insights on web development, AI automation, SaaS, UI/UX design, and digital strategy from the ANNEX team.",
  path: "/blog",
  keywords: ["blog", "web development", "next.js", "AI automation", "ui/ux", "saas"],
  category: "Blog",
});

export default async function BlogPage() {
  const [posts, categories, tags] = await Promise.all([
    BlogRepository.getPublishedPosts(),
    BlogRepository.getAllCategories(),
    BlogRepository.getAllTags(),
  ]);

  return <BlogIndex posts={posts} categories={categories} tags={tags} />;
}
