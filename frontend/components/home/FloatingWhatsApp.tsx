import { WhatsAppCta } from "@/frontend/components/home/WhatsAppCta";

/** Bouton flottant — très visible sur mobile & desktop */
export function FloatingWhatsApp({ href }: { href: string | null }) {
  if (!href) return null;
  return <WhatsAppCta href={href} variant="floating" />;
}
