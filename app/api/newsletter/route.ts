import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Simple in-memory rate limiting map (IP -> Request Timestamps)
const ipCache = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 5; // max 5 requests
  const windowMs = 60 * 1000; // per 1 minute

  const requests = ipCache.get(ip) || [];
  // Filter out requests older than the window
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
        { success: false, error: "Too many subscription attempts. Please try again later." },
        { status: 429 }
      );
    }

    // 2. Parse request JSON
    const body = await request.json().catch(() => ({}));
    const rawEmail = body.email;

    if (!rawEmail || typeof rawEmail !== "string") {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    // 3. Trim and lowercase email
    const email = rawEmail.trim().toLowerCase();

    // 4. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 5. Connect to Supabase
    const supabase = createAdminClient();

    // 6. Check if duplicate email already exists
    const { data: existing, error: selectError } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (selectError) {
      console.error("[Newsletter API] Error checking existing email:", selectError);
      return NextResponse.json(
        { success: false, error: "Database error. Please try again." },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: "You're already subscribed."
      });
    }

    // 7. Insert new subscriber
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email,
          source: "website_footer"
        }
      ]);

    if (insertError) {
      // Check for unique key violation if race condition occurred
      if (insertError.code === "23505") {
        return NextResponse.json({
          success: true,
          alreadySubscribed: true,
          message: "You're already subscribed."
        });
      }
      console.error("[Newsletter API] Error inserting email:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to store subscription." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list."
    });
  } catch (err) {
    console.error("[Newsletter API] Server error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
