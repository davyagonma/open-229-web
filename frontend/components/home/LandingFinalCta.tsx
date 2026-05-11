import Link from "next/link";
import { HeartHandshake, PartyPopper } from "lucide-react";
import { WhatsAppCta } from "@/frontend/components/home/WhatsAppCta";

export function LandingFinalCta({ whatsappHref }: { whatsappHref: string | null }) {
  return (
    <section
      id="community"
      className="relative overflow-hidden bg-gray-900 py-24 dark:bg-black"
    >
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="grid -translate-y-24 rotate-12 grid-cols-6 gap-3 sm:gap-4">
          <div className="h-28 rounded-2xl bg-green-700 sm:h-40" />
          <div className="h-28 rounded-2xl bg-yellow-500 sm:h-40" />
          <div className="h-28 rounded-2xl bg-emerald-600 sm:h-40" />
          <div className="h-28 rounded-2xl bg-green-600 sm:h-40" />
          <div className="h-28 rounded-2xl bg-yellow-400 sm:h-40" />
          <div className="h-28 rounded-2xl bg-teal-600 sm:h-40" />
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-green-300">
          <PartyPopper className="h-4 w-4" />
          Ambiance communauté
        </p>
        <h2 className="font-display mb-6 text-balance text-3xl font-black text-white sm:text-4xl md:text-5xl">
          Envie de pitcher un projet, trouver un binôme ou débugger à plusieurs ?
        </h2>
        <p className="mx-auto mb-4 text-lg text-gray-300">
          Le groupe WhatsApp, c’est le canal du quotidien : annonces courtes,
          entraide rapide, et rencontres entre devs du 229 et de la diaspora.
          Pas de spam marketing — juste du partage technique et bienveillant.
        </p>
        <p className="mx-auto mb-10 flex items-center justify-center gap-2 text-sm text-gray-400">
          <HeartHandshake className="h-4 w-4 text-green-400" />
          Rejoignez la conversation, puis ajoutez vos repos sur la plateforme.
        </p>

        <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
          {whatsappHref ? (
            <WhatsAppCta
              href={whatsappHref}
              variant="large"
              label="Rejoindre sur WhatsApp"
            />
          ) : null}
          <Link
            href="/join"
            className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-2xl border-2 border-white/30 bg-white/10 px-6 py-4 text-center text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            Créer mon compte open-229
          </Link>
          <Link
            href="/search"
            className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 text-center text-lg font-bold text-gray-900 transition-all hover:bg-yellow-500 sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            Voir le catalogue
          </Link>
        </div>
        {!whatsappHref ? (
          <p className="mt-8 text-sm text-gray-500">
            {process.env.NODE_ENV === "development" ? (
              <>
                Lien WhatsApp : ajoutez{" "}
                <code className="rounded bg-white/10 px-2 py-0.5 text-gray-300">
                  NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL
                </code>{" "}
                ou{" "}
                <code className="rounded bg-white/10 px-2 py-0.5 text-gray-300">
                  NEXT_PUBLIC_WHATSAPP_PHONE
                </code>{" "}
                dans{" "}
                <code className="rounded bg-white/10 px-1">.env.local</code>{" "}
                (voir README).
              </>
            ) : (
              <>
                L’accès WhatsApp communautaire sera annoncé ici — en attendant,
                créez un compte et explorez le catalogue.
              </>
            )}
          </p>
        ) : null}
      </div>
    </section>
  );
}
