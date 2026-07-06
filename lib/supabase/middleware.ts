import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Session verification helper for Next.js App Router middleware gates
export async function supabaseMiddleware(request: NextRequest) {
  const sessionToken = request.cookies.get("annex-admin-session")?.value;
  
  if (sessionToken) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_anon_key"
      );
      const { data: { user }, error } = await supabase.auth.getUser(sessionToken);
      if (user && !error) {
        return { isAuthenticated: true, user };
      }
    } catch {
      // Fallback on token expiry or decoding failures
    }
  }

  return { isAuthenticated: false, user: null };
}
