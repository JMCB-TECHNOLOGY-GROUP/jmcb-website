import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { insightsPosts } from "@/content/insights";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical notes from real AI deployments. What works, what stalls, and what to do first. No hype.",
  alternates: {
    canonical: `${SITE_URL}/insights`,
    types: { "application/rss+xml": `${SITE_URL}/insights/feed.xml` },
  },
  openGraph: {
    type: "website",
    title: "Insights | JMCB Technology Group",
    description:
      "Practical notes from real AI deployments. What works, what stalls, and what to do first. No hype.",
    url: `${SITE_URL}/insights`,
  },
};

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

export default function InsightsIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
            Insights
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Deploying AI, <span className="italic text-accent">honestly.</span>
          </h1>
          <p className="text-gray-600 leading-relaxed mb-14 max-w-xl">
            Practical notes from real AI deployments. What works, what stalls,
            and what to do first. No hype.
          </p>

          <div className="space-y-8">
            {insightsPosts.map((post) => (
              <article
                key={post.meta.slug}
                className="group card-hover bg-white border border-gray-200 rounded-xl p-6 md:p-8"
              >
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span>{formatDate(post.meta.date)}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.meta.readingTime} min read
                  </span>
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors">
                  <Link href={`/insights/${post.meta.slug}`}>{post.meta.title}</Link>
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {post.meta.description}
                </p>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Link
                    href={`/insights/${post.meta.slug}`}
                    className="text-sm font-semibold text-accent inline-flex items-center gap-1.5 hover:text-amber-700 transition-colors"
                  >
                    Read post
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {post.meta.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {post.meta.tags.slice(0, 3).map((tag) => (
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
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
