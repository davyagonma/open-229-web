import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { ProjectCategory } from "@/lib/types/database";
import type { ProjectRow } from "@/lib/types/database";

const projectListColumns =
  "id, slug, name, short_description, category, stack, stars_count, forks_count, demo_url, github_url, gitlab_url, updated_at" as const;

export async function getHomeProjects(limit = 6): Promise<ProjectRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(projectListColumns)
    .eq("is_published", true)
    .order("stars_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as unknown as ProjectRow[];
}

export async function searchProjects(opts: {
  q?: string;
  category?: ProjectCategory;
  sort?: "most_stars" | "recently_updated";
  min_stars?: number;
  page?: number;
  page_size?: number;
}): Promise<{ rows: ProjectRow[]; total: number }> {
  if (!isSupabaseConfigured()) return { rows: [], total: 0 };
  const supabase = await createClient();
  const page = opts.page ?? 1;
  const page_size = Math.min(opts.page_size ?? 12, 50);
  let q = supabase
    .from("projects")
    .select(projectListColumns, { count: "exact" })
    .eq("is_published", true);

  if (opts.category) q = q.eq("category", opts.category);
  if (opts.min_stars != null) q = q.gte("stars_count", opts.min_stars);
  const t = opts.q?.trim().replace(/[%_]/g, "");
  if (t?.length) {
    q = q.or(
      `name.ilike.%${t}%,short_description.ilike.%${t}%,primary_language.ilike.%${t}%`
    );
  }

  if (opts.sort === "recently_updated") {
    q = q.order("updated_at", { ascending: false });
  } else {
    q = q.order("stars_count", { ascending: false });
  }

  const from = (page - 1) * page_size;
  const to = from + page_size - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) {
    console.error(error);
    return { rows: [], total: 0 };
  }
  return { rows: (data ?? []) as unknown as ProjectRow[], total: count ?? 0 };
}

export async function getProjectBySlug(slug: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !project) return null;

  const { data: submitter } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url")
    .eq("id", project.submitted_by)
    .maybeSingle();

  const { data: contributorsRaw } = await supabase
    .from("project_contributors")
    .select("id, display_name, role, profile_id, sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true });

  type C = {
    id: string;
    display_name: string;
    role: string | null;
    profile_id: string | null;
    sort_order: number;
    username: string | null;
  };

  const contributors: C[] =
    contributorsRaw?.map((c) => ({
      ...c,
      username: null as string | null,
    })) ?? [];

  for (const c of contributors) {
    if (c.profile_id) {
      const { data: pr } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", c.profile_id)
        .maybeSingle();
      c.username = pr?.username ?? null;
    }
  }

  const { data: similar } = await supabase
    .from("projects")
    .select("slug, name, short_description, stack, category, stars_count")
    .eq("category", project.category)
    .eq("is_published", true)
    .neq("id", project.id)
    .order("stars_count", { ascending: false })
    .limit(4);

  return {
    project,
    submitter: submitter ?? null,
    contributors: contributors ?? [],
    similar: similar ?? [],
  };
}

export async function getPublicProfile(username: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, bio, location, avatar_url, created_at"
    )
    .eq("username", username)
    .maybeSingle();
  if (error || !profile) return null;

  const { data: submitted } = await supabase
    .from("projects")
    .select(
      "slug, name, short_description, stack, category, stars_count"
    )
    .eq("is_published", true)
    .eq("submitted_by", profile.id)
    .order("stars_count", { ascending: false });

  const { data: contribLinks } = await supabase
    .from("project_contributors")
    .select("role, project_id")
    .eq("profile_id", profile.id);

  const ids = contribLinks?.map((c) => c.project_id) ?? [];
  let contributed: {
    slug: string;
    name: string;
    short_description: string;
    stack: string[];
    category: ProjectCategory;
    stars_count: number;
    role: string | null;
  }[] = [];

  if (ids.length > 0) {
    const { data: cp } = await supabase
      .from("projects")
      .select(
        "id, slug, name, short_description, stack, category, stars_count, is_published"
      )
      .in("id", ids)
      .eq("is_published", true);

    const roleByProject = new Map(
      (contribLinks ?? []).map((c) => [c.project_id, c.role])
    );
    contributed =
      cp?.map((p) => ({
        slug: p.slug,
        name: p.name,
        short_description: p.short_description,
        stack: p.stack,
        category: p.category,
        stars_count: p.stars_count,
        role: roleByProject.get(p.id) ?? null,
      })) ?? [];
  }

  return {
    profile,
    projects_submitted: submitted ?? [],
    projects_contributed: contributed,
  };
}
