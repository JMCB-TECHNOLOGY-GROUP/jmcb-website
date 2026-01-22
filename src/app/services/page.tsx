"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Map,
  Rocket,
  User,
  Handshake,
  ChevronDown,
  ChevronUp,
  Check,
  Lightbulb,
  FlaskConical,
  Landmark,
  Heart,
  Target,
  ArrowRight,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";

// Service data
const services = [
  {
    id: "the-1k-question",
    icon: Lightbulb,
    title: "The $1K Question",
    tagline: "The most expensive AI mistake is the one you didn't need to make",
    price: "$997",
    priceNote: "flat fee",
    timeline: "48-72 hours",
    popular: true,
    description:
      "Before you spend $50K on AI, spend $997 to find out if you should. One question answered with certainty: What's the single highest-ROI AI opportunity in your business? No fluff. No 50-slide deck. Just a clear answer you can act on.",
    deliverables: [
      "60-minute deep-dive strategy session",
      "Your #1 AI opportunity identified and validated",
      "Clear action plan with next steps",
      "Go/no-go recommendation with honest rationale",
      "One-page executive summary you can share with your team",
    ],
    idealFor:
      "Business owners who sense AI opportunity but don't know where to start. Leaders tired of vague AI hype who want real answers.",
    comparison:
      "Most consultants won't even get on a call for under $2,500. You get a senior strategist's focused attention and a concrete answer.",
  },
  {
    id: "ai-readiness-scan",
    icon: Search,
    title: "AI Readiness Scan",
    tagline: "Know where you stand in one week",
    price: "Let's Talk",
    priceNote: "",
    timeline: "1 week",
    popular: false,
    description:
      "A fast, honest assessment of your AI readiness. No fluff, no 50-page report. You get a clear picture of what's possible, what's risky, and what to do next.",
    deliverables: [
      "Current state assessment (tech, data, team)",
      "Top 3 AI opportunities ranked by impact + feasibility",
      "Risk and governance gaps identified",
      "Go/no-go recommendation with rationale",
      "45-minute debrief call",
    ],
    idealFor:
      "Leaders who need clarity before committing budget. Teams stuck in analysis paralysis.",
    comparison:
      "Big firms charge $25K+ for a 'discovery phase' before they even scope the real work.",
  },
  {
    id: "responsible-ai-roadmap",
    icon: Map,
    title: "Responsible AI Roadmap",
    tagline: "Strategy + governance in one package",
    price: "Let's Talk",
    priceNote: "",
    timeline: "3-4 weeks",
    popular: false,
    description:
      "A prioritized AI roadmap with governance built in from day one. Not a strategy deck that sits on a shelf. This is an executable plan your team can actually run with.",
    deliverables: [
      "Stakeholder interviews + current state analysis",
      "Prioritized use case portfolio (scored by ROI + risk)",
      "Governance framework tailored to your context",
      "Vendor vs. build recommendations",
      "90-day action plan with owners and milestones",
      "Executive presentation + team workshop",
    ],
    idealFor:
      "Organizations ready to move on AI but need a safe, structured path. Compliance-conscious industries.",
    comparison:
      "We scope to your reality. No bloated proposals. Just what you need to move forward.",
  },
  {
    id: "ai-pilot-sprint",
    icon: Rocket,
    title: "AI Pilot Sprint",
    tagline: "From idea to working AI in 8 weeks",
    price: "Let's Talk",
    priceNote: "",
    timeline: "6-8 weeks",
    popular: false,
    description:
      "We don't just advise. We build. A working AI solution with governance, testing, and a path to production. Not a throwaway POC that dies after the demo.",
    deliverables: [
      "Scoped pilot with clear success metrics",
      "Working solution (not a mockup)",
      "Governance documentation (bias testing, risk controls)",
      "Integration architecture for your systems",
      "Team training + handoff documentation",
      "30-day post-launch support",
    ],
    idealFor:
      "Teams with a clear use case who need someone to actually build it right. Organizations tired of pilots that go nowhere.",
    comparison:
      "Pricing depends on complexity. We'll scope it together and you'll know the cost before we start.",
  },
  {
    id: "fractional-ai-lead",
    icon: User,
    title: "Fractional AI & Governance Lead",
    tagline: "Senior leadership without the salary",
    price: "Let's Talk",
    priceNote: "",
    timeline: "Flexible engagement",
    popular: false,
    description:
      "Embedded AI leadership on your schedule. We join your team, attend your meetings, and own your AI + governance strategy. All the expertise, fraction of the cost.",
    deliverables: [
      "AI strategy development + execution oversight",
      "Governance program buildout",
      "Vendor evaluation and management",
      "Team hiring and development guidance",
      "Board/leadership communication",
      "On-call for critical decisions",
    ],
    idealFor:
      "Companies not ready for a full-time AI executive. Teams between leaders. Growing organizations.",
    comparison:
      "Flexible hours and scope. We'll design an arrangement that fits your budget and needs.",
  },
  {
    id: "partner-subcontract",
    icon: Handshake,
    title: "Partner & Subcontract",
    tagline: "Your AI governance bench strength",
    price: "Let's Talk",
    priceNote: "",
    timeline: "Flexible",
    popular: false,
    description:
      "We work behind the scenes as your AI and governance specialist. White-label support for primes, integrators, and consultancies who need deep expertise on contracts.",
    deliverables: [
      "AI SME for proposals and orals",
      "Governance framework development",
      "Technical architecture review",
      "Client-facing delivery (your brand)",
      "Flexible engagement models",
      "Quick mobilization",
    ],
    idealFor:
      "Primes bidding AI work without in-house expertise. Consultancies expanding into AI. Integrators who need governance on contracts.",
    comparison: null,
  },
];

