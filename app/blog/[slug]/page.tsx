import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogRepository } from "@/services/repositories/BlogRepository";
import { constructMetadata } from "@/lib/seo/metadata";
import { BlogArticle } from "./BlogArticle";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await BlogRepository.getPostBySlug(slug);
  if (!post) return constructMetadata({ title: "Article Not Found", noIndex: true });
  return constructMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: post.ogImage || post.coverImage || undefined,
    path: `/blog/${post.slug}`,
    keywords: post.seoKeywords,
    type: "article",
    authors: post.author ? [{ name: post.author.name }] : undefined,
    category: post.category?.title,
    publishedTime: post.publishedAt || undefined,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;

  const [post, recentPosts] = await Promise.all([
    BlogRepository.getPostBySlug(slug),
    BlogRepository.getPublishedPosts(6),
  ]);

  if (!post) notFound();

  const relatedPosts = recentPosts.filter(
    (p) =>
      p.id !== post.id &&
      (p.categoryId === post.categoryId ||
        p.tags?.some((t) => post.tags?.some((pt) => pt.id === t.id)))
  ).slice(0, 3);

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: post.ogImage || post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "Organization", name: "ANNEX" },
    publisher: {
      "@type": "Organization",
      name: "ANNEX",
      url: "https://annex-consultancy.com",
    },
  };

  // FAQ schema if FAQ blocks exist
  const faqBlocks = post.content.filter((b) => b.type === "faq");
  const faqJsonLd =
    faqBlocks.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqBlocks.flatMap((b) =>
            (b.data.items as { question: string; answer: string }[] || []).map(
              (item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })
            )
          ),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <BlogArticle post={post} relatedPosts={relatedPosts} />
    </>
  );
}
