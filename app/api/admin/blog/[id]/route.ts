import { NextRequest, NextResponse } from "next/server";
import { BlogRepository } from "@/services/repositories/BlogRepository";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await BlogRepository.getPostById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const revisions = await BlogRepository.getRevisions(id);
    return NextResponse.json({ post, revisions });
  } catch (err) {
    console.error("GET /api/admin/blog/[id]:", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { tagIds, ...updates } = body;
    const post = await BlogRepository.updatePost(id, updates);
    if (!post) {
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
    if (tagIds !== undefined) {
      await BlogRepository.setPostTags(id, tagIds);
    }
    return NextResponse.json({ post });
  } catch (err) {
    console.error("PUT /api/admin/blog/[id]:", err);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await BlogRepository.deletePost(id);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/blog/[id]:", err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
