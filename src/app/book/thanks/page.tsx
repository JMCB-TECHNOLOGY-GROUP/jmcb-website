import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Your copy of The Laboratory Method | JMCB",
  robots: { index: false, follow: false },
};

export default async function BookThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }> | { session_id?: string };
}) {
  const params = await searchParams;
  const sessionId = params?.session_id || "";
  const valid = /^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId);

  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-32 pb-20 text-center">
          <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-6" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Thank you. Your copy is ready.</h1>
          <p className="text-gray-600 leading-relaxed mb-8">
            The early-access edition opens in your browser as a single page you can save or print. Bookmark
            this link: it stays valid, and each revision of the book will be served from it.
          </p>
          {valid ? (
            <a href={`/api/book/download?session_id=${encodeURIComponent(sessionId)}`} className="btn-primary text-base">
              Open The Laboratory Method
              <ArrowRight className="w-5 h-5" />
            </a>
          ) : (
            <p className="text-sm text-gray-500">
              We could not find a purchase on this link. If you have just paid, use the link in your Stripe
              receipt, or email <a className="underline" href="mailto:jermaine@jmcbtech.com">jermaine@jmcbtech.com</a>.
            </p>
          )}
          <p className="text-sm text-gray-500 mt-10">
            Questions or feedback on the draft: <a className="underline" href="mailto:jermaine@jmcbtech.com">jermaine@jmcbtech.com</a>
          </p>
          <p className="mt-4">
            <Link href="/book" className="text-sm text-gray-500 underline underline-offset-2">Back to the book page</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
