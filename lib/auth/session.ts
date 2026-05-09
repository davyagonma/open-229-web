import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function getServerAuth(): Promise<{
  user: { id: string; email?: string | null } | null;
  username: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { user: null, username: null };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { user: null, username: null };
  }
  const { data: prof } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();
  return { user, username: prof?.username ?? null };
}
