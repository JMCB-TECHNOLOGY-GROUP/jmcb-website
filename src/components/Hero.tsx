"use client";

import Link from "next/link";
import { ArrowRight, Clock, DollarSign, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-navy overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-primary/20" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div>
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-6">
              AI That Actually Works for Your Business
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
              Deploy AI in Weeks,{" "}
              <span className="text-accent">Not Quarters</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed mb-8">
              Stop experimenting. Start shipping. We help small and mid-sized businesses get real AI tools running in their operations, without the enterprise price tag or 12-month timelines.
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm">Results in 4-8 weeks</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <DollarSign className="w-5 h-5 text-accent" />
                <span className="text-sm">Starts at $2,500</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-sm">Built for teams of 5-500</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Free AI Readiness Assessment
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                See Solutions & Pricing
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              Trusted by professional services firms, healthcare practices, and growing tech teams
            </p>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:block relative">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              {/* Assessment Preview Mock */}
              <div className="bg-white rounded-lg p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">AI Readiness Score</p>
                    <p className="text-4xl font-bold text-gray-900">72<span className="text-lg text-gray-400">/100</span></p>
                  </div>
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Strategy Alignment</span>
                      <span className="font-semibold text-green-600">Strong</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Data Readiness</span>
                      <span className="font-semibold text-amber-600">Moderate</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-amber-500 rounded-full" style={{ width: "60%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Team Capability</span>
                      <span className="font-semibold text-amber-600">Moderate</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-amber-500 rounded-full" style={{ width: "55%" }} />
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">Top Opportunity: <span className="font-semibold text-gray-900">Customer Service Automation</span></p>
                  <p className="text-xs text-green-600 mt-1">Est. ROI: $45,000/year</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent text-white px-4 py-2 rounded-lg font-semibold text-sm">
                See your AI score in 3 minutes
              </div>
            </div>
          </div>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">
              The Method
            </p>
            <h3 className="text-lg font-heading font-bold text-white mb-2">
              ASCEND Framework
            </h3>
            <p className="text-gray-400 text-sm">
              A proven 5-step process that takes you from "where do we start?" to working AI tools your team actually uses.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">
              Ready-to-Use
            </p>
            <h3 className="text-lg font-heading font-bold text-white mb-2">
              AI Products & Agents
            </h3>
            <p className="text-gray-400 text-sm">
              Pre-built AI agents for content, operations, and customer service. Deploy in days, not months.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">
              Your Way
            </p>
            <h3 className="text-lg font-heading font-bold text-white mb-2">
              Flexible Packages
            </h3>
            <p className="text-gray-400 text-sm">
              DIY with our playbooks, get hands-on help, or license for your own clients. Pick what fits your budget.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
