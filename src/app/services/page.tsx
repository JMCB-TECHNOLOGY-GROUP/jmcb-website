"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Shield, FileSearch, Map, Rocket, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80&auto=format" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-6">Services</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-6">
            AI strategy that ships.
            <br />
            <span className="text-accent italic">Not shelf-ware.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mb-10">
            From assessment to production in 90 days. Every engagement follows our ASCEND framework and delivers measurable outcomes. No 200-page decks that collect dust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/assessment" className="btn-primary text-base">
              Take Free AI Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-white text-base">
              Book Strategy Briefing
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">How It Works</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              From first call to <span className="italic text-accent">first workflow.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Strategy Briefing", desc: "30-minute call to understand your goals, current state, and where AI can create impact. No sales pitch, just clarity.", time: "Day 0" },
              { step: "02", title: "Assessment", desc: "We evaluate your data, workflows, tech stack, governance, and team readiness across 10 ASCEND dimensions.", time: "Week 1-2" },
              { step: "03", title: "Roadmap Delivery", desc: "Prioritized AI roadmap with specific workflows, cost savings, KPIs, risk mitigations, and a 30/60/90-day plan.", time: "Week 2-3" },
              { step: "04", title: "Pilot & Deploy", desc: "For Sprint and Pilot clients: we build and launch your first AI workflow with full governance and human oversight.", time: "Week 3-12" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <span className="text-5xl font-display font-bold text-gray-100">{item.step}</span>
                <p className="text-xs font-semibold text-accent mt-2 mb-1">{item.time}</p>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Engagement Options</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Engagement models <span className="italic text-accent">built for results.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every engagement follows our ASCEND methodology. Choose the depth that matches where you are today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FileSearch,
                name: "AI Readiness Scan",
                price: "",
                duration: "2-week engagement",
                desc: "Find out exactly where AI fits and what's blocking you.",
                features: ["ASCEND Assessment across 10 dimensions", "Executive AI Readiness Briefing", "Prioritized roadmap with quick wins", "Risk and governance gap analysis"],
                best: "Teams that know they need AI but don't know where to start",
                popular: false,
              },
              {
                icon: Map,
                name: "AI Strategy Sprint",
                price: "",
                duration: "30-day engagement",
                desc: "A complete AI playbook with a 90-day execution plan.",
                features: ["Everything in Readiness Scan", "Detailed 30/60/90-day plan", "Vendor-agnostic tool recommendations", "Workforce enablement roadmap", "Governance framework template"],
                best: "Organizations that need a structured execution plan",
                popular: true,
              },
              {
                icon: Rocket,
                name: "AI Pilot Program",
                price: "",
                duration: "90-day engagement",
                desc: "Strategy plus hands-on implementation of your first AI workflow.",
                features: ["Everything in Strategy Sprint", "Production-ready AI agent workflow", "Human-in-the-loop oversight setup", "Team training and SOPs", "30-day post-launch support"],
                best: "Teams that want AI running this quarter",
                popular: false,
              },
            ].map((tier) => (
              <div key={tier.name} className={`relative flex flex-col bg-white rounded-xl p-7 card-hover ${tier.popular ? "border-2 border-accent shadow-lg shadow-accent/10" : "border border-gray-200"}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold rounded-full tracking-wide">Most Popular</div>
                )}
                <tier.icon className="w-7 h-7 text-accent mb-3" />
                <h3 className="font-display text-lg font-bold text-gray-900 mb-1">{tier.name}</h3>
                {tier.price && <p className="text-accent font-bold text-sm mb-0.5">{tier.price}</p>}
                <p className="text-xs text-gray-400 mb-4">{tier.duration}</p>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">{tier.desc}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mb-4">Best for: {tier.best}</p>
                <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={tier.popular ? "btn-primary text-sm justify-center" : "btn-outline text-sm justify-center"}>
                  Discuss This Option
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-gray-900">AI Advisory Retainer</h4>
              <p className="text-sm text-gray-500">Ongoing strategy sessions, governance oversight, and scaling support. Custom-scoped to your needs.</p>
            </div>
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm whitespace-nowrap">Learn More</Link>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900/90" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { stat: "90 days", label: "Average time from kickoff to first production AI workflow" },
              { stat: "~50%", label: "Average technology cost reduction identified in assessments" },
              { stat: "100%", label: "Of engagements include governance and risk framework" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-display font-bold text-accent mb-2">{s.stat}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Frequently asked <span className="italic text-accent">questions.</span>
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "Do I need technical expertise to work with you?", a: "No. We translate complex AI concepts into business language. You bring domain expertise and we bring the AI strategy and implementation rigor." },
              { q: "What makes your approach different?", a: "Every engagement follows a structured methodology with a governance framework. We bring 15+ years of large-scale program management discipline to every project, with a process that connects AI strategy directly to measurable business outcomes." },
              { q: "What if we're not ready for AI yet?", a: "That's exactly what the Readiness Scan is for. Many clients discover they need data cleanup or process work first. We'll tell you honestly what to prioritize, even if it means waiting on AI." },
              { q: "Do you recommend specific vendors?", a: "We're vendor-agnostic. We recommend the tools that fit your existing stack, budget, and use case. Not the ones that pay us referral fees." },
              { q: "How is pricing determined?", a: "Pricing is based on engagement scope, not hourly rates. Every engagement is customized after an initial strategy briefing so you know exactly what you're getting before you commit." },
            ].map((item) => (
              <div key={item.q} className="border-b border-gray-200 pb-6">
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Let's find where AI fits <span className="italic text-accent">in your business.</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
            Start with a free assessment or book a 30-minute strategy briefing. No obligation. No sales pitch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="btn-primary text-base">Take Free Assessment <ArrowRight className="w-5 h-5" /></Link>
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-base">Book Strategy Briefing</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
