import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { marked } from "marked";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 300;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.published_at,
      authors: ["Jermaine Barker"],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const html = await marked.parse(post.content);
  const recent = (await getPublishedPosts(4)).filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Jermaine Barker",
      url: `${SITE_URL}/leadership`,
    },
    publisher: {
      "@type": "Organization",
      name: "JMCB Technology Group",
      url: SITE_URL,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/blog" className="text-sm font-semibold text-gray-400 hover:text-accent transition-colors inline-flex items-center gap-1.5 mb-8">
            <ArrowLeft className="w-4 h-4" />
            All posts
          </Link>
          <p className="text-xs text-gray-400 mb-3">
            {formatDate(post.published_at)} · Jermaine Barker
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-10">{post.description}</p>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>

      {/* CTA */}
      <section className="py-14 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
            Wondering where AI fits in <span className="italic text-accent">your</span> organization?
          </h2>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            The free 5-minute AI Readiness Assessment shows you exactly where to start.
          </p>
          <Link href="/assessment" className="btn-primary text-sm">
            Take the Free Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="py-14 px-4">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">More posts</h3>
            <div className="space-y-5">
              {recent.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                  <p className="font-display font-bold text-gray-900 group-hover:text-accent transition-colors">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(p.published_at)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
