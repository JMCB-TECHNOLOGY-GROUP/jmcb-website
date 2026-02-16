"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Shield, Zap, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBar from "@/components/TrustBar";
import ServiceTiers from "@/components/ServiceTiers";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

const process = [
  { step: "01", title: "Strategy Briefing", desc: "30-minute call to understand your goals, current state, and where AI can create impact. No sales pitch, just clarity.", duration: "Day 0" },
  { step: "02", title: "Assessment & Discovery", desc: "We evaluate your data, workflows, governance, and team readiness across 10 ASCEND™ dimensions.", duration: "Week 1-2" },
  { step: "03", title: "Roadmap Delivery", desc: "You receive a prioritized AI roadmap with specific workflows, KPIs, risk mitigations, and a 30/60/90-day plan.", duration: "Week 2-3" },
  { step: "04", title: "Pilot & Deploy", desc: "For Sprint and Pilot clients: we build and launch your first AI workflow with full governance and human oversight.", duration: "Week 3-12" },
];

const faqs = [
  {
    q: "Do I need technical expertise to work with you?",
    a: "No. We translate complex AI concepts into business language. You bring domain expertise; we bring the AI strategy and implementation rigor.",
  },
  {
    q: "What industries do you work with?",
    a: "Healthcare, enterprise and mid-market companies (50-500 employees), trade associations and nonprofits, and small businesses and startups. Our ASCEND™ framework adapts to any environment.",
  },
  {
    q: "What makes your approach different?",
    a: "Every engagement follows a structured methodology with a clear governance framework. We bring 15+ years of large-scale program management discipline to every project, with a repeatable process that connects AI strategy directly to measurable business outcomes.",
  },
  {
    q: "What if we're not ready for AI yet?",
    a: "That's exactly what the Readiness Scan is for. Many clients discover they need data cleanup or process work first. We'll tell you honestly what to prioritize, even if it means waiting on AI.",
  },
  {
    q: "Do you recommend specific AI vendors or tools?",
    a: "We're vendor-agnostic. We recommend the tools that fit your existing stack, budget, and use case, not the ones that pay us referral fees.",
  },
  {
    q: "What does 'enterprise-grade discipline' mean?",
    a: "It means we apply the same governance, risk management, and oversight standards used in billion-dollar technology programs. Your AI workflows get enterprise-level guardrails regardless of your company size.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-6">
            Services
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI strategy that ships.{" "}
            <span className="text-accent">Not shelf-ware.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            From assessment to production in 90 days. Every engagement follows
            our ASCEND™ methodology and delivers measurable outcomes.
          </p>
        </div>
      </section>

      <TrustBar />
      <ServiceTiers />

      {/* Process */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From first call to first workflow
            </h2>
          </div>
          <div className="space-y-6">
            {process.map((p) => (
              <div key={p.step} className="bg-white border border-gray-200 rounded-xl p-6 flex items-start gap-6">
                <div className="flex-shrink-0">
                  <span className="text-3xl font-bold text-accent">{p.step}</span>
                  <div className="text-xs text-gray-400 mt-1">{p.duration}</div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{p.title}</h3>
                  <p className="text-gray-600">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The ROI of getting AI right
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <Zap className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-700 mb-1">Hours Back</div>
              <p className="text-sm text-green-700">AI workflows that automate the repetitive work so your team focuses on what actually matters</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-700 mb-1">90 days</div>
              <p className="text-sm text-blue-700">Average time from kickoff to first production AI workflow</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-700 mb-1">100%</div>
              <p className="text-sm text-purple-700">Of our engagements include governance and risk framework</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-gray-600 text-sm ml-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Let&apos;s find where AI fits in your business
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start with a free assessment or book a 30-minute strategy briefing.
            No obligation. No sales pitch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all text-lg"
            >
              Take Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-all text-lg"
            >
              Book Strategy Briefing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
