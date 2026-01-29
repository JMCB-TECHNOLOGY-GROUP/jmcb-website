"use client";

import Link from "next/link";
import { ArrowRight, Clock, CheckCircle, Zap } from "lucide-react";

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
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Now Booking February Sprints
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
              Your First AI Agent,{" "}
              <span className="text-accent">Live in 30 Days</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed mb-8">
              We build and deploy one production-ready AI agent for your team. You pick the problem. We handle the build. Your team gets trained. Done in 30 days or less.
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm">30-day delivery</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm">One focused agent</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-sm">Full team training included</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/sprint"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Apply for AI Deployment Sprint
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                See How It Works
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              3 spots available for February. Applications reviewed within 48 hours.
            </p>
          </div>

          {/* Hero Visual - Sprint Deliverables */}
          <div className="hidden lg:block relative">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="bg-white rounded-lg p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Sprint Deliverables</p>
                    <p className="text-2xl font-bold text-gray-900">30-Day Package</p>
                  </div>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Production AI Agent</p>
                      <p className="text-sm text-gray-500">Custom-built for your workflow</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Full Integration</p>
                      <p className="text-sm text-gray-500">Connected to your existing tools</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Team Training</p>
                      <p className="text-sm text-gray-500">2-hour live session + documentation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">30-Day Support</p>
                      <p className="text-sm text-gray-500">Slack access for questions</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">Starting at <span className="font-bold text-gray-900 text-lg">$7,500</span></p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent text-white px-4 py-2 rounded-lg font-semibold text-sm">
                Limited spots each month
              </div>
            </div>
          </div>
        </div>

        {/* Agent Types */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">
              Most Popular
            </p>
            <h3 className="text-lg font-heading font-bold text-white mb-2">
              Knowledge Bot
            </h3>
            <p className="text-gray-400 text-sm">
              Answers team questions instantly using your internal docs, SOPs, and knowledge base. Saves 10+ hours per week.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">
              Revenue Driver
            </p>
            <h3 className="text-lg font-heading font-bold text-white mb-2">
              Sales Prep Agent
            </h3>
            <p className="text-gray-400 text-sm">
              Researches prospects, writes personalized outreach, and generates meeting briefs. Your team closes faster.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-3">
              Ops Efficiency
            </p>
            <h3 className="text-lg font-heading font-bold text-white mb-2">
              Process Automation Agent
            </h3>
            <p className="text-gray-400 text-sm">
              Handles data entry, report generation, and repetitive tasks. Free your team for high-value work.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
