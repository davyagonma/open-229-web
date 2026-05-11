import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExploreSection } from "@/frontend/components/home/ExploreSection";
import { FloatingWhatsApp } from "@/frontend/components/home/FloatingWhatsApp";
import { LandingFinalCta } from "@/frontend/components/home/LandingFinalCta";
import { LandingHero } from "@/frontend/components/home/LandingHero";
import { LandingHow } from "@/frontend/components/home/LandingHow";
import { LandingMission } from "@/frontend/components/home/LandingMission";
import { ProjectCard } from "@/frontend/components/project/ProjectCard";
import { getWhatsAppHref } from "@/lib/env";
import { getHomeProjects } from "@/lib/data/projects";
import type { ProjectRow } from "@/lib/types/database";

function toCard(p: ProjectRow) {
  return {
    slug: p.slug,
    name: p.name,
    short_description: p.short_description,
    stack: p.stack,
    stars_count: p.stars_count,
    category: p.category,
    demo_url: p.demo_url,
    github_url: p.github_url,
    gitlab_url: p.gitlab_url,
  };
}

export default async function HomePage() {
  const projects = await getHomeProjects(6);
  const whatsappHref = getWhatsAppHref();

  return (
    <>
      <LandingHero whatsappHref={whatsappHref} />
      <LandingMission />
      <LandingHow />
      <ExploreSection />

      <section className="px-4 py-16 sm:px-6 sm:py-20 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-balance text-2xl font-black text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
              Projets à la une
            </h2>
            <p className="mt-2 text-gray-600 dark:text-neutral-400">
              Un aperçu du catalogue — la suite est dans l’exploration.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 dark:text-neutral-400">
                Aucun projet pour l’instant. Créez un compte et{" "}
                <Link
                  href="/add"
                  className="font-semibold text-green-700 underline dark:text-green-400"
                >
                  ajoutez le premier
                </Link>{" "}
                — ou annoncez-le sur WhatsApp si le lien est configuré.
              </p>
            ) : (
              projects.map((p, i) => (
                <ProjectCard key={p.id} project={toCard(p)} index={i} />
              ))
            )}
          </div>
          <div className="mt-16 text-center">
            <Link
              href="/search"
              className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-900 px-6 py-3 text-center text-base font-bold text-gray-900 transition-all hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900 sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
            >
              Tout parcourir
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <LandingFinalCta whatsappHref={whatsappHref} />
      <FloatingWhatsApp href={whatsappHref} />
    </>
  );
}
