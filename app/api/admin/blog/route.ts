import { NextRequest, NextResponse } from "next/server";
import { BlogRepository } from "@/services/repositories/BlogRepository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const posts = status
      ? (await BlogRepository.getAllPosts()).filter((p) => p.status === status)
      : await BlogRepository.getAllPosts();
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("GET /api/admin/blog:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tagIds, ...postData } = body;
    const post = await BlogRepository.createPost(postData);
    if (!post) {
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
    if (tagIds?.length) {
      await BlogRepository.setPostTags(post.id, tagIds);
    }
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/blog:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
