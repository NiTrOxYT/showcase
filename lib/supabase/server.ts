import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { env } from "@/lib/env";

// Server-side privileged client using service role key (Never import in client components!)
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey || serviceRoleKey === "placeholder_service_role_key") {
    // Fallback to anon key in local environment if service role is not defined yet
    return createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};
