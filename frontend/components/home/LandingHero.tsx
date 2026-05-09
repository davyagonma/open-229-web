import Link from "next/link";
import { ArrowRight, Globe2, Share2, UsersRound } from "lucide-react";
import { WhatsAppCta } from "@/frontend/components/home/WhatsAppCta";

export function LandingHero({ whatsappHref }: { whatsappHref: string | null }) {
  return (
    <section className="relative overflow-hidden px-6 py-20 lg:py-28">
      <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/4 rounded-full bg-green-50 opacity-70 blur-3xl dark:bg-green-950/40 dark:opacity-50" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] translate-y-1/4 -translate-x-1/4 rounded-full bg-yellow-50 opacity-70 blur-3xl dark:bg-yellow-950/30 dark:opacity-40" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-red-600/5 blur-3xl dark:bg-red-500/10" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
            </span>
            Le répertoire open source du Bénin · 229
          </div>

          <h1 className="font-display mb-6 text-5xl font-black leading-[0.95] tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Montrez vos repos.
            <br />
            <span className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
              Inspirez le 229.
            </span>
          </h1>

          <p className="mx-auto mb-4 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-neutral-400 lg:mx-0 lg:text-xl">
            <strong className="font-semibold text-gray-900 dark:text-white">
              open-229
            </strong>{" "}
            est la vitrine collective des projets open source liés au Bénin —
            bibliothèques, outils, apps, données ouvertes. Recrutez des
            contributeurs, faites connaître votre stack et branchez-vous sur une
            communauté qui bosse pour tout le monde.
          </p>
          <p className="mx-auto mb-10 max-w-2xl text-base text-gray-500 dark:text-neutral-500 lg:mx-0">
            Pas besoin d’être à Cotonou pour participer : la carte se remplit
            grâce à vous. Une ligne de code ou un repo partagé = déjà un pas.
          </p>

          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
            <Link
              href="#explore"
              className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-green-700 dark:hover:shadow-green-900/40"
            >
              Explorer les projets
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-yellow-500 bg-yellow-400 px-8 py-4 text-lg font-bold text-gray-900 transition-all hover:bg-yellow-500"
            >
              Créer un compte
              <ArrowRight className="h-5 w-5" />
            </Link>
            {whatsappHref ? (
              <WhatsAppCta
                href={whatsappHref}
                variant="hero"
                label="Groupe WhatsApp"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
