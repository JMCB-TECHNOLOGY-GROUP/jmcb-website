"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Header */}
      <header className="w-full px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            JMCB<span className="text-accent">.</span>
          </span>
          <Link
            href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Book a Call
          </Link>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Get clarity on AI
            <br />
            <span className="text-accent">for your business</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto">
            Stop guessing. Find out exactly where AI can help you — and what to do first.
          </p>

          {/* Two CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all text-lg"
            >
              Take Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-all text-lg"
            >
              <Calendar className="w-5 h-5" />
              Book Free Call
            </Link>
          </div>

          {/* Simple Credibility */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-400">
            <span>15+ years tech leadership</span>
            <span className="hidden sm:inline">•</span>
            <span>Johns Hopkins Fellow</span>
            <span className="hidden sm:inline">•</span>
            <span>$2B+ programs delivered</span>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full px-6 py-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>© 2026 JMCB Technology Group</span>
          <div className="flex gap-6">
            <a href="mailto:jermaine@jmcbtech.com" className="hover:text-gray-600">
              jermaine@jmcbtech.com
            </a>
            <a
              href="https://linkedin.com/in/jermainebarker"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
