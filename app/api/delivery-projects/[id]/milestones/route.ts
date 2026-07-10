import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const milestones = await ClientPortalRepository.getMilestones(id);
    return NextResponse.json(milestones);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const milestone = await ClientPortalRepository.createMilestone({ ...body, project_id: id });
    return NextResponse.json(milestone, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { milestoneId, reorder, orderedIds, ...data } = body;
    if (reorder && orderedIds) {
      await ClientPortalRepository.reorderMilestones(projectId, orderedIds);
      return NextResponse.json({ ok: true });
    }
    const milestone = await ClientPortalRepository.updateMilestone(milestoneId, data);
    return NextResponse.json(milestone);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    await ClientPortalRepository.deleteMilestone(body.milestoneId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 });
  }
}
