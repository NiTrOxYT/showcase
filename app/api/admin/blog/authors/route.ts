import { NextRequest, NextResponse } from "next/server";
import { BlogRepository } from "@/services/repositories/BlogRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authors = await BlogRepository.getAllAuthors();
    return NextResponse.json({ authors });
  } catch (err) {
    console.error("GET /api/admin/blog/authors:", err);
    return NextResponse.json({ error: "Failed to fetch authors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const author = await BlogRepository.createAuthor(body);
    if (!author) {
      return NextResponse.json({ error: "Failed to create author" }, { status: 500 });
    }
    return NextResponse.json({ author }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/blog/authors:", err);
    return NextResponse.json({ error: "Failed to create author" }, { status: 500 });
  }
}
