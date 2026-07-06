import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email || "admin@annex.com", // sensible default fallback email
      password,
    });

    if (error || !data.session) {
      return NextResponse.json({ success: false, error: error?.message || "Invalid credentials" }, { status: 401 });
    }

    const session = data.session;
    const cookieStore = await cookies();
    cookieStore.set("annex-admin-session", session.access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: session.expires_in,
    });

    return NextResponse.json({
      success: true,
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}
