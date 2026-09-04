import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getInsightPost, insightsPosts } from "@/content/insights";
import { CALENDLY_URL, SITE_URL } from "@/lib/constants";

interface Props {
  params: { slug: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return insightsPosts.map((post) => ({ slug: post.meta.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getInsightPost(params.slug);
  if (!post) return { title: "Post not found" };
  const { meta } = post;
  return {
    title: meta.title,
    description: meta.description,
    authors: [{ name: meta.author, url: `${SITE_URL}/leadership` }],
    alternates: { canonical: `${SITE_URL}/insights/${meta.slug}` },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/insights/${meta.slug}`,
      publishedTime: `${meta.date}T12:00:00.000Z`,
      modifiedTime: `${meta.date}T12:00:00.000Z`,
      authors: [meta.author],
      tags: meta.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

export default function InsightPostPage({ params }: Props) {
  const post = getInsightPost(params.slug);
  if (!post) notFound();

  const { meta, Component } = post;
  const more = insightsPosts.filter((p) => p.meta.slug !== meta.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: `${meta.date}T12:00:00.000Z`,
    dateModified: `${meta.date}T12:00:00.000Z`,
    url: `${SITE_URL}/insights/${meta.slug}`,
    author: {
      "@type": "Person",
      name: meta.author,
      jobTitle: meta.authorTitle,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/insights"
            className="text-sm font-semibold text-gray-400 hover:text-accent transition-colors inline-flex items-center gap-1.5 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All posts
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span>{formatDate(meta.date)}</span>
            <span aria-hidden="true">&middot;</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {meta.readingTime} min read
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {meta.title}
          </h1>
          <p className="text-sm text-gray-500 mb-10 pb-8 border-b border-gray-100">
            By <span className="font-semibold text-gray-900">{meta.author}</span>
            {" "}&middot; {meta.authorTitle}
          </p>
          <div className="blog-content">
            <Component />
          </div>

          {meta.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-10 pt-8 border-t border-gray-100">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* CTA */}
      <section className="py-14 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
            Wondering where AI fits in{" "}
            <span className="italic text-accent">your</span> organization?
          </h2>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            The free 5-minute AI readiness assessment shows you exactly where to
            start. Prefer to talk it through instead? Grab a slot on my
            calendar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/assessment" className="btn-primary text-sm">
              Take the free AI assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="py-14 px-4">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
              More posts
            </h3>
            <div className="space-y-5">
              {more.map((p) => (
                <Link
                  key={p.meta.slug}
                  href={`/insights/${p.meta.slug}`}
                  className="block group"
                >
                  <p className="font-display font-bold text-gray-900 group-hover:text-accent transition-colors">
                    {p.meta.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(p.meta.date)} &middot; {p.meta.readingTime} min
                    read
                  </p>
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
