import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublishedPosts } from "@/lib/blog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical writing on AI strategy, governance, and deployment from JMCB Technology Group. What actually works when you move AI from pilot to production.",
  alternates: { canonical: "https://jmcbtech.com/blog" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

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
            Field notes from real AI engagements — what works, what stalls, and
            what to do first. New posts every Tuesday and Thursday.
          </p>

          {posts.length === 0 ? (
            <p className="text-gray-500 text-sm">
              First post coming soon. In the meantime,{" "}
              <Link href="/assessment" className="text-accent font-semibold hover:underline">
                take the free AI Readiness Assessment
              </Link>
              .
            </p>
          ) : (
            <div className="space-y-10">
              {posts.map((post) => (
                <article key={post.slug} className="group border-b border-gray-100 pb-10">
                  <p className="text-xs text-gray-400 mb-2">{formatDate(post.published_at)}</p>
                  <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-semibold text-accent inline-flex items-center gap-1.5 hover:text-amber-700 transition-colors"
                    >
                      Read post
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    {post.tags?.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.slice(0, 3).map((t) => (
                          <span key={t} className="px-2.5 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
