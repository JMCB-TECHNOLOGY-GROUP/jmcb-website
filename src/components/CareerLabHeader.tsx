"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

const navLinks = [
  { href: "/career-assessment", label: "Assessment" },
  { href: "/workforce", label: "For Organizations" },
  { href: "/products", label: "Resources" },
];

export default function CareerLabHeader() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-navy py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/career-assessment" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Career Lab"
              className="h-10 w-auto"
            />
            <span className="hidden sm:inline-block px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-md text-xs font-semibold text-secondary">
              Career Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                    <UserButton
                      afterSignOutUrl="/career-assessment"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <SignInButton mode="modal">
                      <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-4 py-2 bg-secondary text-white text-sm font-semibold rounded-lg hover:bg-primary transition-colors">
                        Get Started
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              {isLoaded && (
                <>
                  {isSignedIn ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm font-medium text-gray-300 hover:text-white"
                      >
                        Dashboard
                      </Link>
                      <div className="pt-2">
                        <UserButton
                          afterSignOutUrl="/career-assessment"
                          appearance={{
                            elements: {
                              avatarBox: "w-8 h-8",
                            },
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <SignInButton mode="modal">
                        <button className="text-sm font-medium text-gray-300 text-left">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="px-4 py-2 bg-secondary text-white text-sm font-semibold rounded-lg text-center">
                          Get Started Free
                        </button>
                      </SignUpButton>
                    </>
                  )}
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
