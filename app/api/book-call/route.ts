import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Simple in-memory rate limiting map (IP -> Request Timestamps)
const ipCache = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 5; // max 5 requests
  const windowMs = 10 * 60 * 1000; // per 10 minutes

  const requests = ipCache.get(ip) || [];
  const validRequests = requests.filter((time) => now - time < windowMs);

  if (validRequests.length >= limit) {
    return true;
  }

  validRequests.push(now);
  ipCache.set(ip, validRequests);
  return false;
}

export async function POST(request: Request) {
  try {
    // 1. Rate limiting check
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 2. Parse request JSON
    const body = await request.json().catch(() => ({}));
    const { name, phone, consultation_type, address, preferred_date, preferred_time, notes } = body;

    // 3. Validation
    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ success: false, error: "Contact number is required." }, { status: 400 });
    }
    if (!consultation_type || !["Visit Us", "We Visit You"].includes(consultation_type)) {
      return NextResponse.json({ success: false, error: "Invalid consultation type." }, { status: 400 });
    }
    if (consultation_type === "We Visit You" && !address?.trim()) {
      return NextResponse.json({ success: false, error: "Address is required for location visits." }, { status: 400 });
    }
    if (!preferred_date?.trim()) {
      return NextResponse.json({ success: false, error: "Preferred date is required." }, { status: 400 });
    }
    if (!preferred_time?.trim()) {
      return NextResponse.json({ success: false, error: "Preferred time is required." }, { status: 400 });
    }

    // Date restriction check: Today or future only
    const bookingDate = new Date(preferred_date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return NextResponse.json({ success: false, error: "Preferred date cannot be in the past." }, { status: 400 });
    }

    const cleanPhone = phone.trim();
    const cleanName = name.trim();
    const cleanNotes = notes?.trim() || null;
    const cleanAddress = consultation_type === "We Visit You" ? address.trim() : null;

    const supabase = createAdminClient();

    // 4. Duplicate booking protection: same phone in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing, error: selectError } = await supabase
      .from("consultation_requests")
      .select("reference_id, name, consultation_type, preferred_date, preferred_time")
      .eq("phone", cleanPhone)
      .gte("created_at", oneDayAgo)
      .limit(1)
      .maybeSingle();

    if (selectError) {
      console.error("[Booking API] Select check error:", selectError);
      return NextResponse.json({ success: false, error: "Database verification failed." }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({
        success: true,
        duplicateDetected: true,
        message: "You already have a pending consultation request. Our team will contact you shortly.",
        booking: {
          reference_id: existing.reference_id,
          name: existing.name,
          consultation_type: existing.consultation_type,
          preferred_date: existing.preferred_date,
          preferred_time: existing.preferred_time,
        }
      });
    }

    // 5. Auto-generate reference number: ANNEX-YYYY-XXXXXX
    const year = new Date().getFullYear();
    let reference_id = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      attempts++;
      const randomSeq = Math.floor(100000 + Math.random() * 900000);
      const candidateId = `ANNEX-${year}-${randomSeq}`;
      
      const { data: duplicateCheck } = await supabase
        .from("consultation_requests")
        .select("id")
        .eq("reference_id", candidateId)
        .maybeSingle();

      if (!duplicateCheck) {
        reference_id = candidateId;
        isUnique = true;
      }
    }

    if (!reference_id) {
      return NextResponse.json({ success: false, error: "Failed to generate unique reference number." }, { status: 500 });
    }

    // 6. Insert new request
    const { error: insertError } = await supabase
      .from("consultation_requests")
      .insert([
        {
          reference_id,
          name: cleanName,
          phone: cleanPhone,
          consultation_type,
          address: cleanAddress,
          preferred_date,
          preferred_time,
          notes: cleanNotes,
          status: "Pending",
        }
      ]);

    if (insertError) {
      console.error("[Booking API] Insert error:", insertError);
      return NextResponse.json({ success: false, error: "Failed to save consultation request." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      duplicateDetected: false,
      message: "Your consultation has been booked.",
      booking: {
        reference_id,
        name: cleanName,
        consultation_type,
        preferred_date,
        preferred_time,
      }
    });
  } catch (err) {
    console.error("[Booking API] Server error:", err);
    return NextResponse.json({ success: false, error: "An unexpected server error occurred." }, { status: 500 });
  }
}
