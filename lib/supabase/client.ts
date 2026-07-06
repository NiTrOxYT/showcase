import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { env } from "@/lib/env";

// Client component / browser-safe Supabase instance using the public anonymous key
export const supabaseClient = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
