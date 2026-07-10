import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const project = await ClientPortalRepository.getProjectById(id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error("GET /api/delivery-projects/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const project = await ClientPortalRepository.updateProject(id, body);
    return NextResponse.json(project);
  } catch (err) {
    console.error("PATCH /api/delivery-projects/[id] error:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
