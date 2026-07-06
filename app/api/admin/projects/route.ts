import { NextResponse } from "next/server";
import { ProjectRepository } from "@/services/repositories/ProjectRepository";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const projects = await ProjectRepository.getAll();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to read database" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject = await ProjectRepository.create(body);

    // Purge Next.js routing cache on new creation
    revalidatePath("/");
    revalidatePath("/showcase");

    return NextResponse.json(newProject);
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
