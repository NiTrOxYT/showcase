import { NextResponse } from "next/server";
import { ServiceRepository } from "@/services/repositories/ServiceRepository";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await ServiceRepository.getById(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ service });
  } catch (error) {
    console.error("GET service by ID failed:", error);
    return NextResponse.json({ error: "Failed to fetch service details" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const service = await ServiceRepository.update(id, body);
    if (!service) {
      return NextResponse.json({ error: "Failed to update service" }, { status: 400 });
    }
    return NextResponse.json({ service });
  } catch (error) {
    console.error("PUT service failed:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = await ServiceRepository.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete service" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE service failed:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
