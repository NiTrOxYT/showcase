import { createAdminClient } from "@/lib/supabase/server";
import type {
  BlogPost,
  BlogAuthor,
  BlogCategory,
  BlogTag,
  BlogPostRevision,
  BlogBlock,
  BlogPostStatus,
  BlogNewsletterStatus,
  BlogSocialCaptions,
  BlogAuthorSocialLinks,
} from "@/types/blog";

// ============================================================
// Mappers
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToAuthor(row: any): BlogAuthor {
  return {
    id: row.id,
    name: row.name || "",
    slug: row.slug || "",
    avatar: row.avatar || null,
    bio: row.bio || null,
    socialLinks:
      row.social_links && typeof row.social_links === "object"
        ? (row.social_links as BlogAuthorSocialLinks)
        : {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToCategory(row: any): BlogCategory {
  return {
    id: row.id,
    title: row.title || "",
    slug: row.slug || "",
    description: row.description || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToTag(row: any): BlogTag {
  return {
    id: row.id,
    name: row.name || "",
    slug: row.slug || "",
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToRevision(row: any): BlogPostRevision {
  return {
    id: row.id,
    postId: row.post_id,
    content: Array.isArray(row.content) ? (row.content as BlogBlock[]) : [],
    seoData:
      row.seo_data && typeof row.seo_data === "object" ? row.seo_data : {},
    createdBy: row.created_by || null,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapRowToPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title || "",
    slug: row.slug || "",
    excerpt: row.excerpt || null,
    content: Array.isArray(row.content) ? (row.content as BlogBlock[]) : [],
    coverImage: row.cover_image || null,
    authorId: row.author_id || null,
    author: row.blog_authors ? mapRowToAuthor(row.blog_authors) : undefined,
    categoryId: row.category_id || null,
    category: row.blog_categories
      ? mapRowToCategory(row.blog_categories)
      : undefined,
    tags: Array.isArray(row.blog_post_tags)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        row.blog_post_tags.map((pt: any) =>
          pt.blog_tags ? mapRowToTag(pt.blog_tags) : null
        ).filter(Boolean)
      : [],
    seoTitle: row.seo_title || null,
    seoDescription: row.seo_description || null,
    seoKeywords: Array.isArray(row.seo_keywords) ? row.seo_keywords : [],
    ogImage: row.og_image || null,
    readingTime: row.reading_time || 0,
    featured: !!row.featured,
    status: (row.status || "Draft") as BlogPostStatus,
    publishedAt: row.published_at || null,
    aiGenerated: !!row.ai_generated,
    aiModel: row.ai_model || null,
    contentStatus: row.content_status || null,
    reviewedBy: row.reviewed_by || null,
    reviewedAt: row.reviewed_at || null,
    lastAiUpdate: row.last_ai_update || null,
    aiPrompt: row.ai_prompt || null,
    aiContext: row.ai_context || null,
    aiNotes: row.ai_notes || null,
    relatedPosts: Array.isArray(row.related_posts) ? row.related_posts : [],
    relatedServices: Array.isArray(row.related_services)
      ? row.related_services
      : [],
    relatedCaseStudies: Array.isArray(row.related_case_studies)
      ? row.related_case_studies
      : [],
    socialCaptions:
      row.social_captions && typeof row.social_captions === "object"
        ? (row.social_captions as BlogSocialCaptions)
        : {},
    newsletterStatus: (row.newsletter_status || "none") as BlogNewsletterStatus,
    views: row.views || 0,
    ctaClicks: row.cta_clicks || 0,
    newsletterSignups: row.newsletter_signups || 0,
    consultationClicks: row.consultation_clicks || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPostToRow(p: Partial<BlogPost>): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.excerpt !== undefined) row.excerpt = p.excerpt;
  if (p.content !== undefined) row.content = p.content;
  if (p.coverImage !== undefined) row.cover_image = p.coverImage;
  if (p.authorId !== undefined) row.author_id = p.authorId;
  if (p.categoryId !== undefined) row.category_id = p.categoryId;
  if (p.seoTitle !== undefined) row.seo_title = p.seoTitle;
  if (p.seoDescription !== undefined) row.seo_description = p.seoDescription;
  if (p.seoKeywords !== undefined) row.seo_keywords = p.seoKeywords;
  if (p.ogImage !== undefined) row.og_image = p.ogImage;
  if (p.readingTime !== undefined) row.reading_time = p.readingTime;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.status !== undefined) row.status = p.status;
  if (p.publishedAt !== undefined) row.published_at = p.publishedAt;
  if (p.aiGenerated !== undefined) row.ai_generated = p.aiGenerated;
  if (p.aiModel !== undefined) row.ai_model = p.aiModel;
  if (p.contentStatus !== undefined) row.content_status = p.contentStatus;
  if (p.reviewedBy !== undefined) row.reviewed_by = p.reviewedBy;
  if (p.reviewedAt !== undefined) row.reviewed_at = p.reviewedAt;
  if (p.lastAiUpdate !== undefined) row.last_ai_update = p.lastAiUpdate;
  if (p.aiPrompt !== undefined) row.ai_prompt = p.aiPrompt;
  if (p.aiContext !== undefined) row.ai_context = p.aiContext;
  if (p.aiNotes !== undefined) row.ai_notes = p.aiNotes;
  if (p.relatedPosts !== undefined) row.related_posts = p.relatedPosts;
  if (p.relatedServices !== undefined) row.related_services = p.relatedServices;
  if (p.relatedCaseStudies !== undefined)
    row.related_case_studies = p.relatedCaseStudies;
  if (p.socialCaptions !== undefined) row.social_captions = p.socialCaptions;
  if (p.newsletterStatus !== undefined)
    row.newsletter_status = p.newsletterStatus;
  return row;
}

const POST_SELECT = `
  *,
  blog_authors(*),
  blog_categories(*),
  blog_post_tags(blog_tags(*))
`;

// ============================================================
// BlogRepository
// ============================================================
export const BlogRepository = {
  // ---------- Posts ----------

  async getAllPosts(): Promise<BlogPost[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching all blog posts:", error);
      return [];
    }
    return (data || []).map(mapRowToPost);
  },

  async getPublishedPosts(limit?: number): Promise<BlogPost[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    let query = supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("status", "Published")
      .order("published_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching published blog posts:", error);
      return [];
    }
    return (data || []).map(mapRowToPost);
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("slug", slug)
      .eq("status", "Published")
      .maybeSingle();
    if (error) {
      console.error("Error fetching blog post by slug:", error);
      return null;
    }
    return data ? mapRowToPost(data) : null;
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.error("Error fetching blog post by ID:", error);
      return null;
    }
    return data ? mapRowToPost(data) : null;
  },

  async getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data: cat } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    if (!cat) return [];
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("status", "Published")
      .eq("category_id", cat.id)
      .order("published_at", { ascending: false });
    if (error) {
      console.error("Error fetching posts by category:", error);
      return [];
    }
    return (data || []).map(mapRowToPost);
  },

  async getPostsByTag(tagSlug: string): Promise<BlogPost[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data: tag } = await supabase
      .from("blog_tags")
      .select("id")
      .eq("slug", tagSlug)
      .maybeSingle();
    if (!tag) return [];
    const { data: postTags, error: ptErr } = await supabase
      .from("blog_post_tags")
      .select("post_id")
      .eq("tag_id", tag.id);
    if (ptErr || !postTags?.length) return [];
    const postIds = postTags.map((pt: { post_id: string }) => pt.post_id);
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .in("id", postIds)
      .eq("status", "Published")
      .order("published_at", { ascending: false });
    if (error) {
      console.error("Error fetching posts by tag:", error);
      return [];
    }
    return (data || []).map(mapRowToPost);
  },

  async getPostsByAuthor(authorSlug: string): Promise<BlogPost[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data: author } = await supabase
      .from("blog_authors")
      .select("id")
      .eq("slug", authorSlug)
      .maybeSingle();
    if (!author) return [];
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("status", "Published")
      .eq("author_id", author.id)
      .order("published_at", { ascending: false });
    if (error) {
      console.error("Error fetching posts by author:", error);
      return [];
    }
    return (data || []).map(mapRowToPost);
  },

  async getFeaturedPosts(limit = 3): Promise<BlogPost[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("status", "Published")
      .eq("featured", true)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("Error fetching featured posts:", error);
      return [];
    }
    return (data || []).map(mapRowToPost);
  },

  async createPost(post: Partial<BlogPost>): Promise<BlogPost | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const row = mapPostToRow(post);
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(row)
      .select()
      .single();
    if (error) {
      console.error("Error creating blog post:", error);
      return null;
    }
    return data ? mapRowToPost(data) : null;
  },

  async updatePost(
    id: string,
    updates: Partial<BlogPost>,
    saveRevision = true
  ): Promise<BlogPost | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    // Save revision before overwriting
    if (saveRevision && updates.content) {
      const existing = await BlogRepository.getPostById(id);
      if (existing) {
        await supabase.from("blog_post_revisions").insert({
          post_id: id,
          content: existing.content,
          seo_data: {
            title: existing.seoTitle,
            description: existing.seoDescription,
            keywords: existing.seoKeywords,
          },
          created_by: "system",
        });
      }
    }

    const row = mapPostToRow(updates);
    const { data, error } = await supabase
      .from("blog_posts")
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating blog post:", error);
      return null;
    }
    return data ? mapRowToPost(data) : null;
  },

  async deletePost(id: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
    return true;
  },

  async incrementAnalytic(
    id: string,
    field: "views" | "cta_clicks" | "newsletter_signups" | "consultation_clicks"
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    await supabase.rpc("increment_blog_counter", { post_id: id, field_name: field });
  },

  // ---------- Revisions ----------

  async getRevisions(postId: string): Promise<BlogPostRevision[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_post_revisions")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching revisions:", error);
      return [];
    }
    return (data || []).map(mapRowToRevision);
  },

  async restoreRevision(postId: string, revisionId: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data: rev } = await supabase
      .from("blog_post_revisions")
      .select("*")
      .eq("id", revisionId)
      .maybeSingle();
    if (!rev) return false;
    const { error } = await supabase
      .from("blog_posts")
      .update({ content: rev.content })
      .eq("id", postId);
    if (error) {
      console.error("Error restoring revision:", error);
      return false;
    }
    return true;
  },

  // ---------- Categories ----------

  async getAllCategories(): Promise<BlogCategory[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("title");
    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
    return (data || []).map(mapRowToCategory);
  },

  async getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }
    return data ? mapRowToCategory(data) : null;
  },

  async createCategory(
    cat: Partial<BlogCategory>
  ): Promise<BlogCategory | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_categories")
      .insert({ title: cat.title, slug: cat.slug, description: cat.description })
      .select()
      .single();
    if (error) {
      console.error("Error creating category:", error);
      return null;
    }
    return data ? mapRowToCategory(data) : null;
  },

  async updateCategory(
    id: string,
    updates: Partial<BlogCategory>
  ): Promise<BlogCategory | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_categories")
      .update({ title: updates.title, slug: updates.slug, description: updates.description })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating category:", error);
      return null;
    }
    return data ? mapRowToCategory(data) : null;
  },

  async deleteCategory(id: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("blog_categories").delete().eq("id", id);
    if (error) {
      console.error("Error deleting category:", error);
      return false;
    }
    return true;
  },

  // ---------- Tags ----------

  async getAllTags(): Promise<BlogTag[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .order("name");
    if (error) {
      console.error("Error fetching tags:", error);
      return [];
    }
    return (data || []).map(mapRowToTag);
  },

  async getTagBySlug(slug: string): Promise<BlogTag | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_tags")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.error("Error fetching tag:", error);
      return null;
    }
    return data ? mapRowToTag(data) : null;
  },

  async createTag(tag: Partial<BlogTag>): Promise<BlogTag | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_tags")
      .insert({ name: tag.name, slug: tag.slug })
      .select()
      .single();
    if (error) {
      console.error("Error creating tag:", error);
      return null;
    }
    return data ? mapRowToTag(data) : null;
  },

  async deleteTag(id: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("blog_tags").delete().eq("id", id);
    if (error) {
      console.error("Error deleting tag:", error);
      return false;
    }
    return true;
  },

  // ---------- Authors ----------

  async getAllAuthors(): Promise<BlogAuthor[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_authors")
      .select("*")
      .order("name");
    if (error) {
      console.error("Error fetching authors:", error);
      return [];
    }
    return (data || []).map(mapRowToAuthor);
  },

  async getAuthorBySlug(slug: string): Promise<BlogAuthor | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_authors")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.error("Error fetching author:", error);
      return null;
    }
    return data ? mapRowToAuthor(data) : null;
  },

  async createAuthor(author: Partial<BlogAuthor>): Promise<BlogAuthor | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("blog_authors")
      .insert({
        name: author.name,
        slug: author.slug,
        avatar: author.avatar,
        bio: author.bio,
        social_links: author.socialLinks || {},
      })
      .select()
      .single();
    if (error) {
      console.error("Error creating author:", error);
      return null;
    }
    return data ? mapRowToAuthor(data) : null;
  },

  async updateAuthor(
    id: string,
    updates: Partial<BlogAuthor>
  ): Promise<BlogAuthor | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row: any = {};
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.slug !== undefined) row.slug = updates.slug;
    if (updates.avatar !== undefined) row.avatar = updates.avatar;
    if (updates.bio !== undefined) row.bio = updates.bio;
    if (updates.socialLinks !== undefined) row.social_links = updates.socialLinks;
    const { data, error } = await supabase
      .from("blog_authors")
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating author:", error);
      return null;
    }
    return data ? mapRowToAuthor(data) : null;
  },

  async deleteAuthor(id: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { error } = await supabase.from("blog_authors").delete().eq("id", id);
    if (error) {
      console.error("Error deleting author:", error);
      return false;
    }
    return true;
  },

  // ---------- Post Tags management ----------

  async setPostTags(postId: string, tagIds: string[]): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    await supabase.from("blog_post_tags").delete().eq("post_id", postId);
    if (tagIds.length > 0) {
      await supabase
        .from("blog_post_tags")
        .insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
    }
  },
};
