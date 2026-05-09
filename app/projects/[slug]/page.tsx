import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  Code,
  Package,
  Star,
  GitFork,
  Users,
} from "lucide-react";
import { getProjectBySlug } from "@/lib/data/projects";
import { categoryLabel, statusLabel } from "@/lib/constants";
import { ProjectCard } from "@/frontend/components/project/ProjectCard";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data) return { title: "Project" };
  return {
    title: data.project.name,
    description: data.project.short_description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data) notFound();

  const { project, submitter, contributors, similar } = data;

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold">
            {categoryLabel(project.category)}
          </span>
          {project.version_label ? (
            <span>{project.version_label}</span>
          ) : null}
          {project.license ? <span>{project.license}</span> : null}
        </div>
        <h1 className="font-display text-4xl font-black text-gray-900 md:text-5xl">
          {project.name}
        </h1>
        <p className="mt-4 text-xl text-gray-600">{project.short_description}</p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-4 w-4 text-yellow-500" />
            {project.stars_count} stars
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GitFork className="h-4 w-4" />
            {project.forks_count} forks
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {contributors.length} contributors
          </span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.demo_url ? (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
            >
              <ExternalLink className="h-5 w-5" />
              Live demo
            </a>
          ) : null}
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-900 hover:border-gray-400"
            >
              <Code className="h-5 w-5" />
              GitHub
            </a>
          ) : null}
          {project.gitlab_url ? (
            <a
              href={project.gitlab_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-900 hover:border-gray-400"
            >
              <Package className="h-5 w-5" />
              GitLab
            </a>
          ) : null}
        </div>
      </header>

      {submitter ? (
        <p className="mb-10 text-sm text-gray-500">
          Submitted by{" "}
          <Link
            href={`/u/${submitter.username}`}
            className="font-semibold text-indigo-600 hover:underline"
          >
            @{submitter.username}
          </Link>
        </p>
      ) : null}

      <section className="mb-12">
        <h2 className="font-display mb-4 text-2xl font-bold">Overview</h2>
        <div className="prose prose-gray max-w-none text-gray-700">
          {project.full_description ? (
            <div className="whitespace-pre-wrap">{project.full_description}</div>
          ) : (
            <p className="text-gray-500">No long description yet.</p>
          )}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Status: {statusLabel(project.status)}
        </p>
      </section>

      {project.stack?.length ? (
        <section className="mb-12">
          <h2 className="font-display mb-4 text-2xl font-bold">Built with</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <span
                key={t}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-800"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {contributors.length > 0 ? (
        <section className="mb-12">
          <h2 className="font-display mb-6 text-2xl font-bold">Contributors</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {contributors.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border border-gray-100 bg-white p-4"
              >
                <p className="font-semibold text-gray-900">
                  {c.username ? (
                    <Link
                      href={`/u/${c.username}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {c.display_name}
                    </Link>
                  ) : (
                    c.display_name
                  )}
                </p>
                {c.role ? (
                  <p className="text-sm text-gray-500">{c.role}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {similar.length > 0 ? (
        <section>
          <h2 className="font-display mb-8 text-2xl font-bold">
            Similar projects
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {similar.map((s, i) => (
              <ProjectCard
                key={s.slug}
                index={i}
                project={{
                  slug: s.slug,
                  name: s.name,
                  short_description: s.short_description,
                  stack: s.stack,
                  stars_count: s.stars_count,
                  category: s.category,
                  demo_url: null,
                  github_url: null,
                  gitlab_url: null,
                }}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
