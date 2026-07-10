import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const template = await ClientPortalRepository.getProposalTemplateById(id);
    if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(template);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch proposal template" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const template = await ClientPortalRepository.updateProposalTemplate(id, body);
    return NextResponse.json(template);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update proposal template" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await ClientPortalRepository.deleteProposalTemplate(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete proposal template" }, { status: 500 });
  }
}
