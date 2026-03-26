"use client";

import Link from "next/link";
import { ArrowRight, TrendingDown, DollarSign, BarChart3, CheckCircle2, Clock, Shield, Zap, Target, Users, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/enterprise-ai-strategy";

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1920&q=80&auto=format" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-6">Enterprise AI Strategy</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-6">
            You're overspending on
            <br />
            <span className="text-accent italic">technology by 50%.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mb-10">
            Most mid-market companies are paying for tools they don't use, workflows that don't connect, and strategies that never reach production. Our assessment proves it in two weeks. Then we fix it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/assessment" className="btn-primary text-base">
              Take Free AI Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-white text-base">
              Book Strategy Call
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* The Problem: You're Bleeding Money */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">The Real Problem</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                Your tech stack is <span className="italic text-accent">costing you more</span> than it should.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Here's what we see in nearly every mid-market company we assess: overlapping SaaS subscriptions nobody audits, custom integrations that break every quarter, AI pilots that ran for six months and produced nothing, and a team spending 30+ hours a week on work that should be automated.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                The companies that hired consultants before us? They got a 200-page strategy deck and a $500K bill. Nothing shipped. Nothing changed. We take a different approach.
              </p>
              <Link href="/assessment" className="text-sm font-semibold text-accent hover:text-amber-700 transition-colors inline-flex items-center gap-1.5">
                See where you stand with a free assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { icon: DollarSign, stat: "~50%", text: "Average technology overspend we identify in assessments", color: "text-red-500" },
                { icon: Clock, stat: "30+ hrs/week", text: "Average time wasted on manual workflows that should be automated", color: "text-red-500" },
                { icon: TrendingDown, stat: "80%", text: "Of AI pilots never reach production", color: "text-red-500" },
              ].map((item) => (
                <div key={item.stat} className="flex items-start gap-5 p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <item.icon className={`w-8 h-8 ${item.color} shrink-0`} />
                  <div>
                    <div className="text-2xl font-display font-bold text-gray-900">{item.stat}</div>
                    <p className="text-sm text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How the Assessment Works */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80&auto=format" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900/92" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">The ASCEND Assessment</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Two weeks. Ten dimensions. <span className="italic text-accent">Total clarity.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our ASCEND Assessment doesn't just tell you where AI fits. It shows you exactly where you're wasting money, where your workflows break, and what to fix first. The savings we identify typically cover our entire engagement cost.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: "01", title: "Tech Stack Audit", desc: "Every tool, license, and integration mapped against actual usage" },
              { num: "02", title: "Workflow Analysis", desc: "Where your team loses hours to manual processes and handoffs" },
              { num: "03", title: "AI Opportunity Map", desc: "Specific use cases ranked by ROI impact and implementation ease" },
              { num: "04", title: "Cost Reduction Plan", desc: "Concrete savings from eliminating overlap, waste, and shelfware" },
              { num: "05", title: "90-Day Roadmap", desc: "Prioritized action plan with quick wins in the first 30 days" },
            ].map((step) => (
              <div key={step.num} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-accent/40 transition-all duration-300">
                <span className="text-accent font-display font-bold text-sm">{step.num}</span>
                <h3 className="font-display font-bold text-white mt-2 mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Proof */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Proven Results</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              The assessment <span className="italic text-accent">pays for itself.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              In every enterprise engagement, the savings we identify in the first two weeks exceed the cost of the entire engagement. Here's what that looks like.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 md:p-12 mb-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-display font-bold text-accent mb-2">~50%</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Average Tech Spend Reduction</p>
                <p className="text-xs text-gray-500">Identified through our assessment process</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-display font-bold text-accent mb-2">2:1</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Minimum ROI Ratio</p>
                <p className="text-xs text-gray-500">Savings identified vs. engagement cost</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-display font-bold text-accent mb-2">30</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Days to First Savings</p>
                <p className="text-xs text-gray-500">Quick wins implemented in the first month</p>
              </div>
            </div>
          </div>

          {/* Client proof */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-7 card-hover">
              <div className="w-8 h-1 bg-accent rounded mb-5" />
              <p className="text-gray-700 italic leading-relaxed mb-5">
                "Jermaine's assessment found $180K in annual technology waste we didn't know we had. Overlapping tools, unused licenses, and manual processes that should have been automated years ago. The engagement paid for itself in the first month."
              </p>
              <div>
                <div className="text-sm font-semibold text-gray-900">COO</div>
                <div className="text-xs text-gray-500">Professional Services Firm, 120 employees</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-7 card-hover">
              <div className="w-8 h-1 bg-accent rounded mb-5" />
              <p className="text-gray-700 italic leading-relaxed mb-5">
                "We were spending $45K/month on tools with 60% feature overlap. JMCB consolidated our stack, automated three critical workflows, and cut our technology spend nearly in half. The governance framework alone changed how leadership thinks about tech adoption."
              </p>
              <div>
                <div className="text-sm font-semibold text-gray-900">VP of Operations</div>
                <div className="text-xs text-gray-500">Mid-Market Technology Company, 85 employees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What makes this different */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Why JMCB</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Enterprise rigor. <span className="italic text-accent">Mid-market speed.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: BarChart3,
                title: "We find the money first",
                desc: "Before we talk about AI strategy, we show you where you're overspending. The savings fund the transformation. Every time.",
              },
              {
                icon: Zap,
                title: "Speed to value, not speed to invoice",
                desc: "Our Strategy Sprint delivers in 4-6 weeks what big consultancies take 6 months to produce. Because you need results, not reports.",
              },
              {
                icon: Target,
                title: "Practical, not theoretical",
                desc: "You won't get a strategy deck that sits on a shelf. You'll get a clear roadmap with prioritized use cases, cost savings, and ROI projections tied to your actual numbers.",
              },
              {
                icon: Shield,
                title: "Governance built in, not bolted on",
                desc: "As a Johns Hopkins AI Safety Fellow, I ensure every recommendation includes proper risk management and human oversight. No shortcuts.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-7 card-hover">
                <item.icon className="w-7 h-7 text-accent mb-4" />
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Industries</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              AI strategy for <span className="italic text-accent">growing companies.</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["Professional Services", "Manufacturing", "Financial Services", "Technology", "Distribution & Logistics", "Business Services", "Insurance", "Real Estate"].map((ind) => (
              <span key={ind} className="px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700">{ind}</span>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-6">Serving companies with $20M - $500M revenue nationwide</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Engagement Options</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Choose your <span className="italic text-accent">starting point.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every engagement starts with an assessment. The savings we find determine how deep we go.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "AI Readiness Scan",
                price: "",
                duration: "1-2 weeks",
                desc: "A focused diagnostic that tells you exactly where you're overspending and where AI can help.",
                features: ["Executive interview and workflow analysis", "Tech stack audit with cost overlap report", "Top 3 AI opportunity identification", "Quick-win savings recommendation", "30-minute findings presentation"],
                best: "Companies exploring AI for the first time",
                popular: false,
              },
              {
                name: "AI Strategy Sprint",
                price: "",
                duration: "4-6 weeks",
                desc: "A complete AI strategy with the business case and cost reduction plan to get executive buy-in.",
                features: ["Full ASCEND Assessment (10 dimensions)", "Technology spend reduction roadmap", "Use case prioritization with ROI projections", "Implementation roadmap (30/60/90 day)", "Governance framework", "Executive presentation with financial model"],
                best: "Companies ready to build their AI roadmap",
                popular: true,
              },
              {
                name: "AI Pilot Program",
                price: "",
                duration: "8-12 weeks",
                desc: "Go from strategy to production. We implement your first AI use case with full support.",
                features: ["Everything in Strategy Sprint", "Pilot use case implementation", "Integration with existing systems", "Team training and enablement", "Success metrics and reporting", "90-day post-launch support"],
                best: "Companies ready to deploy AI in production",
                popular: false,
              },
            ].map((tier) => (
              <div key={tier.name} className={`relative flex flex-col bg-white rounded-xl p-7 card-hover ${tier.popular ? "border-2 border-accent shadow-lg shadow-accent/10" : "border border-gray-200"}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold rounded-full tracking-wide">Most Popular</div>
                )}
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
                  {tier.popular ? "Start Strategy Sprint" : "Discuss This Option"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Stop overpaying for technology <span className="italic text-accent">that underdelivers.</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
            Schedule a free strategy call. We'll discuss your tech stack, your goals, and where the savings are hiding. No obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-base">
              Schedule Strategy Call
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/assessment" className="btn-outline text-base">
              Take Free Assessment First
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
