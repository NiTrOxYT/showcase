import { NextResponse } from "next/server";
import { ProjectRepository } from "@/services/repositories/ProjectRepository";

export async function GET() {
  try {
    const projects = ProjectRepository.getAll();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to read database" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject = ProjectRepository.create(body);
    return NextResponse.json(newProject);
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
