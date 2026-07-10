import { NextRequest, NextResponse } from "next/server";
import { ConversionRepository } from "@/services/repositories/ConversionRepository";
import { supabaseMiddleware } from "@/lib/supabase/middleware";

export const dynamic = "force-dynamic";

// POST /api/bookings - Public: Request a consultation booking
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      full_name,
      company,
      email,
      phone,
      website,
      company_size,
      project_type,
      message,
      lead_source = "Website Booking",
      serviceIds = [],
      booking_type,
      requested_date,
      requested_time,
      timezone,
    } = body;

    if (!full_name || !email || !booking_type || !requested_date || !requested_time || !timezone) {
      return NextResponse.json({ error: "Missing required booking or contact details" }, { status: 400 });
    }

    // 1. Create Lead
    const lead = await ConversionRepository.createLead({
      full_name,
      company,
      email,
      phone,
      website,
      company_size,
      project_type,
      message,
      lead_source,
    }, serviceIds);

    if (!lead || !lead.id) {
      return NextResponse.json({ 
        error: "Lead creation failed",
        details: "Unable to insert lead record into database."
      }, { status: 500 });
    }

    // 2. Create Booking
    const booking = await ConversionRepository.createBooking({
      lead_id: lead.id,
      booking_type,
      requested_date,
      requested_time,
      timezone,
    });

    if (!booking) {
      return NextResponse.json({
        error: "Booking creation failed",
        details: "Lead was created but scheduling slot could not be reserved."
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, leadId: lead.id, bookingId: booking.id });
  } catch (error: unknown) {
    console.error("[API bookings POST] Failed:", error);
    const details = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ 
      error: "Booking request failed", 
      details
    }, { status: 500 });
  }
}

// PUT /api/bookings - Admin only: update booking status
export async function PUT(req: Request) {
  try {
    const { isAuthenticated } = await supabaseMiddleware(req as unknown as NextRequest);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing booking ID or status" }, { status: 400 });
    }

    const success = await ConversionRepository.updateBookingStatus(id, status);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("[API bookings PUT] Failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
