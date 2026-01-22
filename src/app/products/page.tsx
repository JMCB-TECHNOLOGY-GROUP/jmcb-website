"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Check } from "lucide-react";

const bookBenefits = [
  "The Laboratory Method: a 5-step framework for career experimentation",
  "The 60/25/15 skill portfolio system for bulletproof positioning",
  "90-day sprint protocols for rapid skill acquisition",
  "Real stories from the author's journey from night shift to AI leadership",
];

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review";

export default function ProductsPage() {
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
              href="/"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              href="/#career"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Career Lab
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-4">
            Career Lab Products
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Tools for Career Growth
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Resources built on the same systematic thinking we bring to enterprise AI strategy.
          </p>
        </div>

        {/* Book Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Book Visual */}
            <div className="bg-gradient-to-br from-primary to-secondary p-12 lg:p-16 flex items-center justify-center">
              <div className="relative">
                <div
                  className="relative bg-white rounded-lg p-8 shadow-2xl w-64"
                  style={{ transform: "perspective(800px) rotateY(-8deg)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg opacity-95" />
                  <div className="relative text-white">
                    <p className="text-xs font-medium tracking-wider mb-3 opacity-80">
                      JERMAINE BARKER
                    </p>
                    <h3 className="text-2xl font-heading font-bold mb-3">
                      Skills Close
                      <br />
                      the Deal
                    </h3>
                    <div className="w-12 h-0.5 bg-accent mb-3" />
                    <p className="text-xs opacity-80 leading-tight">
                      How to Bulletproof Your Career and Life
                    </p>
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-primary/50 rounded-l-lg" />
                </div>
                <div className="absolute -bottom-6 left-4 right-4 h-8 bg-black/20 blur-xl rounded-full" />
              </div>
            </div>

            {/* Book Info */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full mb-6 w-fit">
                <BookOpen className="w-4 h-4 text-secondary" />
                <span className="text-xs font-semibold text-secondary">BOOK</span>
              </div>

              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                Skills Close the Deal
              </h2>
              <p className="text-lg text-gray-500 mb-6">
                How to Bulletproof Your Career and Life
              </p>

              <p className="text-gray-600 leading-relaxed mb-8">
                Generic career advice doesn't work because your situation is unique. This book teaches you the Laboratory Method: a framework for running experiments on your own career to discover what actually works for you.
              </p>

              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  What you'll learn:
                </p>
                <ul className="space-y-3">
                  {bookBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 bg-secondary/10 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-secondary" />
                      </span>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#"
                  className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Get the Book - $19.99
                </Link>
                <Link
                  href="/chapter"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary hover:text-white transition-all duration-200"
                >
                  Read Free Chapter
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon / Additional Products */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-8">
            More resources coming soon. Want to be notified?
          </p>
          <Link
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Book a Free Career Strategy Session
          </Link>
        </div>
      </main>

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
