import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  Code,
  Package,
  Languages,
  Map,
  Sprout,
  ShoppingBag,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import type { ProjectCategory } from "@/lib/types/database";
import { categoryLabel } from "@/lib/constants";

const ACCENT = [
  { border: "hover:border-emerald-500 hover:shadow-emerald-50", iconBg: "bg-emerald-50", iconText: "text-emerald-600", title: "group-hover:text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { border: "hover:border-green-500 hover:shadow-green-50", iconBg: "bg-green-50", iconText: "text-green-600", title: "group-hover:text-green-600", badge: "bg-green-50 text-green-700 border-green-100" },
  { border: "hover:border-sky-500 hover:shadow-sky-50", iconBg: "bg-sky-50", iconText: "text-sky-600", title: "group-hover:text-sky-600", badge: "bg-sky-50 text-sky-700 border-sky-100" },
  { border: "hover:border-pink-500 hover:shadow-pink-50", iconBg: "bg-pink-50", iconText: "text-pink-600", title: "group-hover:text-pink-600", badge: "bg-pink-50 text-pink-700 border-pink-100" },
  { border: "hover:border-violet-500 hover:shadow-violet-50", iconBg: "bg-violet-50", iconText: "text-violet-600", title: "group-hover:text-violet-600", badge: "bg-violet-50 text-violet-700 border-violet-100" },
  { border: "hover:border-red-500 hover:shadow-red-50", iconBg: "bg-red-50", iconText: "text-red-600", title: "group-hover:text-red-600", badge: "bg-red-50 text-red-700 border-red-100" },
];

const ICON_BY_CATEGORY: Record<ProjectCategory, LucideIcon> = {
  ai_ml: Languages,
  web_app: Map,
  mobile: Map,
  fintech: ShoppingBag,
  data_science: Sprout,
  education: HeartPulse,
  iot: Sprout,
  utils: Map,
  blockchain: ShoppingBag,
  security: HeartPulse,
  e_commerce: ShoppingBag,
  other: Languages,
};

export type ProjectCardModel = {
  slug: string;
  name: string;
  short_description: string;
  stack: string[];
  stars_count: number;
  category: ProjectCategory;
  demo_url: string | null;
  github_url: string | null;
  gitlab_url: string | null;
};

function cardIcon(category: ProjectCategory): LucideIcon {
  return ICON_BY_CATEGORY[category] ?? Languages;
}

export function ProjectCard({
  project,
  index = 0,
}: {
  project: ProjectCardModel;
  index?: number;
}) {
  const a = ACCENT[index % ACCENT.length];
  const Icon = cardIcon(project.category);
  const stackShow = project.stack.slice(0, 3);
  const categoryTag = categoryLabel(project.category);

  return (
    <article
      className={`group flex flex-col rounded-[2rem] border-2 border-gray-100 bg-white p-8 transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 ${a.border} hover:shadow-2xl`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${a.iconBg}`}
        >
          <Icon className={`h-7 w-7 ${a.iconText}`} aria-hidden />
        </div>
        <div className="flex gap-2">
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-gray-400 transition-colors hover:text-gray-900 dark:text-neutral-500 dark:hover:text-white"
              aria-label="GitHub"
            >
              <Code className="h-5 w-5" />
            </a>
          ) : null}
          {project.gitlab_url ? (
            <a
              href={project.gitlab_url}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-gray-400 transition-colors hover:text-gray-900 dark:text-neutral-500 dark:hover:text-white"
              aria-label="GitLab"
            >
              <Package className="h-5 w-5" />
            </a>
          ) : null}
          {project.demo_url ? (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-gray-400 transition-colors hover:text-gray-900 dark:text-neutral-500 dark:hover:text-white"
              aria-label="Demo"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          ) : null}
        </div>
      </div>
      <Link href={`/projects/${project.slug}`}>
        <h3 className={`font-display mb-3 text-2xl font-bold text-gray-900 transition-colors dark:text-white ${a.title}`}>
          {project.name}
        </h3>
      </Link>
      <p className="mb-8 line-clamp-2 leading-relaxed text-gray-600 dark:text-neutral-400">
        {project.short_description}
      </p>
      <div className="mb-8 flex flex-wrap gap-2">
        {stackShow.map((t) => (
          <span
            key={t}
            className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {t}
          </span>
        ))}
        <span
          className={`rounded-lg border px-3 py-1 text-xs font-bold ${a.badge}`}
        >
          {categoryTag}
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-6 dark:border-neutral-800">
        <div className="flex -space-x-2">
          <Image
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(project.slug)}`}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border-2 border-white bg-gray-100"
          />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
          {project.stars_count} Stars
        </span>
      </div>
    </article>
  );
}
