import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ClientPortalRepository } from "@/services/repositories/ClientPortalRepository";

export async function GET() {
  try {
    const templates = await ClientPortalRepository.getProposalTemplates();
    return NextResponse.json(templates);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch proposal templates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const template = await ClientPortalRepository.createProposalTemplate(body);
    return NextResponse.json(template, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create proposal template" }, { status: 500 });
  }
}
