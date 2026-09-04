import { createServerClient } from "./supabase";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  status: "draft" | "published";
  published_at: string;
  created_at: string;
  updated_at: string;
}

export async function getPublishedPosts(limit = 50): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, description, tags, status, published_at, created_at, updated_at, content")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as BlogPost[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (error) return null;
    return data as BlogPost;
  } catch {
    return null;
  }
}
