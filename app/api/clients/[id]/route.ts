import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const client = await ClientPortalRepository.getClientById(id);
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(client);
  } catch (err) {
    console.error("GET /api/clients/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const client = await ClientPortalRepository.updateClient(id, body);
    return NextResponse.json(client);
  } catch (err) {
    console.error("PATCH /api/clients/[id] error:", err);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}
