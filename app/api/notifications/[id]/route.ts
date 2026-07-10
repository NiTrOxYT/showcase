import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string }> }

export async function PATCH(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await ClientPortalRepository.markRead(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to mark notification read" }, { status: 500 });
  }
}
