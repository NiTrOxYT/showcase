import { NextRequest, NextResponse } from "next/server";
import { ConversionRepository } from "@/services/repositories/ConversionRepository";
import { supabaseMiddleware } from "@/lib/supabase/middleware";

export const dynamic = "force-dynamic";

// GET /api/leads - Admin only: fetch all leads
export async function GET(req: Request) {
  try {
    const { isAuthenticated } = await supabaseMiddleware(req as unknown as NextRequest);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const qualification = searchParams.get("qualification") || undefined;

    const leads = await ConversionRepository.getLeads({ search, status, qualification });
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("[API leads GET] Failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/leads - Public: create new lead from contact form
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serviceIds, ...leadData } = body;
    
    const lead = await ConversionRepository.createLead(leadData, serviceIds);
    if (!lead) {
      return NextResponse.json({ 
        error: "Lead creation failed",
        details: "Unable to insert lead record into database."
      }, { status: 400 });
    }
    return NextResponse.json({ lead });
  } catch (error: unknown) {
    console.error("[API leads POST] Failed:", error);
    const details = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ 
      error: "Lead submission failed", 
      details
    }, { status: 500 });
  }
}

// PUT /api/leads - Admin only: update lead status or add notes
export async function PUT(req: Request) {
  try {
    const { isAuthenticated, user } = await supabaseMiddleware(req as unknown as NextRequest);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, action, status, note } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
    }

    if (action === "update_status") {
      const success = await ConversionRepository.updateLeadStatus(id, status);
      return NextResponse.json({ success });
    }

    if (action === "add_note") {
      const newNote = await ConversionRepository.addLeadNote({
        lead_id: id,
        note: note,
        created_by: user?.id || null,
      });
      return NextResponse.json({ note: newNote });
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (error) {
    console.error("[API leads PUT] Failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
