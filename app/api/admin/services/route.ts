import { NextResponse } from "next/server";
import { ServiceRepository } from "@/services/repositories/ServiceRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await ServiceRepository.getAll();
    return NextResponse.json({ services });
  } catch (error) {
    console.error("GET services failed:", error);
    return NextResponse.json({ error: "Failed to load services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const service = await ServiceRepository.create(body);
    if (!service) {
      return NextResponse.json({ error: "Failed to create service page" }, { status: 400 });
    }
    return NextResponse.json({ service });
  } catch (error) {
    console.error("POST services failed:", error);
    return NextResponse.json({ error: "Failed to save service page" }, { status: 500 });
  }
}
