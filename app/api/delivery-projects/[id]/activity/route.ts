import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const activity = await ClientPortalRepository.getActivity(id);
    return NextResponse.json(activity);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}
