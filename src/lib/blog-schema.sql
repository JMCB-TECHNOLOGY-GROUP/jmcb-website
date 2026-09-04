-- Blog posts table for jmcbtech.com/blog
-- Posts are written by the Tue/Thu content pipeline (or manually) through
-- POST /api/blog/publish, authenticated with BLOG_PUBLISH_TOKEN.

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,          -- meta description / list excerpt
  content TEXT NOT NULL,              -- markdown body
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  linkedin_personal_url TEXT,         -- set by the pipeline after cross-posting
  linkedin_company_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published
  ON blog_posts (status, published_at DESC);

-- RLS: the site reads/writes with the service-role key only, so lock the
-- table down for anon/authenticated roles.
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read published posts" ON blog_posts;
CREATE POLICY "public can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published');
