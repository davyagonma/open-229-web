import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { requireSupabaseEnv } from "@/lib/env";

/** Route handlers & server-only: optional user JWT for RLS */
export function createRouteClient(accessToken: string | null) {
  const { url, anonKey } = requireSupabaseEnv();
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {},
  });
}

export function getBearerToken(
  request: Request
): string | null {
  const h = request.headers.get("authorization");
  if (!h?.toLowerCase().startsWith("bearer ")) return null;
  return h.slice(7).trim() || null;
}
