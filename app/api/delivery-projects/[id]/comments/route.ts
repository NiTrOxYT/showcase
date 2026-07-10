import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const comments = await ClientPortalRepository.getComments("delivery_project", id);
    return NextResponse.json(comments);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const comment = await ClientPortalRepository.addComment({
      entity_type: "delivery_project",
      entity_id: id,
      ...body,
      attachments: body.attachments ?? [],
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
