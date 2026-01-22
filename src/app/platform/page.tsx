import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ClipboardCheck, Target, Wrench, Play, Rocket, ClipboardList, BookOpen, Bot } from "lucide-react";

export const metadata = {
  title: "Platform | JMCB Technology",
  description: "The JMCB Technology platform: ASCEND AI Framework, AI Enablement Products, and flexible engagement models.",
};

const ascendStages = [
  {
    icon: ClipboardCheck,
    letter: "A",
    name: "Assess",
    outcome: "Understand your current state",
    activities: [
      "Evaluate organizational readiness across six dimensions",
      "Identify data infrastructure gaps",
      "Benchmark against industry standards",
      "Document team capabilities and skill gaps",
    ],
  },
  {
    icon: Target,
    letter: "S",
    name: "Strategize",
    outcome: "Define priorities and roadmap",
    activities: [
      "Identify high-value AI use cases",
      "Score opportunities by impact and feasibility",
      "Set measurable success criteria",
      "Create phased implementation plan",
    ],
  },
  {
    icon: Wrench,
    letter: "C",
    name: "Capability Build",
    outcome: "Develop skills and infrastructure",
    activities: [
      "Train teams on AI fundamentals and tools",
      "Establish governance and oversight frameworks",
      "Build data pipelines and infrastructure",
      "Create evaluation and testing protocols",
    ],
  },
  {
    icon: Play,
    letter: "E",
    name: "Execution",
    outcome: "Build and validate solutions",
    activities: [
      "Develop minimum viable AI solutions",
      "Run controlled pilots with real users",
      "Gather feedback and performance data",
      "Iterate based on results",
    ],
  },
  {
    icon: Rocket,
    letter: "D",
    name: "Deployment",
    outcome: "Scale across the organization",
    activities: [
      "Move validated solutions to production",
      "Integrate with existing workflows",
      "Train end users and support teams",
      "Establish monitoring and optimization cycles",
    ],
  },
];

const products = [
  {
    icon: ClipboardList,
    name: "AI Readiness Assessment",
    description: "A structured evaluation tool that scores your organization across strategy, data, governance, and execution readiness.",
    deliverables: [
      "Readiness score across six dimensions",
      "Gap analysis with prioritized findings",
      "Use case recommendations ranked by impact",
      "90-day roadmap outline",
    ],
  },
  {
    icon: BookOpen,
    name: "AI Playbooks",
    description: "Role-specific guides that help different functions adopt AI effectively.",
    deliverables: [
      "Product Manager AI Playbook",
      "Executive AI Decision Framework",
      "Operations AI Integration Guide",
      "Governance and Risk Playbook",
    ],
  },
  {
    icon: Bot,
    name: "Automated Agents",
    description: "Pre-built AI agents that handle common business tasks without custom development.",
    deliverables: [
      "Content generation agents",
      "Workflow automation agents",
      "Data analysis agents",
      "Custom agent development",
    ],
  },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-navy py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="JMCB Technology"
              width={120}
              height={43}
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/platform" className="text-white text-sm font-medium">
              Platform
            </Link>
            <Link href="/solutions" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Solutions
            </Link>
            <Link
              href="/assessment"
              className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              Start Assessment
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            The JMCB Technology Platform
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Three Layers. One Clear Path.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            JMCB Technology is built as a platform, not a consultancy. A proprietary framework, productized offerings, and flexible engagement models designed to scale.
          </p>
        </div>
      </section>

      {/* Three Layers Overview */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Platform Architecture
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each layer builds on the previous to create a complete AI enablement system.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary">
              <p className="text-primary text-xs font-semibold tracking-widest uppercase mb-4">
                Layer 1: IP Core
              </p>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                ASCEND AI Framework
              </h3>
              <p className="text-gray-600 mb-4">
                The proprietary methodology at the center of everything we do. Five stages that guide organizations from initial assessment through full deployment.
              </p>
              <p className="text-sm text-gray-500">
                Repeatable. Scalable. Proven across industries.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-accent">
              <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-4">
                Layer 2: Products
              </p>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                AI Enablement Products
              </h3>
              <p className="text-gray-600 mb-4">
                Assessments, playbooks, and automated agents built on the ASCEND framework. Products that deliver value without custom engagements.
              </p>
              <p className="text-sm text-gray-500">
                Self-service options. Immediate application.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-secondary">
              <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-4">
                Layer 3: Revenue
              </p>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                Flexible Engagement
              </h3>
              <p className="text-gray-600 mb-4">
                B2B transformation contracts, B2C career programs, and licensing arrangements. Multiple ways to access the platform.
              </p>
              <p className="text-sm text-gray-500">
                Choose the model that fits your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ASCEND Framework Detail */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
              Layer 1
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              The ASCEND AI Framework
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A five-stage methodology that provides structure without rigidity. Each stage has clear activities, deliverables, and success criteria.
            </p>
          </div>

          <div className="space-y-8">
            {ascendStages.map((stage, index) => (
              <div
                key={stage.name}
                className="bg-cream rounded-2xl p-8 flex flex-col md:flex-row gap-6"
              >
                <div className="flex-shrink-0 flex items-start gap-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                    <span className="text-3xl font-bold text-accent">{stage.letter}</span>
                  </div>
                  <div className="md:hidden">
                    <h3 className="text-xl font-heading font-bold text-gray-900">
                      {stage.name}
                    </h3>
                    <p className="text-primary font-medium">{stage.outcome}</p>
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="hidden md:block mb-4">
                    <h3 className="text-xl font-heading font-bold text-gray-900">
                      Stage {index + 1}: {stage.name}
                    </h3>
                    <p className="text-primary font-medium">{stage.outcome}</p>
                  </div>

                  <ul className="grid sm:grid-cols-2 gap-3">
                    {stage.activities.map((activity) => (
                      <li key={activity} className="flex items-start gap-2 text-gray-600">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Detail */}
      <section id="products" className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Layer 2
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              AI Enablement Products
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Productized offerings built on the ASCEND framework. Each product is designed for immediate application with clear deliverables.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <product.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                  {product.name}
                </h3>

                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>

                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Includes:
                </p>
                <ul className="space-y-2">
                  {product.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Begin with the AI Readiness Assessment or schedule a platform walkthrough with our team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
            >
              Start AI Readiness Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Request Platform Walkthrough
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark py-8 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2026 JMCB Technology. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
