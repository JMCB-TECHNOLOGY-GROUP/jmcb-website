import Link from "next/link";
import { ArrowRight, FileSearch, Map, Rocket, RefreshCw } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

const tiers = [
  {
    icon: FileSearch,
    name: "AI Readiness Scan",
    anchor: "Starting at $3,500",
    duration: "2-week engagement",
    desc: "Find out exactly where AI fits and what's blocking you.",
    deliverables: [
      "ASCEND™ Assessment across 10 dimensions",
      "Executive AI Readiness Briefing",
      "Prioritized roadmap with quick wins",
      "Risk and governance gap analysis",
    ],
    bestFor: "Teams that know they need AI but don't know where to start",
    highlight: false,
  },
  {
    icon: Map,
    name: "AI Strategy Sprint",
    anchor: "Starting at $10,000",
    duration: "30-day engagement",
    desc: "A complete AI playbook with a 90-day execution plan.",
    deliverables: [
      "Everything in Readiness Scan",
      "Detailed 30/60/90-day implementation plan",
      "Vendor-agnostic tool recommendations",
      "Workforce enablement roadmap",
      "Governance framework template",
    ],
    bestFor: "Organizations with ideas that need a structured execution plan",
    highlight: true,
  },
  {
    icon: Rocket,
    name: "AI Pilot Program",
    anchor: "Starting at $25,000",
    duration: "90-day engagement",
    desc: "Strategy plus hands-on implementation of your first AI workflow.",
    deliverables: [
      "Everything in Strategy Sprint",
      "Production-ready AI agent workflow",
      "Human-in-the-loop oversight setup",
      "Team training and SOPs",
      "30-day post-launch support",
    ],
    bestFor: "Teams that want AI running in their business this quarter",
    highlight: false,
  },
];

export default function ServiceTiers() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
            How We Work
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Engagement models built for results
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every engagement follows our ASCEND™ methodology. Choose the depth
            that matches where you are today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-6 flex flex-col ${
                tier.highlight
                  ? "bg-gray-900 text-white border-2 border-accent relative"
                  : "bg-white border border-gray-200"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <tier.icon className={`w-8 h-8 mb-4 ${tier.highlight ? "text-accent" : "text-accent"}`} />
              <h3 className={`text-xl font-bold mb-1 ${tier.highlight ? "text-white" : "text-gray-900"}`}>
                {tier.name}
              </h3>
              <p className={`text-sm font-semibold mb-1 ${tier.highlight ? "text-accent" : "text-accent"}`}>
                {tier.anchor}
              </p>
              <p className={`text-xs mb-4 ${tier.highlight ? "text-gray-400" : "text-gray-500"}`}>
                {tier.duration}
              </p>
              <p className={`text-sm mb-4 ${tier.highlight ? "text-gray-300" : "text-gray-600"}`}>
                {tier.desc}
              </p>
              <ul className="space-y-2 mb-6 flex-grow">
                {tier.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm">
                    <span className="text-accent mt-0.5">✓</span>
                    <span className={tier.highlight ? "text-gray-300" : "text-gray-600"}>{d}</span>
                  </li>
                ))}
              </ul>
              <p className={`text-xs mb-4 ${tier.highlight ? "text-gray-500" : "text-gray-400"}`}>
                Best for: {tier.bestFor}
              </p>
              <Link
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all text-sm ${
                  tier.highlight
                    ? "bg-accent text-white hover:bg-amber-600"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Discuss This Option
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Advisory Retainer */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <RefreshCw className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900">AI Advisory Retainer</h3>
              <p className="text-sm text-gray-600">
                Ongoing strategy sessions, governance oversight, and scaling support.{" "}
                <span className="text-accent font-semibold">From $5,000/month.</span>
              </p>
            </div>
          </div>
          <Link
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all text-sm whitespace-nowrap"
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Q2 2026 Sprint cohort: limited spots remaining. All engagements are customized after an initial strategy briefing.
        </p>
      </div>
    </section>
  );
}
