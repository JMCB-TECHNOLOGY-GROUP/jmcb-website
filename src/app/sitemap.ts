import type { MetadataRoute } from "next";
import { insightsPosts } from "@/content/insights";
import { SITE_URL } from "@/lib/constants";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/training`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/assessment`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/products`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/healthcare`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/enterprise`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/associations`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/leadership`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/insights`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/book`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/free-chapter.html`, changeFrequency: "yearly", priority: 0.6 },
  ];

  // Insights posts live in git (src/content/insights), so these entries are
  // always available at build time.
  const insightsRoutes: MetadataRoute.Sitemap = insightsPosts.map((post) => ({
    url: `${SITE_URL}/insights/${post.meta.slug}`,
    lastModified: `${post.meta.date}T12:00:00.000Z`,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  // Blog posts come from Supabase; the sitemap must still build if the
  // database is unreachable (e.g. local builds without env vars).
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    blogRoutes = (data ?? []).map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.published_at ?? undefined,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));
  } catch {
    // sitemap still serves static routes
  }

  return [...staticRoutes, ...insightsRoutes, ...blogRoutes];
}
