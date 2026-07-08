import { NextResponse } from "next/server";
import { ConsultationRepository } from "@/services/repositories/ConsultationRepository";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status } = body;

    if (!status || !["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const success = await ConsultationRepository.updateStatus(id, status);
    if (!success) {
      return NextResponse.json({ error: "Failed to update consultation status." }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, status });
  } catch (err) {
    console.error("[Consultation PATCH API] Error:", err);
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}
