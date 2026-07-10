import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { BlogRepository } from "@/services/repositories/BlogRepository";
import { constructMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await BlogRepository.getCategoryBySlug(slug);
  if (!cat) return constructMetadata({ title: "Category Not Found", noIndex: true });
  return constructMetadata({
    title: `${cat.title} Articles`,
    description:
      cat.description ||
      `Read all ANNEX blog posts in the ${cat.title} category. Expert insights and tutorials.`,
    path: `/blog/category/${cat.slug}`,
    category: cat.title,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [cat, posts] = await Promise.all([
    BlogRepository.getCategoryBySlug(slug),
    BlogRepository.getPostsByCategory(slug),
  ]);
  if (!cat) notFound();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="py-20 px-6 border-b border-border/10 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <div className="max-w-5xl mx-auto">
          <nav className="text-xs font-mono text-muted flex items-center gap-2 mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground/60">{cat.title}</span>
          </nav>
          <p className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-3">Category</p>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">{cat.title}</h1>
          {cat.description && (
            <p className="text-lg text-muted max-w-2xl">{cat.description}</p>
          )}
          <p className="text-sm text-muted/60 font-mono mt-4">{posts.length} articles</p>
        </div>
      </section>

      {/* Posts */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-muted font-mono py-16">No articles in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="h-full flex flex-col rounded-xl border border-border/10 bg-surface/10 hover:border-border/25 hover:bg-surface/20 transition-all overflow-hidden">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title} loading="lazy" className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-44 bg-surface/30" />
                  )}
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-muted line-clamp-2 flex-1">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted/70 font-mono pt-1 border-t border-border/10">
                      {post.author && <span>{post.author.name}</span>}
                      {post.readingTime > 0 && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime} min</span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
