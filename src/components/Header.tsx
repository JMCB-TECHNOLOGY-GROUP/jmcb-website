"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/healthcare", label: "Healthcare" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/leadership", label: "Leadership" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="JMCB Technology Group" width={36} height={36} className="h-9 w-auto" />
            <span className="text-xl font-bold text-gray-900 font-display">
              JMCB<span className="text-accent">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-wide">
                {link.label}
              </Link>
            ))}
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm !py-2.5 !px-5">
              Book a Call
            </Link>
          </nav>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm !py-2.5" onClick={() => setMobileMenuOpen(false)}>
                Book a Call
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
