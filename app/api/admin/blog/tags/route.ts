import { NextRequest, NextResponse } from "next/server";
import { BlogRepository } from "@/services/repositories/BlogRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tags = await BlogRepository.getAllTags();
    return NextResponse.json({ tags });
  } catch (err) {
    console.error("GET /api/admin/blog/tags:", err);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tag = await BlogRepository.createTag(body);
    if (!tag) {
      return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
    }
    return NextResponse.json({ tag }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/blog/tags:", err);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
