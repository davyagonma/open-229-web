import { NextRequest, NextResponse } from "next/server";
import {
  createRouteClient,
  getBearerToken,
} from "@/lib/supabase/route";
import {
  projectCreateSchema,
  projectListQuerySchema,
} from "@/lib/validation/api";
import { slugify } from "@/lib/utils/slug";

export async function GET(request: NextRequest) {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsed = projectListQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { q, category, sort, min_stars, page, page_size } = parsed.data;
    const supabase = createRouteClient(getBearerToken(request));

    let qb = supabase
      .from("projects")
      .select(
        "id, slug, name, short_description, category, stack, stars_count, forks_count, open_issues_count, updated_at, demo_url, github_url, gitlab_url",
        { count: "exact" }
      )
      .eq("is_published", true);

    if (category) qb = qb.eq("category", category);
    if (min_stars != null) qb = qb.gte("stars_count", min_stars);
    if (q?.trim()) {
      const t = q.trim().replace(/[%_]/g, "");
      if (t.length) {
        qb = qb.or(
          `name.ilike.%${t}%,short_description.ilike.%${t}%,primary_language.ilike.%${t}%`
        );
      }
    }

    if (sort === "recently_updated") {
      qb = qb.order("updated_at", { ascending: false });
    } else {
      qb = qb.order("stars_count", { ascending: false });
    }

    const from = (page - 1) * page_size;
    const to = from + page_size - 1;
    qb = qb.range(from, to);

    const { data, error, count } = await qb;
    if (error) throw error;

    return NextResponse.json({
      data: data ?? [],
      meta: { page, page_size, total: count ?? 0 },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to list projects" },
      { status: 500 }
    );
  }
}

async function allocateSlug(
  supabase: ReturnType<typeof createRouteClient>,
  baseName: string
): Promise<string> {
  const root = slugify(baseName) || "project";
  for (let i = 0; i < 30; i++) {
    const candidate = i === 0 ? root : `${root}-${i}`;
    const { data } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  throw new Error("slug_alloc_failed");
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = createRouteClient(token);
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = projectCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const input = parsed.data;

    const slug = await allocateSlug(supabase, input.name);

    const { data: inserted, error: insErr } = await supabase
      .from("projects")
      .insert({
        slug,
        name: input.name,
        short_description: input.short_description,
        full_description: input.full_description ?? null,
        category: input.category,
        status: input.status,
        github_url: input.github_url || null,
        gitlab_url: input.gitlab_url || null,
        demo_url: input.demo_url || null,
        license: input.license ?? null,
        contributing_url: input.contributing_url || null,
        key_features: input.key_features ?? null,
        stack: input.stack,
        stars_count: input.stars_count ?? 0,
        forks_count: input.forks_count ?? 0,
        submitted_by: user.id,
        is_published: input.is_published ?? true,
        version_label: input.version_label ?? null,
        last_activity_at: new Date().toISOString(),
      })
      .select("id, slug")
      .single();

    if (insErr || !inserted) {
      console.error(insErr);
      return NextResponse.json(
        { error: insErr?.message ?? "Insert failed" },
        { status: 400 }
      );
    }

    if (input.contributors?.length) {
      const rows = input.contributors.map((c, idx) => ({
        project_id: inserted.id,
        display_name: c.display_name,
        role: c.role ?? null,
        profile_id: c.profile_id ?? null,
        sort_order: idx,
      }));
      const { error: cErr } = await supabase
        .from("project_contributors")
        .insert(rows);
      if (cErr) {
        console.error(cErr);
        await supabase.from("projects").delete().eq("id", inserted.id);
        return NextResponse.json(
          { error: "Failed to save contributors" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { data: { id: inserted.id, slug: inserted.slug } },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
