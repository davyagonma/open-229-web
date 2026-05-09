import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient, getBearerToken } from "@/lib/supabase/route";

type Params = { username: string };

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { username } = await context.params;
    const supabase = createRouteClient(getBearerToken(request));

    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select(
        "id, username, display_name, bio, location, avatar_url, created_at"
      )
      .eq("username", username)
      .maybeSingle();

    if (pErr) throw pErr;
    if (!profile) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: projects } = await supabase
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
    let projects_contributed: {
      slug: string;
      name: string;
      short_description: string;
      stack: string[];
      category: string;
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

      const roleBy = new Map(
        (contribLinks ?? []).map((c) => [c.project_id, c.role])
      );
      projects_contributed =
        cp?.map((p) => ({
          slug: p.slug,
          name: p.name,
          short_description: p.short_description,
          stack: p.stack,
          category: p.category,
          stars_count: p.stars_count,
          role: roleBy.get(p.id) ?? null,
        })) ?? [];
    }

    return NextResponse.json({
      data: {
        profile,
        projects_submitted: projects ?? [],
        projects_contributed,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}
