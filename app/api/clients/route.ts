import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const clients = await ClientPortalRepository.getClients({ search, status });
    return NextResponse.json(clients);
  } catch (err) {
    console.error("GET /api/clients error:", err);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await ClientPortalRepository.createClient(body);
    return NextResponse.json(client, { status: 201 });
  } catch (err) {
    console.error("POST /api/clients error:", err);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
