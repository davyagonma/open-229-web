import Link from "next/link";
import { searchProjects } from "@/lib/data/projects";
import type { ProjectCategory } from "@/lib/types/database";
import { categoryLabel, CATEGORY_OPTIONS } from "@/lib/constants";
import { ProjectCard } from "@/frontend/components/project/ProjectCard";

const VALID: Set<string> = new Set(
  CATEGORY_OPTIONS.map((c) => c.value) as string[]
);

function parseCategory(v: string | undefined): ProjectCategory | undefined {
  if (!v || !VALID.has(v)) return undefined;
  return v as ProjectCategory;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const category = parseCategory(
    typeof sp.category === "string" ? sp.category : undefined
  );
  const sort =
    typeof sp.sort === "string" && sp.sort === "recently_updated"
      ? "recently_updated"
      : "most_stars";
  const page = Math.max(
    1,
    parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1
  );
  const min_stars =
    typeof sp.min_stars === "string"
      ? Math.max(0, parseInt(sp.min_stars, 10) || 0)
      : undefined;

  const { rows, total } = await searchProjects({
    q,
    category,
    sort,
    min_stars,
    page,
    page_size: 12,
  });

  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-black text-gray-900 md:text-5xl">
          Search projects
        </h1>
        <p className="mt-2 text-gray-600">
          {total} résultat{total !== 1 ? "s" : ""}
          {q ? (
            <>
              {" "}
              pour « <span className="font-semibold text-gray-900">{q}</span> »
            </>
          ) : null}
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          {category ? (
            <span className="rounded-full bg-green-50 px-3 py-1 font-semibold text-green-800">
              {categoryLabel(category)}
            </span>
          ) : null}
          {min_stars != null && min_stars > 0 ? (
            <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
              Stars: {min_stars}+
            </span>
          ) : null}
          <Link
            href="/search"
            className="rounded-full border border-gray-200 px-3 py-1 font-semibold text-gray-600 hover:bg-gray-50"
          >
            Clear filters
          </Link>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <span className="text-sm font-semibold text-gray-500">Sort:</span>
        <SortLinks current={sort} q={q} category={category} min_stars={min_stars} />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rows.map((p, i) => (
          <ProjectCard
            key={p.id}
            index={i}
            project={{
              slug: p.slug,
              name: p.name,
              short_description: p.short_description,
              stack: p.stack,
              stars_count: p.stars_count,
              category: p.category,
              demo_url: p.demo_url,
              github_url: p.github_url,
              gitlab_url: p.gitlab_url,
            }}
          />
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">
          Aucun projet. Essayez d’autres filtres ou{" "}
          <Link href="/add" className="text-indigo-600 underline">
            proposez-en un
          </Link>
          .
        </p>
      ) : null}

      {totalPages > 1 ? (
        <nav className="mt-16 flex justify-center gap-2">
          {page > 1 ? (
            <PageLink page={page - 1} q={q} category={category} sort={sort} min_stars={min_stars}>
              ← Prev
            </PageLink>
          ) : null}
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <PageLink page={page + 1} q={q} category={category} sort={sort} min_stars={min_stars}>
              Next →
            </PageLink>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}

function SortLinks({
  current,
  q,
  category,
  min_stars,
}: {
  current: "most_stars" | "recently_updated";
  q?: string;
  category?: ProjectCategory;
  min_stars?: number;
}) {
  const base = new URLSearchParams();
  if (q) base.set("q", q);
  if (category) base.set("category", category);
  if (min_stars != null) base.set("min_stars", String(min_stars));

  const m = new URLSearchParams(base);
  m.set("sort", "most_stars");
  const r = new URLSearchParams(base);
  r.set("sort", "recently_updated");

  return (
    <>
      <Link
        href={`/search?${m}`}
        className={
          current === "most_stars"
            ? "rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white"
            : "rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200"
        }
      >
        Most stars
      </Link>
      <Link
        href={`/search?${r}`}
        className={
          current === "recently_updated"
            ? "rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white"
            : "rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200"
        }
      >
        Recently updated
      </Link>
    </>
  );
}

function PageLink({
  page,
  children,
  q,
  category,
  sort,
  min_stars,
}: {
  page: number;
  children: React.ReactNode;
  q?: string;
  category?: ProjectCategory;
  sort: string;
  min_stars?: number;
}) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (category) p.set("category", category);
  p.set("sort", sort);
  p.set("page", String(page));
  if (min_stars != null) p.set("min_stars", String(min_stars));
  return (
    <Link
      href={`/search?${p}`}
      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white"
    >
      {children}
    </Link>
  );
}
