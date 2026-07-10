import { BlogRepository } from "@/services/repositories/BlogRepository";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default async function NewBlogPostPage() {
  const [categories, tags, authors] = await Promise.all([
    BlogRepository.getAllCategories(),
    BlogRepository.getAllTags(),
    BlogRepository.getAllAuthors(),
  ]);

  return (
    <BlogPostForm
      categories={categories}
      tags={tags}
      authors={authors}
      revisions={[]}
    />
  );
}
