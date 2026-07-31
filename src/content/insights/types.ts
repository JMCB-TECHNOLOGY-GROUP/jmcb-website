// Shared metadata contract for git-native Insights posts.
// Each post file under src/content/insights/ exports a `meta` object of this
// shape plus a default React component for the post body.
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date, e.g. "2026-07-21" (publication date, America/New_York) */
  date: string;
  author: string;
  authorTitle: string;
  tags: string[];
  /** Estimated reading time in minutes */
  readingTime: number;
}
