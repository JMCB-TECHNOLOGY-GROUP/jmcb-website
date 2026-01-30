"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Building2, 
  CheckCircle, 
  Target,
  TrendingUp,
  Users,
  Shield,
  Zap,
  BarChart3,
  Cog,
  Clock,
  Award
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const painPoints = [
  {
    icon: Clock,
    title: "AI Hype, No Clarity",
    description: "Everyone's talking about AI, but you need a practical roadmap — not another pitch deck full of buzzwords.",
  },
  {
    icon: Users,
    title: "Big Consultants, Bigger Bills",
    description: "McKinsey wants $500K. Accenture wants a 2-year contract. You need results in 90 days, not 24 months.",
  },
  {
    icon: Target,
    title: "Pilots That Don't Scale",
    description: "You've tried ChatGPT. Maybe run a pilot. But nothing's moved to production or delivered real ROI.",
  },
  {
    icon: Shield,
    title: "Risk Without Guidance",
    description: "AI governance, data privacy, workforce concerns — you need someone who's navigated these before.",
  },
];

const industries = [
  "Professional Services",
  "Manufacturing",
  "Financial Services", 
  "Technology",
  "Distribution & Logistics",
  "Business Services",
  "Insurance",
  "Real Estate",
];

const engagements = [
  {
    name: "AI Readiness Scan",
    price: "$5,000",
    duration: "1-2 weeks",
    description: "A focused diagnostic that tells you exactly where AI can help — and where to start.",
    deliverables: [
      "Executive interview & workflow analysis",
      "Top 3 AI opportunity identification",
      "Quick-win recommendation report",
      "30-minute findings presentation",
    ],
    cta: "Get Your Scan",
    best: "Best for: Companies exploring AI for the first time",
  },
  {
    name: "AI Strategy Sprint",
    price: "$25,000",
    duration: "4-6 weeks",
    description: "A complete AI strategy and roadmap — with the business case to get executive buy-in.",
    deliverables: [
      "Full organizational AI assessment",
      "Use case prioritization matrix",
      "Implementation roadmap (90-day, 1-year)",
      "ROI projections and business case",
      "Governance framework recommendations",
      "Executive presentation",
    ],
    cta: "Start Strategy Sprint",
    featured: true,
    best: "Best for: Companies ready to build their AI roadmap",
  },
  {
    name: "AI Pilot Program",
    price: "$50,000 - $100,000",
    duration: "8-12 weeks",
    description: "Go from strategy to production. We implement your first AI use case with full support.",
    deliverables: [
      "Everything in Strategy Sprint, plus:",
      "Pilot use case implementation",
      "Integration with existing systems",
      "Team training & enablement",
      "Success metrics & reporting",
      "90-day post-launch support",
    ],
    cta: "Discuss Pilot Program",
    best: "Best for: Companies ready to deploy AI in production",
  },
];

const differentiators = [
  {
    title: "Enterprise Experience, Mid-Market Focus",
    description: "We've led $2B federal programs and advised Fortune 500s. We bring that rigor to companies your size — without the bloated timelines or budgets.",
  },
  {
    title: "Speed to Value",
    description: "Our Strategy Sprint delivers in 4-6 weeks what big consultancies take 6 months to produce. Because you need to move now.",
  },
  {
    title: "Practical, Not Theoretical",
    description: "You won't get a 200-page strategy deck that sits on a shelf. You'll get a clear roadmap with prioritized use cases and ROI projections.",
  },
  {
    title: "Responsible AI Built In",
    description: "As a Johns Hopkins AI Safety Fellow, I ensure every recommendation includes proper governance, risk management, and human oversight.",
  },
];

