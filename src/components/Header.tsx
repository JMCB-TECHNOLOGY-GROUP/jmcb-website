"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">
              JMCB<span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#offers"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#results"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Results
            </Link>
            <Link
              href="/assessment"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Assessment
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              Book a Call
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              <Link
                href="/#offers"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/#results"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Results
              </Link>
              <Link
                href="/assessment"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assessment
              </Link>
              <Link
                href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book a Call
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
