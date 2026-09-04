import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createServerClient } from "@/lib/supabase";

// Authenticated publish endpoint for the content pipeline.
// POST with Authorization: Bearer <BLOG_PUBLISH_TOKEN>
// Body: { slug?, title, description, content, tags?, status?, publishedAt? }
// Upserts by slug so a re-run of the pipeline updates rather than duplicates.

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function tokenMatches(header: string | null): boolean {
  const expected = process.env.BLOG_PUBLISH_TOKEN;
  if (!expected || !header?.startsWith("Bearer ")) return false;
  const provided = header.slice(7);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!tokenMatches(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, content, tags, status, publishedAt } = body;
    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "title, description, and content are required" },
        { status: 400 }
      );
    }

    const slug = body.slug ? slugify(body.slug) : slugify(title);
    if (!slug) {
      return NextResponse.json({ error: "Could not derive slug" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .upsert(
        {
          slug,
          title,
          description,
          content,
          tags: Array.isArray(tags) ? tags : [],
          status: status === "draft" ? "draft" : "published",
          published_at: publishedAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select("id, slug, status, published_at")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      post: data,
      url: `https://jmcbtech.com/blog/${data.slug}`,
    });
  } catch (error) {
    console.error("Blog publish error:", error);
    return NextResponse.json({ error: "Failed to publish post" }, { status: 500 });
  }
}
