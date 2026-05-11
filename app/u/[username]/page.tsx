import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicProfile } from "@/lib/data/projects";
import { ProjectCard } from "@/frontend/components/project/ProjectCard";
import { MapPin, Calendar } from "lucide-react";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await getPublicProfile(username);
  if (!data) return { title: "Profil" };
  const n = data.profile.display_name ?? data.profile.username;
  return {
    title: `${n} (@${data.profile.username})`,
    description: data.profile.bio ?? "",
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const data = await getPublicProfile(username);
  if (!data) notFound();

  const { profile, projects_submitted, projects_contributed } = data;
  const totalStars =
    projects_submitted.reduce((a, p) => a + p.stars_count, 0) +
    projects_contributed.reduce((a, p) => a + p.stars_count, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-12 flex flex-col gap-8 border-b border-gray-100 pb-12 md:flex-row md:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-gray-200">
          <Image
            src={
              profile.avatar_url ??
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.username)}`
            }
            alt=""
            width={112}
            height={112}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
        <div>
          <h1 className="font-display text-balance text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
            {profile.display_name ?? profile.username}
          </h1>
          <p className="mt-1 text-lg text-green-700 dark:text-green-400">@{profile.username}</p>
          {profile.location ? (
            <p className="mt-2 flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </p>
          ) : null}
          <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            Membre depuis{" "}
            {new Date(profile.created_at).toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </p>
          {profile.bio ? (
            <p className="mt-6 max-w-2xl leading-relaxed text-gray-700">
              {profile.bio}
            </p>
          ) : null}

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Projets" value={projects_submitted.length} />
            <Stat label="Stars (total)" value={totalStars} />
            <Stat
              label="Contributions"
              value={projects_contributed.length}
            />
          </div>
        </div>
      </header>

      <section className="mb-16">
        <h2 className="font-display mb-6 text-2xl font-bold">Projets publiés</h2>
        {projects_submitted.length === 0 ? (
          <p className="text-gray-500">Aucun projet listé pour l’instant.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects_submitted.map((p, i) => (
              <ProjectCard
                key={p.slug}
                index={i}
                project={{
                  slug: p.slug,
                  name: p.name,
                  short_description: p.short_description,
                  stack: p.stack,
                  stars_count: p.stars_count,
                  category: p.category,
                  demo_url: null,
                  github_url: null,
                  gitlab_url: null,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display mb-6 text-2xl font-bold">
          Contributions
        </h2>
        {projects_contributed.length === 0 ? (
          <p className="text-gray-500">Aucune contribution référencée.</p>
        ) : (
          <ul className="space-y-4">
            {projects_contributed.map((p) => (
              <li
                key={p.slug}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5"
              >
                <div>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="font-display text-lg font-bold text-gray-900 hover:text-green-700 dark:text-white dark:hover:text-green-400"
                  >
                    {p.name}
                  </Link>
                  <p className="mt-1 text-sm text-gray-600">
                    {p.short_description}
                  </p>
                </div>
                {p.role ? (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-800">
                    {p.role}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-12 text-center">
        <Link
          href="/add"
          className="font-semibold text-green-700 hover:underline dark:text-green-400"
        >
          Proposer un projet →
        </Link>
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center">
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
    </div>
  );
}
