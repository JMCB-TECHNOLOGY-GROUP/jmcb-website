import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Key, Check } from "lucide-react";

export const metadata = {
  title: "Solutions | JMCB Technology",
  description: "Enterprise AI transformation and ASCEND framework licensing from JMCB Technology.",
};

export default function SolutionsPage() {
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
            <Link href="/platform" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Platform
            </Link>
            <Link href="/solutions" className="text-white text-sm font-medium">
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
            Solutions & Pricing
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Pick What Fits Your Budget
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From self-service products to full transformation engagements. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* B2B Solutions */}
      <section id="b2b" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
              For Business Teams
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Get AI Working in Your Business
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three packages designed for different stages. Start small and expand, or go all-in from day one.
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Starter</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">$2,500</p>
              <p className="text-sm text-gray-500 mb-6">One-time</p>

              <p className="text-gray-600 mb-6">
                Perfect for small teams who want a clear picture of where AI can help before investing more.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Deep-dive AI Readiness Assessment</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">90-minute strategy session</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Top 3 AI opportunities report</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">ROI estimates for each opportunity</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">Best for: Teams of 5-25 exploring AI</p>

              <Link
                href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Growth - Featured */}
            <div className="bg-navy rounded-2xl p-8 border-2 border-accent relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-4 py-1 rounded-full">
                Most Popular
              </div>
              <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">Growth</p>
              <p className="text-4xl font-bold text-white mb-2">$7,500</p>
              <p className="text-sm text-gray-400 mb-6">One-time + optional retainer</p>

              <p className="text-gray-300 mb-6">
                For teams ready to deploy their first AI solution. We build it with you, not just for you.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">Everything in Starter</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">One AI agent built and deployed</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">Team training (up to 10 people)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">30-day post-launch support</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">AI Playbook for your industry</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-4">Best for: Teams of 10-50 ready to ship</p>

              <Link
                href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
              >
                Book a Call
              </Link>
            </div>

            {/* Scale */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Scale</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">$15,000+</p>
              <p className="text-sm text-gray-500 mb-6">Custom scope</p>

              <p className="text-gray-600 mb-6">
                Full ASCEND engagement for teams deploying multiple AI solutions across the organization.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Everything in Growth</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Multiple AI agents deployed</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Company-wide training program</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Governance framework setup</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Quarterly strategy reviews</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">Best for: Teams of 50-500 scaling AI</p>

              <Link
                href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-all"
              >
                Discuss Your Needs
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Licensing / Partner Section */}
      <section id="licensing" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Key className="w-7 h-7 text-accent" />
            </div>
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              For Partners & Consultancies
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Add AI Services to Your Practice
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              License the ASCEND framework and our AI agents to deliver AI enablement under your own brand. We provide the methodology; you keep the client relationship.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="bg-cream rounded-2xl p-8">
              <p className="font-semibold text-gray-900 mb-6">Partner Economics</p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">You Keep 70%+ of Revenue</p>
                    <p className="text-sm text-gray-600">Flat licensing fee, not revenue share. Your margins stay healthy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">White-Label Everything</p>
                    <p className="text-sm text-gray-600">Present the framework and agents as your own. We stay behind the scenes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Fast Time to First Deal</p>
                    <p className="text-sm text-gray-600">Partners typically close their first AI engagement within 60 days.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Deal Support When You Need It</p>
                    <p className="text-sm text-gray-600">We can join sales calls, help scope projects, or stay completely out of sight.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Licensing starts at $5,000/year. Volume discounts available.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <p className="font-semibold text-gray-900 mb-6">What Partners Get</p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">ASCEND Framework License</p>
                    <p className="text-sm text-gray-600">Full methodology, templates, client-ready deliverables</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">AI Agent Library Access</p>
                    <p className="text-sm text-gray-600">Deploy our pre-built agents for your clients</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Team Certification</p>
                    <p className="text-sm text-gray-600">Train your consultants to deliver ASCEND engagements</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sales & Marketing Kit</p>
                    <p className="text-sm text-gray-600">Pitch decks, case studies, proposal templates</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Quarterly Updates</p>
                    <p className="text-sm text-gray-600">New agents, updated frameworks, market insights</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
                >
                  Discuss Partnership
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Not Sure Which Solution Fits?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Start with the AI Readiness Assessment. It takes five minutes and helps identify the right path forward.
          </p>

          <Link
            href="/assessment"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
          >
            Start AI Readiness Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
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
