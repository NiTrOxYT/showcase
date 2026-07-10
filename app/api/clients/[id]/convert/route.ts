import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string }> }

// POST /api/clients/[id]/convert — converts a Won lead into a client+project
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { id: leadId } = await params;
    const result = await ClientPortalRepository.convertLeadToClient(leadId);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/clients/[id]/convert error:", err);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
