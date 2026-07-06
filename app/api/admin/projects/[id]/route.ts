/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { ProjectRepository } from "@/services/repositories/ProjectRepository";
import { revalidatePath } from "next/cache";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await ProjectRepository.update(id, body);
    
    // Purge caches for all dynamic segments
    revalidatePath("/");
    revalidatePath("/showcase");
    revalidatePath(`/showcase/${updated.slug}`);

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await ProjectRepository.delete(id);
    if (deleted) {
      // Purge caches
      revalidatePath("/");
      revalidatePath("/showcase");
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
