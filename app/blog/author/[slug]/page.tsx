import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, Twitter, Linkedin, Github, ExternalLink, User } from "lucide-react";
import { BlogRepository } from "@/services/repositories/BlogRepository";
import { constructMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await BlogRepository.getAuthorBySlug(slug);
  if (!author) return constructMetadata({ title: "Author Not Found", noIndex: true });
  return constructMetadata({
    title: `${author.name} — Author`,
    description: author.bio || `Articles by ${author.name} on the ANNEX blog.`,
    image: author.avatar || undefined,
    path: `/blog/author/${author.slug}`,
    authors: [{ name: author.name }],
  });
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const [author, posts] = await Promise.all([
    BlogRepository.getAuthorBySlug(slug),
    BlogRepository.getPostsByAuthor(slug),
  ]);
  if (!author) notFound();

  // JSON-LD Person schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio,
    image: author.avatar,
    sameAs: Object.values(author.socialLinks).filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen">
        {/* Header */}
        <section className="py-20 px-6 border-b border-border/10 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <div className="max-w-5xl mx-auto">
            <nav className="text-xs font-mono text-muted flex items-center gap-2 mb-8">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground/60">{author.name}</span>
            </nav>
            <div className="flex items-center gap-6 flex-wrap">
              {author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-border/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-surface/50 border-2 border-border/15 flex items-center justify-center">
                  <User className="w-10 h-10 text-muted" />
                </div>
              )}
              <div>
                <p className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-2">Author</p>
                <h1 className="text-4xl font-black text-foreground mb-2">{author.name}</h1>
                {author.bio && (
                  <p className="text-muted text-sm max-w-xl leading-relaxed mb-4">{author.bio}</p>
                )}
                <div className="flex items-center gap-4">
                  {author.socialLinks.twitter && (
                    <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {author.socialLinks.linkedin && (
                    <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {author.socialLinks.github && (
                    <a href={author.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {author.socialLinks.website && (
                    <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted/60 font-mono mt-6">{posts.length} articles published</p>
          </div>
        </section>

        {/* Posts */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          {posts.length === 0 ? (
            <p className="text-center text-muted font-mono py-16">No articles published yet.</p>
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
                      {post.category && (
                        <span className="text-xs font-mono text-primary/70">{post.category.title}</span>
                      )}
                      <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted line-clamp-2 flex-1">{post.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted/70 font-mono pt-1 border-t border-border/10">
                        {post.readingTime > 0 && (
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime} min</span>
                        )}
                        {post.publishedAt && (
                          <span className="ml-auto">{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
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
    </>
  );
}
