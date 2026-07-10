import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const phase = searchParams.get("phase") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const projects = await ClientPortalRepository.getProjects({ clientId, status, phase, search });
    return NextResponse.json(projects);
  } catch (err) {
    console.error("GET /api/delivery-projects error:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const project = await ClientPortalRepository.createProject(body);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("POST /api/delivery-projects error:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
