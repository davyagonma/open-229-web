import { Globe2, Share2, Sparkles, UsersRound } from "lucide-react";

const items = [
  {
    icon: Globe2,
    title: "Visibilité nationale",
    body: "Vos dépôts GitHub, GitLab ou Gitea ne restent pas perdus : catégories, stack, démos — tout le monde peut découvrir ce qui se construit ici.",
  },
  {
    icon: Share2,
    title: "Partage simple",
    body: "Ajoutez un projet en quelques minutes : lien, description, tags. Idéal pour signaler aussi des projets d’amis ou d’associations que vous trouvez utiles.",
  },
  {
    icon: UsersRound,
    title: "Contributeurs & pairs",
    body: "Listez les mainteneurs, exposez la roadmap et attirez des devs, designers ou traducteur·ices qui veulent s’impliquer sur du concret.",
  },
];

export function LandingMission() {
  return (
    <section className="border-y border-gray-100 bg-white px-6 py-20 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            Pourquoi nous rejoindre
          </p>
          <h2 className="font-display text-3xl font-black text-gray-900 dark:text-white md:text-4xl">
            Une landing pour l’écosystème, pas seulement une liste
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-neutral-400">
            open-229 aide à faire circuler les bonnes idées, les bons outils et
            les bonnes personnes — sans remplacer GitHub, en complétant avec du
            contexte local et humain.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {items.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-[2rem] border-2 border-gray-100 bg-[#F9FAFB] p-8 transition-colors dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400">
                <Icon className="h-7 w-7" strokeWidth={2} />
              </div>
              <h3 className="font-display mb-3 text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-neutral-400">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
