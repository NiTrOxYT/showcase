/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { ConversionRepository } from "@/services/repositories/ConversionRepository";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/analytics/events - Public/Admin: Fetch recent conversion events for widgets
export async function GET() {
  try {
    const supabase = createAdminClient() as any;
    const { data, error } = await supabase
      .from("conversion_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("[API analytics GET] Error:", error);
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }

    return NextResponse.json({ events: data || [] });
  } catch (error) {
    console.error("[API analytics GET] Failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/analytics/events - Public: Log a new tracking/conversion event
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event_type, page_url, referrer, session_id, details } = body;

    if (!event_type || !page_url) {
      return NextResponse.json({ error: "Missing event type or page URL" }, { status: 400 });
    }

    const success = await ConversionRepository.logConversionEvent({
      event_type,
      page_url,
      referrer,
      session_id,
      details,
    });

    return NextResponse.json({ success });
  } catch (error) {
    console.error("[API analytics POST] Failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
