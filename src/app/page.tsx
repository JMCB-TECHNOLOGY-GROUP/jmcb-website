"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Brain, Zap, ChevronRight, Clock, Target, Users, CheckCircle2, Building2, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBar from "@/components/TrustBar";
import ServiceTiers from "@/components/ServiceTiers";
import SocialProof from "@/components/SocialProof";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

const verticals = [
  { name: "Healthcare", href: "/healthcare", icon: Brain, desc: "HIPAA-conscious AI workflows for providers and health systems" },
  { name: "Enterprise & Mid-Market", href: "/enterprise", icon: Target, desc: "Scalable AI strategy for companies with 50-500 employees" },
  { name: "Associations & Nonprofits", href: "/associations", icon: Users, desc: "Member-focused AI for trade associations and mission-driven orgs" },
  { name: "Small Business & Startups", href: "/services", icon: Sparkles, desc: "Right-sized AI that delivers ROI without enterprise complexity" },
];

const stats = [
  { value: "$2B+", label: "Programs Managed" },
  { value: "15+", label: "Years Tech Leadership" },
  { value: "90", label: "Days to First AI Workflow" },
  { value: "10", label: "ASCEND™ Dimensions Assessed" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ===== HERO ===== */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-6">
            AI Strategy & Implementation for Growing Businesses
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Deploy AI with confidence.{" "}
            <span className="text-accent">See results in 90 days.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            80% of AI projects fail before production. We bring the discipline
            behind large-scale technology programs to help your team deploy AI safely
            and profitably, with a clear plan and real accountability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg text-lg"
            >
              Take Free AI Assessment
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
          <p className="text-sm text-gray-400">
            No spam. No sales pitch. Just clarity on where AI fits in your business.
          </p>
          <p className="text-xs text-accent font-semibold mt-3">
            Limited Q2 2026 strategy slots available
          </p>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <TrustBar />

      {/* ===== PROBLEM / AGITATION ===== */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Most AI initiatives stall. Yours won't.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The gap between AI ambition and AI execution is where businesses
              lose time, money, and competitive advantage.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { stat: "80%", text: "of AI pilots never reach production", source: "Forbes" },
              { stat: "48%", text: "of leaders cite governance as the top barrier to scaling AI", source: "Gartner" },
              { stat: "67%", text: "of organizations say data quality is their #1 AI challenge", source: "Industry Research" },
            ].map((item) => (
              <div key={item.stat} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">{item.stat}</div>
                <p className="text-gray-700 font-medium mb-2">{item.text}</p>
                <p className="text-xs text-gray-400">{item.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT / CREDIBILITY ===== */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
                Why JMCB
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Enterprise discipline.{" "}
                <span className="text-accent">Entrepreneurial speed.</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Led by Jermaine Barker, a Johns Hopkins AI Safety Fellow with
                15+ years managing large-scale technology programs including a
                $2B initiative for the U.S. Postal Service. His background in
                molecular genetics brings scientific rigor to every engagement.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At JMCB Technology Group, we apply the governance and discipline
                of enterprise programs to help growing businesses deploy AI
                with a structured plan, responsible oversight, and results you
                can measure within 90 days.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Johns Hopkins Fellow", "Howard M.S.", "$2B Programs", "15+ Years Leadership"].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <Image
                src="/jermaine-barker.jpg"
                alt="Jermaine Barker, Founder of JMCB Technology Group"
                width={400}
                height={400}
                className="rounded-xl w-full h-auto mb-4"
              />
              <p className="text-sm font-semibold text-gray-900">Jermaine Barker</p>
              <p className="text-xs text-gray-500">Founder & CEO, JMCB Technology Group</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ASCEND METHOD ===== */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
              Our Methodology
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The JMCB ASCEND™ Framework
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A proven methodology for deploying agentic AI, starting
              with the workflows that create measurable impact first.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { letter: "A", word: "Assess", desc: "Identify your highest-impact AI use cases and what's blocking them" },
              { letter: "S", word: "Strategize", desc: "Define priorities, ROI targets, and a 30/60/90-day roadmap" },
              { letter: "C", word: "Construct", desc: "Confirm your tools, data access, and team readiness" },
              { letter: "E", word: "Execute", desc: "Pilot one workflow with clear success metrics" },
              { letter: "N", word: "Navigate", desc: "Implement guardrails for responsible, governed AI" },
              { letter: "D", word: "Deploy", desc: "Roll out, measure, and continuously improve" },
            ].map((step) => (
              <div key={step.letter} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-accent transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center font-bold text-lg">
                    {step.letter}
                  </span>
                  <span className="font-bold text-gray-900 text-lg">{step.word}</span>
                </div>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <ServiceTiers />

      {/* ===== SOCIAL PROOF ===== */}
      <SocialProof />

      {/* ===== VERTICALS ===== */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
              Industries We Serve
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI strategy built for your sector
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {verticals.map((v) => (
              <Link
                key={v.name}
                href={v.href}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-accent hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <v.icon className="w-8 h-8 text-accent mb-3" />
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{v.name}</h3>
                    <p className="text-gray-600 text-sm">{v.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-1">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to deploy AI with confidence?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            Take our free 5-minute assessment to find out exactly where AI
            can help, and what to do first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg text-lg"
            >
              Start Free Assessment
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
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 5 minutes</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Free report</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> No spam</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
