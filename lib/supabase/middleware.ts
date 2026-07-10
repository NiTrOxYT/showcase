import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { PortalSession } from "@/types/portal";

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

// Portal session resolver — validates Supabase Auth session + resolves client_users profile
export async function getPortalSession(request: NextRequest): Promise<PortalSession | null> {
  // Supabase stores session in sb-<project>-auth-token cookie
  const allCookies = request.cookies.getAll();
  const authCookie = allCookies.find(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  if (!authCookie?.value) return null;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_anon_key"
    );

    const { data: { user }, error } = await supabase.auth.getUser(authCookie.value);
    if (!user || error) return null;

    // Look up client_users profile using service role to bypass RLS
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder_service_role"
    );

    const { data: clientUser } = await adminClient
      .from("client_users")
      .select("id, client_id, role, name, email")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (!clientUser) return null;

    return {
      authUserId: user.id,
      clientUserId: clientUser.id,
      clientId: clientUser.client_id,
      role: clientUser.role,
      name: clientUser.name,
      email: clientUser.email,
    };
  } catch {
    return null;
  }
}

// Unused — kept for NextResponse import consumers
export { NextResponse };
