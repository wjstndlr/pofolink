import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";

function ensureSlugs(data: any) {
  if (data.projects && Array.isArray(data.projects)) {
    const usedSlugs = new Set<string>();
    data.projects = data.projects.map((p: any, i: number) => {
      let slug = p.slug ? slugify(p.slug) : slugify(p.title || `project-${i + 1}`);
      if (!slug) slug = `project-${i + 1}`;
      // 중복 slug 방지
      let finalSlug = slug;
      let counter = 2;
      while (usedSlugs.has(finalSlug)) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
      usedSlugs.add(finalSlug);
      return { ...p, slug: finalSlug };
    });
  }
  return data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, data: rawData, sessionToken } = body;
    const data = ensureSlugs(rawData);

    if (!username || !data) {
      return NextResponse.json(
        { error: "Username and data are required" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9-]{3,30}$/.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3-30 characters, lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("portfolios")
      .select("id, session_token")
      .eq("username", username)
      .single();

    if (existing) {
      if (existing.session_token && existing.session_token !== sessionToken) {
        return NextResponse.json(
          { error: "This username is already taken" },
          { status: 409 }
        );
      }

      const { error } = await supabase
        .from("portfolios")
        .update({
          data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) {
        console.error("Update error:", error);
        return NextResponse.json(
          { error: "Failed to update portfolio" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        url: `/p/${username}`,
        sessionToken: existing.session_token,
      });
    }

    const newToken = crypto.randomUUID();

    const { error } = await supabase.from("portfolios").insert({
      username,
      data,
      session_token: newToken,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to publish portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: `/p/${username}`,
      sessionToken: newToken,
    });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish portfolio" },
      { status: 500 }
    );
  }
}
