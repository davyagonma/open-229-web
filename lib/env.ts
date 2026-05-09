export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function requireSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return { url, anonKey };
}

/**
 * Lien d’invitation groupe WhatsApp (recommandé) ou numéro via wa.me.
 * Priorité : NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL > NEXT_PUBLIC_WHATSAPP_PHONE
 */
export function getWhatsAppHref(): string | null {
  const group = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL?.trim();
  if (group) return group;

  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.trim();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}
