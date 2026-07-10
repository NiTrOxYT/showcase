import { NextRequest, NextResponse } from "next/server";
import { BlogRepository } from "@/services/repositories/BlogRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await BlogRepository.getAllCategories();
    return NextResponse.json({ categories });
  } catch (err) {
    console.error("GET /api/admin/blog/categories:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category = await BlogRepository.createCategory(body);
    if (!category) {
      return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/blog/categories:", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
