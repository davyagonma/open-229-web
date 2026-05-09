import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";
import { isSupabaseConfigured, requireSupabaseEnv } from "@/lib/env";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  const { url, anonKey } = requireSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
