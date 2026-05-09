import { NextRequest, NextResponse } from "next/server";
import {
  createRouteClient,
  getBearerToken,
} from "@/lib/supabase/route";
import { projectUpdateSchema } from "@/lib/validation/api";
import type { ProjectRow } from "@/lib/types/database";

type Params = { slug: string };

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { slug } = await context.params;
    const supabase = createRouteClient(getBearerToken(request));

    const { data: project, error: pErr } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (pErr) throw pErr;
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: submitter } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url")
      .eq("id", project.submitted_by)
      .maybeSingle();

    const { data: contributorsRaw, error: cErr } = await supabase
      .from("project_contributors")
      .select("id, display_name, role, profile_id, sort_order")
      .eq("project_id", project.id)
      .order("sort_order", { ascending: true });

    if (cErr) throw cErr;

    const contributors =
      contributorsRaw?.map((c) => ({ ...c, username: null as string | null })) ?? [];
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
      .select(
        "slug, name, short_description, stack, category, stars_count"
      )
      .eq("category", project.category)
      .eq("is_published", true)
      .neq("id", project.id)
      .order("stars_count", { ascending: false })
      .limit(4);

    return NextResponse.json({
      data: {
        project,
        submitter: submitter ?? null,
        contributors: contributors ?? [],
        similar: similar ?? [],
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = createRouteClient(token);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await context.params;
    const body = await request.json();
    const parsed = projectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { data: existing, error: exErr } = await supabase
      .from("projects")
      .select("id, submitted_by")
      .eq("slug", slug)
      .single();

    if (exErr || !existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.submitted_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const patch = parsed.data;
    const updateRow: Partial<ProjectRow> = {};

    const keys = [
      "name",
      "short_description",
      "full_description",
      "category",
      "status",
      "github_url",
      "gitlab_url",
      "demo_url",
      "license",
      "contributing_url",
      "key_features",
      "stack",
      "stars_count",
      "forks_count",
      "version_label",
      "is_published",
    ] as const;

    for (const k of keys) {
      if (k in patch && patch[k] !== undefined) {
        (updateRow as Record<string, unknown>)[k] = patch[k];
      }
    }

    updateRow.last_activity_at = new Date().toISOString();

    const { error: uErr } = await supabase
      .from("projects")
      .update(updateRow)
      .eq("id", existing.id);

    if (uErr) {
      return NextResponse.json({ error: uErr.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
