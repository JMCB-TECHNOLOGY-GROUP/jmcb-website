"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";

const navLinks = [
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/assessment", label: "Assessment" },
];

export default function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="JMCB Technology Group"
              width={120}
              height={43}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-accent ${
                  isScrolled ? "text-gray-700" : "text-gray-200"
                }`}
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
                      className={`text-sm font-medium transition-colors duration-300 hover:text-accent flex items-center gap-2 ${
                        isScrolled ? "text-gray-700" : "text-gray-200"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <UserButton
                      afterSignOutUrl="/"
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
                      <button
                        className={`text-sm font-medium transition-colors duration-300 hover:text-accent ${
                          isScrolled ? "text-gray-700" : "text-gray-200"
                        }`}
                      >
                        Sign In
                      </button>
                    </SignInButton>
                    <Link
                      href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
                      Book Strategy Call
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}
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
                        className={`text-sm font-medium flex items-center gap-2 ${
                          isScrolled ? "text-gray-700" : "text-white"
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <div className="pt-2">
                        <UserButton
                          afterSignOutUrl="/"
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
                        <button
                          className={`text-sm font-medium text-left ${
                            isScrolled ? "text-gray-700" : "text-white"
                          }`}
                        >
                          Sign In
                        </button>
                      </SignInButton>
                      <Link
                        href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="btn-primary text-sm text-center"
                      >
                        Book Strategy Call
                      </Link>
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
