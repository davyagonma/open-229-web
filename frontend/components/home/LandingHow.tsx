import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Inscrivez-vous",
    text: "Un compte suffit pour publier et suivre vos fiches. C’est gratuit et ça nous aide à limiter le spam.",
  },
  {
    n: "02",
    title: "Référencez ou enrichissez",
    text: "Ajoutez votre repo ou celui d’un projet béninois dont vous êtes fier : description, stack, liens, démo.",
  },
  {
    n: "03",
    title: "Discutez & contribuez",
    text: "Passez sur le groupe WhatsApp pour poser des questions, trouver une issue « good first », ou présenter votre idée.",
  },
];

export function LandingHow() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-black text-gray-900 dark:text-white md:text-4xl">
            Comment ça marche ?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-neutral-400">
            Trois étapes pour passer de curieux à contributeur.
          </p>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-gray-200 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <span className="font-display text-5xl font-black text-gray-100 dark:text-neutral-800">
                {s.n}
              </span>
              <h3 className="-mt-4 font-display text-xl font-bold text-gray-900 dark:text-white">
                {s.title}
              </h3>
              <p className="mt-3 leading-relaxed text-gray-600 dark:text-neutral-400">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-center text-sm text-gray-500 dark:text-neutral-500">
          Vous préférez lire le code ?{" "}
          <Link href="/search" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            Parcourez le catalogue
          </Link>{" "}
          ou ouvrez une discussion sur GitHub.
        </p>
      </div>
    </section>
  );
}