const results = [
  { metric: "$2B", label: "Program Leadership", context: "USPS Technology" },
  { metric: "15+", label: "Years Enterprise Tech", context: "Federal & Private" },
  { metric: "90", label: "Day Roadmaps", context: "Strategy to Action" },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-navy to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Building2 className="w-4 h-4" />
              Enterprise AI Strategy
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
              AI Strategy for the{" "}
              <span className="text-accent">Mid-Market</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4 max-w-3xl">
              You don't need a $500K consulting engagement to get AI right.
            </p>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              You need a clear strategy, a practical roadmap, and an advisor who's done this before — 
              at your pace and your budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://calendly.com/jermaine-jmcbtech/enterprise-ai-strategy"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
              >
                Schedule Strategy Call
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Take AI Readiness Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Results Bar */}
      <section className="py-10 bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {results.map((result) => (
              <div key={result.label} className="text-center">
                <div className="text-4xl font-bold text-accent mb-1">{result.metric}</div>
                <div className="font-semibold text-white">{result.label}</div>
                <div className="text-sm text-gray-400">{result.context}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Sound Familiar?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {painPoints.map((point) => (
              <div key={point.title} className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <point.icon className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2">{point.title}</h3>
                <p className="text-sm text-gray-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Industries We Serve
            </p>
            <h2 className="text-2xl font-heading font-bold text-gray-900">
              AI Strategy for Growing Companies
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <span 
                key={industry}
                className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-700"
              >
                {industry}
              </span>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-6 text-sm">
            Serving companies with $20M - $500M revenue nationwide
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Why JMCB
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Enterprise Rigor. Mid-Market Speed.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {differentiators.map((diff) => (
              <div key={diff.title} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900 mb-2">{diff.title}</h3>
                  <p className="text-gray-600">{diff.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Engagement Options
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Choose Your Starting Point
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start with a quick diagnostic or go straight to implementation. Each engagement builds toward production AI.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {engagements.map((engagement) => (
              <div 
                key={engagement.name}
                className={`rounded-2xl p-8 flex flex-col ${
                  engagement.featured 
                    ? "bg-navy text-white border-2 border-navy relative" 
                    : "bg-white border border-gray-200"
                }`}
              >
                {engagement.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-xl font-heading font-bold mb-2 ${engagement.featured ? "text-white" : "text-gray-900"}`}>
                    {engagement.name}
                  </h3>
                  <div className="mb-2">
                    <span className={`text-3xl font-bold ${engagement.featured ? "text-white" : "text-gray-900"}`}>
                      {engagement.price}
                    </span>
                  </div>
                  <p className={`text-sm ${engagement.featured ? "text-gray-300" : "text-gray-500"}`}>
                    {engagement.duration}
                  </p>
                </div>
                <p className={`mb-6 ${engagement.featured ? "text-gray-300" : "text-gray-600"}`}>
                  {engagement.description}
                </p>
                <ul className="space-y-2 mb-6 flex-grow">
                  {engagement.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${engagement.featured ? "text-accent" : "text-green-500"}`} />
                      <span className={`text-sm ${engagement.featured ? "text-gray-300" : "text-gray-600"}`}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <p className={`text-xs mb-4 ${engagement.featured ? "text-gray-400" : "text-gray-500"}`}>
                    {engagement.best}
                  </p>
                  <Link
                    href="https://calendly.com/jermaine-jmcbtech/enterprise-ai-strategy"
                    target="_blank"
                    className={`block w-full text-center px-6 py-3 font-semibold rounded-lg transition-all ${
                      engagement.featured
                        ? "bg-accent text-white hover:bg-amber-600"
                        : "bg-navy text-white hover:bg-gray-800"
                    }`}
                  >
                    {engagement.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              How We Work
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Discovery", desc: "30-min call to understand your business and AI goals" },
              { step: "2", title: "Assessment", desc: "We diagnose opportunities and quick wins" },
              { step: "3", title: "Strategy", desc: "Clear roadmap with prioritized use cases and ROI" },
              { step: "4", title: "Execution", desc: "Implementation support to get AI in production" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Build Your AI Strategy?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Schedule a free strategy call. We'll discuss your goals, assess your readiness, and recommend next steps — no obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://calendly.com/jermaine-jmcbtech/enterprise-ai-strategy"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
            >
              Schedule Strategy Call
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              Take Free Assessment First
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