const faqs = [
  {
    question: "Why is The $1K Question so affordable?",
    answer:
      "It's designed to be a no-brainer entry point. For $997, you get a senior strategist's focused attention on YOUR business, not a generic AI pitch. If we're a fit for bigger work, great. If not, you still walk away with a clear answer and action plan. No risk, real value.",
  },
  {
    question: "Why 'Let's Talk' instead of fixed prices for larger engagements?",
    answer:
      "Because every business is different. A roadmap for a 10-person team looks nothing like one for a 200-person org. We'd rather scope something that fits your reality than quote a number that's too high or too low. The conversation is free, and you'll know the investment before we start.",
  },
  {
    question: "What if I'm not sure which service I need?",
    answer:
      "Start with The $1K Question. In 48-72 hours, you'll know exactly where AI can help your business and whether you need a scan, roadmap, or full build. It's designed to give you clarity before you commit to anything bigger.",
  },
  {
    question: "Why should I trust a smaller firm over a big consultancy?",
    answer:
      "No overhead. No layers of management. No junior consultants learning on your dime. When you hire JMCB, you get a senior practitioner who's actually done this work: 15+ years in federal and healthcare tech. You pay for expertise, not a brand name.",
  },
  {
    question: "What makes your governance approach different?",
    answer:
      "We build governance INTO the AI work, not as a separate workstream that slows everything down. Most governance consultants hand you a framework and leave. We help you operationalize it. A policy that nobody follows is worthless.",
  },
  {
    question: "Can you work within federal procurement processes?",
    answer:
      "Yes. Our team has 15+ years in federal contracting, including work with DOJ and USPS. We understand ATOs, FedRAMP, FAR/DFAR, and the realities of government procurement. We can work as a subcontractor, through an 8(a), or via GSA schedule depending on your needs.",
  },
  {
    question: "What if we just need help on one piece of a larger project?",
    answer:
      "That's exactly what the Partner & Subcontract option is for. We regularly support larger teams as the AI/governance specialist. Happy to scope a focused engagement around your specific gap.",
  },
];

const differentiators = [
  {
    icon: FlaskConical,
    title: "Scientists who code",
    description:
      "M.S. Molecular Genetics + Python/production systems. We understand both the science and the engineering.",
  },
  {
    icon: Landmark,
    title: "Federal insiders",
    description:
      "15+ years DOJ, USPS, federal agencies. We know ATOs, FedRAMP, and procurement inside out.",
  },
  {
    icon: Heart,
    title: "Healthcare + Federal Focus",
    description:
      "Deep experience in regulated industries where governance isn't optional. We know the compliance landscape.",
  },
  {
    icon: Target,
    title: "Senior practitioners only",
    description:
      "No bait-and-switch. No handing you off to someone who just learned this last week.",
  },
];

const CALENDLY_URL =
  "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

