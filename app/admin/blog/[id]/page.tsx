import { notFound } from "next/navigation";
import { BlogRepository } from "@/services/repositories/BlogRepository";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;

  const [post, categories, tags, authors, revisions] = await Promise.all([
    BlogRepository.getPostById(id),
    BlogRepository.getAllCategories(),
    BlogRepository.getAllTags(),
    BlogRepository.getAllAuthors(),
    BlogRepository.getRevisions(id),
  ]);

  if (!post) notFound();

  return (
    <BlogPostForm
      post={post}
      categories={categories}
      tags={tags}
      authors={authors}
      revisions={revisions}
    />
  );
}
