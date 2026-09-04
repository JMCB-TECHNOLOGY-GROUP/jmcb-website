import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Laboratory Method — How Scientists Build Bulletproof Careers in Tech | JMCB",
  description:
    "Jermaine Barker's book on running your career like a laboratory: hypotheses, 90-day sprints, reproducible results. Read the first chapter free or get the early-access edition.",
  openGraph: {
    title: "The Laboratory Method",
    description: "How Scientists Build Bulletproof Careers in Tech. Free first chapter + early-access edition.",
    url: "https://www.jmcbtech.com/book",
  },
};

const CHECKOUT_URL = process.env.NEXT_PUBLIC_BOOK_CHECKOUT_URL || "";

const principles = [
  { title: "Careers are experiments, not ladders", body: "Every move is a hypothesis with a measurable result. You stop guessing and start running tests." },
  { title: "The 90-day sprint", body: "Long enough to prove something real, short enough to change course before the cost gets high." },
  { title: "Velocity is not progress", body: "The four-quadrant check that tells you whether you are actually moving or just busy." },
  { title: "Authority through reproducible results", body: "How documented, repeatable wins compound into the reputation that opens doors credentials cannot." },
];

const included = [
  "The complete early-access edition, all 12 chapters, readable on any device",
  "Every future revision and the finished edition, at no extra cost",
  "Eight framework figures: the five-step loop, the 60/25/15 skill portfolio, the sprint timeline, the authority flywheel",
  "Case files drawn from real coaching engagements (anonymised)",
];

export default function BookPage() {
  return (
    <>
      <Header />
      <main>
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-gray-900 to-gray-900" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20 grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-3">
              <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-6">A book by Jermaine Barker</p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-6">
                The Laboratory
                <br />
                <span className="text-accent italic">Method.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mb-4">
                How Scientists Build Bulletproof Careers in Tech.
              </p>
              <p className="text-base text-gray-400 max-w-xl leading-relaxed mb-10">
                Credentials open conversations. Skills close the deal. A trained scientist who became a
                technologist shows you how to run your career the way a lab runs an experiment: form the
                hypothesis, run the sprint, measure, iterate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/free-chapter.html" className="btn-primary text-base">
                  Read the first chapter free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                {CHECKOUT_URL ? (
                  <a href={CHECKOUT_URL} className="btn-outline-white text-base">
                    Get the early-access edition — $9.99
                  </a>
                ) : (
                  <span className="btn-outline-white text-base opacity-70 cursor-default">Early-access edition coming soon</span>
                )}
              </div>
            </div>
            <div className="md:col-span-2 hidden md:block">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-primary to-gray-800 border border-white/10 shadow-2xl p-8 flex flex-col justify-between">
                <FlaskConical className="w-10 h-10 text-accent" />
                <div>
                  <p className="font-display text-3xl font-bold text-white leading-tight">The Laboratory Method</p>
                  <p className="text-gray-300 text-sm mt-3">How Scientists Build Bulletproof Careers in Tech</p>
                  <p className="text-accent text-xs tracking-widest uppercase mt-6">Jermaine Barker</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* ===== PRINCIPLES ===== */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-3">What the method is</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-10">Four ideas that change how you make career decisions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {principles.map((p) => (
                <div key={p.title} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== EARLY ACCESS ===== */}
        <section className="py-20 px-4 bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-3">Early-access edition</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Read it while it is being written</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                This is a working edition, not a finished book. The method is settled; several chapters are
                being rebuilt around recorded, real material rather than summary. Buy once and you receive
                every revision and the finished edition when it ships.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Delivered instantly as a single HTML file you can read in any browser, on any device.
              </p>
              {CHECKOUT_URL ? (
                <a href={CHECKOUT_URL} className="btn-primary text-base">
                  Get early access — $9.99
                  <ArrowRight className="w-5 h-5" />
                </a>
              ) : (
                <p className="text-sm text-gray-500">Checkout opens shortly. Read the free chapter in the meantime.</p>
              )}
            </div>
            <ul className="space-y-4">
              {included.map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== AUTHOR ===== */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="w-8 h-8 text-accent mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">About the author</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Jermaine Barker is the founder of JMCB Technology Group. Trained as a scientist at Howard
              University, he has led technology programs for federal agencies and now builds AI products
              and coaches technologists on the method in this book.
            </p>
            <Link href="https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review" target="_blank" rel="noopener noreferrer" className="btn-outline text-base">
              Book a free Career Lab review
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