// ServiceCard Component
function ServiceCard({
  service,
}: {
  service: (typeof services)[0];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = service.icon;

  return (
    <div
      id={service.id}
      className={`bg-white rounded-2xl border-2 transition-all duration-300 ${
        service.popular
          ? "border-accent shadow-lg shadow-accent/10"
          : "border-gray-200"
      } ${isExpanded ? "shadow-xl" : "shadow-md hover:shadow-lg"}`}
    >
      {/* Popular Badge */}
      {service.popular && (
        <div className="bg-accent text-white text-xs font-semibold tracking-wide px-4 py-1.5 rounded-t-xl text-center">
          MOST POPULAR
        </div>
      )}

      {/* Collapsed Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center gap-4 text-left"
        aria-expanded={isExpanded}
        aria-controls={`${service.id}-content`}
      >
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
            service.popular ? "bg-accent/10" : "bg-primary/10"
          }`}
        >
          <IconComponent
            className={`w-7 h-7 ${service.popular ? "text-accent" : "text-primary"}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-heading font-bold text-gray-900">
            {service.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1">{service.tagline}</p>
        </div>

        <div className="flex-shrink-0 text-right hidden sm:block">
          <div className="text-xl font-bold text-gray-900">
            {service.price}
            {service.priceNote && (
              <span className="text-sm font-normal text-gray-500">
                {service.priceNote}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 justify-end mt-1">
            <Clock className="w-4 h-4" />
            {service.timeline}
          </div>
        </div>

        <div className="flex-shrink-0 ml-2">
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-gray-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </button>

      {/* Mobile Price (visible only on small screens) */}
      <div className="sm:hidden px-6 pb-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="text-lg font-bold text-gray-900">
          {service.price}
          {service.priceNote && (
            <span className="text-sm font-normal text-gray-500">
              {service.priceNote}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {service.timeline}
        </div>
      </div>

      {/* Expanded Content */}
      <div
        id={`${service.id}-content`}
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 border-t border-gray-100">
          {/* Description */}
          <p className="text-gray-600 leading-relaxed mt-6 mb-6">
            {service.description}
          </p>

          {/* What's Included */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              What&apos;s Included
            </h4>
            <ul className="space-y-2">
              {service.deliverables.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ideal For */}
          <div className="bg-primary/5 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-primary mb-2">
              Ideal For
            </h4>
            <p className="text-gray-700">{service.idealFor}</p>
          </div>

          {/* Comparison */}
          {service.comparison && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border-l-4 border-accent">
              <p className="text-sm text-gray-600 italic">
                <span className="font-semibold text-gray-900">
                  For comparison:
                </span>{" "}
                {service.comparison}
              </p>
            </div>
          )}

          {/* CTA */}
          <Link
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Discuss This Service
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ faq }: { faq: (typeof faqs)[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="JMCB Technology Group"
              width={120}
              height={43}
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/#services"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="#pricing"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              FAQ
            </Link>
            <Link
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              Book a Call
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            Our Services
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Responsible AI That
            <br />
            <span className="text-accent">Actually Ships</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Most governance consultants give you frameworks and leave. Most AI
            builders move fast and break things.{" "}
            <span className="text-white font-medium">We do both.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#pricing"
              className="px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              See Pricing
            </Link>
            <Link
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Book a Free Call
            </Link>
          </div>
        </div>
      </section>

      {/* Value Banner */}
      <section className="bg-accent py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-3 text-center">
          <Lightbulb className="w-5 h-5 text-white flex-shrink-0" />
          <p className="text-white font-medium">
            <span className="font-bold">Start with The $1K Question.</span> Get
            clarity on your AI opportunity before committing to anything bigger.
          </p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Why start with The $1K Question?
              </h3>
              <p className="text-gray-600 text-sm">
                Most businesses waste thousands on AI initiatives that don&apos;t fit.
                For $997, you get absolute clarity on your highest-ROI opportunity.
                before you invest another dollar.
              </p>
            </div>
            <div className="flex-shrink-0 grid grid-cols-3 gap-4 text-center">
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Wrong AI Bet</div>
                <div className="text-lg font-bold text-gray-400">
                  $50K+
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Analysis Paralysis</div>
                <div className="text-lg font-bold text-gray-400">
                  6+ months
                </div>
              </div>
              <div className="px-4 py-3 bg-accent/10 rounded-lg">
                <div className="text-xs text-accent mb-1">The $1K Question</div>
                <div className="text-lg font-bold text-accent">Clarity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="pricing" className="py-16 md:py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Choose Your Engagement
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From a quick assessment to ongoing leadership. Find the right fit
              for where you are.
            </p>
          </div>

          <div className="space-y-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Reference Table */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h3 className="text-xl font-heading font-bold text-gray-900 mb-6 text-center">
            Quick Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Service
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Investment
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Timeline
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr
                    key={service.id}
                    className={`border-b border-gray-100 ${
                      service.popular ? "bg-accent/5" : ""
                    }`}
                  >
                    <td className="py-4 px-4">
                      <Link
                        href={`#${service.id}`}
                        className="font-medium text-gray-900 hover:text-primary transition-colors"
                      >
                        {service.title}
                        {service.popular && (
                          <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {service.price}
                      {service.priceNote}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{service.timeline}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {service.idealFor.split(".")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Why Work With JMCB
            </h2>
            <p className="text-lg text-gray-600">
              Not your typical consultant. Here&apos;s what makes us different.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 md:py-24 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Let&apos;s figure out your next step
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            30 minutes. No pitch deck. No pressure.
          </p>
          <Link
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 bg-accent text-white text-lg font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg mb-6"
          >
            Book a Free Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-400">
            Or email directly:{" "}
            <Link
              href="mailto:jermaine@jmcbtech.com"
              className="text-accent hover:text-amber-400 transition-colors"
            >
              jermaine@jmcbtech.com
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark py-8 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-gray-500">
            © 2026 JMCB Technology Group. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <Link href="/" className="hover:text-gray-400 transition-colors">
              jmcbtech.com
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
