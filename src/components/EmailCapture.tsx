"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, ArrowRight, Check } from "lucide-react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: Connect to your email service (ConvertKit, Mailchimp, etc.)
    // For now, simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-on-scroll flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <FileText className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-heading font-bold text-white mb-2">
              Free Guide: 5 Questions Before Your First AI Project
            </h3>
            <p className="text-white/80 mb-4">
              The questions that separate successful AI initiatives from expensive failures. No fluff, just the critical thinking framework used by teams that ship.
            </p>

            {status === "success" ? (
              <div className="flex items-center gap-2 text-white font-medium">
                <Check className="w-5 h-5" />
                Check your inbox! Guide is on the way.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy/90 transition-all disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Get the Guide
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
