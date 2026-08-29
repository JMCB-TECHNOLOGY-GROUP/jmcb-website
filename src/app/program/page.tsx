import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Award,
  Users,
  Wrench,
  Clock,
  BadgeCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplyForm from "./ApplyForm";
import {
  PROGRAM_NAME,
  PROGRAM_TAGLINE,
  SESSION_DAY,
  SESSION_TIME,
  COHORT,
  WEEKS,
  SKILL_AREAS,
  TIERS,
  ELIGIBILITY,
  BADGE,
  formatSessionDate,
  formatShortDate,
} from "@/lib/program";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  // The root layout applies a "%s | JMCB Technology Group" template — do not
  // repeat the suffix here.
  title: `${PROGRAM_NAME} — A free 8-week AI skills programme`,
  description: `${PROGRAM_TAGLINE} A free, application-based cohort programme teaching AI and the skills around it through real projects on your own work. ${SESSION_DAY}s, ${SESSION_TIME}.`,
  openGraph: {
    title: `${PROGRAM_NAME} — a free 8-week AI skills programme`,
    description: PROGRAM_TAGLINE,
    url: `${SITE_URL}/program`,
  },
};

export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-gray-900 to-gray-900" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-6">
            {COHORT.label} · Applications open
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-6 max-w-3xl">
            {PROGRAM_NAME}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed mb-6">
            {PROGRAM_TAGLINE}
          </p>
          <p className="text-base text-gray-400 max-w-2xl leading-relaxed mb-10">
            Most AI training leaves you with notes about someone else&rsquo;s demo. This one leaves
            you with a published portfolio of work you did on your own job, your own data and your
            own problems — the kind of evidence that answers &ldquo;what have you actually built?&rdquo;
            The core eight weeks are free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link href="#apply" className="btn-primary text-base">
              Apply for a place
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#curriculum" className="btn-outline-white text-base">
              See the eight projects
            </Link>
          </div>

          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/10 pt-10">
            {[
              { icon: CalendarDays, label: "Live sessions", value: `${SESSION_DAY}s, ${SESSION_TIME}` },
              { icon: Clock, label: "Commitment", value: "8 weeks, ~4 hrs/week" },
              { icon: Wrench, label: "You ship", value: "8 real projects" },
              { icon: Users, label: "Cost", value: `Free · ${COHORT.seats} places` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <Icon className="w-5 h-5 text-accent mb-3" />
                <dt className="text-xs tracking-widest uppercase text-gray-500 mb-1">{label}</dt>
                <dd className="text-white font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== KEY DATES ===== */}
      <section className="bg-cream border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Information session", date: COHORT.infoSession, note: `${SESSION_TIME}, online. Come with questions.` },
              { label: "Applications close", date: COHORT.applicationsClose, note: "Everyone hears back within a week." },
              { label: "Week 1", date: COHORT.startDate, note: "The cohort starts. Bring your task." },
              { label: "Graduation", date: COHORT.endDate, note: "You present what you built." },
            ].map((d) => (
              <div key={d.label}>
                <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-2">{d.label}</p>
                <p className="font-display text-lg font-bold text-gray-900 mb-1">{formatSessionDate(d.date)}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{d.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU LEAVE WITH ===== */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4 max-w-2xl">
            Five things you will be able to do, and prove.
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mb-12">
            Not five topics you sat through. Each one is attached to something you shipped and can
            show to someone who is deciding whether to hire you, fund you, or let you lead the work.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILL_AREAS.map((s, i) => (
              <div key={s.name} className="border border-gray-200 rounded-2xl p-7 card-hover">
                <span className="font-display text-4xl font-bold text-gray-200">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl font-bold text-gray-900 mt-3 mb-2">{s.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
            <div className="bg-primary rounded-2xl p-7 flex flex-col justify-center">
              <Award className="w-7 h-7 text-accent mb-4" />
              <h3 className="font-display text-xl font-bold text-white mb-2">{BADGE.name}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Awarded on completion, shareable, and checkable by anyone who asks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CURRICULUM ===== */}
      <section id="curriculum" className="py-20 sm:py-24 bg-gray-50 border-y border-gray-200 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Eight weeks, eight things you build.
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mb-4">
            In week one you name a real task you already do every week — chasing invoices, writing
            the same report, sorting a rota. Everything you build for the next eight weeks attaches
            to that task. That is what turns eight exercises into one portfolio.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mb-12">
            Every session is live on a {SESSION_DAY} at {SESSION_TIME} and recorded. Projects are due
            before the next session and every one gets written feedback.
          </p>

          <ol className="space-y-4">
            {WEEKS.map((w) => (
              <li key={w.week} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-4">
                  <span className="text-xs tracking-widest uppercase font-semibold text-accent">
                    Week {w.week}
                  </span>
                  <span className="text-xs text-gray-500">{formatShortDate(w.date)}</span>
                  <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1">
                    {w.skill}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-1">{w.theme}</h3>
                <p className="text-accent font-semibold text-sm mb-4">You ship: {w.project}</p>
                <p className="text-gray-600 leading-relaxed">{w.brief}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== TIERS ===== */}
      <section className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            The eight weeks are free. They stay free.
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mb-12">
            There is no upsell inside the programme and no card required to finish it. Afterwards,
            graduates who want their portfolio taken further can apply for a paid capstone. Most
            will not need to, and that is fine.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {TIERS.map((t, i) => (
              <div
                key={t.name}
                className={`rounded-2xl p-8 border ${
                  i === 0 ? "border-accent bg-cream" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-display text-2xl font-bold text-gray-900">{t.name}</h3>
                  <span className="font-display text-2xl font-bold text-accent">{t.price}</span>
                </div>
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-5">{t.duration}</p>
                <p className="text-gray-700 leading-relaxed mb-6">{t.summary}</p>
                <ul className="space-y-3">
                  {t.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ELIGIBILITY + BADGE ===== */}
      <section className="py-20 sm:py-24 bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-6">Who this is for</h2>
            <ul className="space-y-4">
              {ELIGIBILITY.map((e) => (
                <li key={e} className="flex gap-3 text-gray-200 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-6">
              No prior AI experience is expected. If you have never written a prompt beyond asking a
              chatbot for a recipe, you are exactly who this was built for.
            </p>
          </div>
          <div>
            <BadgeCheck className="w-8 h-8 text-accent mb-5" />
            <h2 className="font-display text-3xl font-bold text-white mb-4">{BADGE.name}</h2>
            <p className="text-gray-300 leading-relaxed mb-5">You earn the badge by:</p>
            <ul className="space-y-3 mb-6">
              {BADGE.criteria.map((c) => (
                <li key={c} className="flex gap-3 text-gray-200 text-sm leading-relaxed">
                  <span className="text-accent">—</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-5">
              {BADGE.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* ===== APPLY ===== */}
      <section id="apply" className="py-20 sm:py-24 bg-gray-50 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Apply for {COHORT.label}
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-xl mx-auto">
              Applications close {formatSessionDate(COHORT.applicationsClose)}. It takes about five
              minutes, and there is one question that actually decides it.
            </p>
          </div>
          <ApplyForm />
        </div>
      </section>

      {/* ===== FOR ORGANISATIONS ===== */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
            Want to run this inside your organisation?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            {PROGRAM_NAME} runs as a private cohort for workforce programmes, associations,
            ministries and internal academies — same eight projects, your people, your systems, and a
            documented record of what the cohort shipped.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/training" className="btn-outline text-base">
              See our training formats
            </Link>
            <Link href="/contact" className="btn-primary text-base">
              Talk about a private cohort
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
