import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { requireSupabaseEnv, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/lib/types/database";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  const { url: appUrl, anonKey } = requireSupabaseEnv();
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/signin?error=missing_code`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(appUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}${nextPath}`);
}
