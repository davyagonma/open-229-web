"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import type { ProjectCategory } from "@/lib/types/database";

export function ExploreSection() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState<ProjectCategory | "all">("all");

  function goSearch(overrides?: { q?: string; category?: ProjectCategory | "all" }) {
    const qq = overrides?.q ?? q;
    const cat = overrides?.category ?? active;
    const params = new URLSearchParams();
    if (qq.trim()) params.set("q", qq.trim());
    if (cat !== "all") params.set("category", cat);
    router.push(`/search?${params.toString()}`);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    goSearch();
  }

  function selectCategory(c: ProjectCategory | "all") {
    setActive(c);
    goSearch({ category: c });
  }

  const chips: { value: ProjectCategory | "all"; label: string }[] = [
    { value: "all", label: "All Projects" },
    ...CATEGORY_OPTIONS.slice(0, 5),
  ];

  return (
    <section id="explore" className="border-y border-gray-100 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-6">
        <form
          onSubmit={submitSearch}
          className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center"
        >
          <div className="group relative max-w-2xl flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-600 dark:text-neutral-500 dark:group-focus-within:text-green-500" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects by name, stack, or author..."
              className="w-full rounded-2xl border-2 border-transparent bg-gray-50 py-4 pl-12 pr-6 font-medium text-gray-900 outline-none transition-all focus:border-green-600 focus:bg-white dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:bg-neutral-950"
              name="q"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="mr-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
              Filter by:
            </span>
            {chips.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => selectCategory(c.value)}
                className={
                  active === c.value
                    ? "rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-green-100 dark:shadow-green-900/40"
                    : "rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }
              >
                {c.label}
              </button>
            ))}
            <Link
              href="/search"
              className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              All filters →
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
