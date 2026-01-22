"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function FinalCTA() {
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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 md:py-32 bg-navy relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-on-scroll text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Whether you&apos;re building AI for your business or building a career that compounds, let&apos;s talk.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Business CTA */}
          <div className="animate-on-scroll bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
              For Business
            </p>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              AI Strategy Consultation
            </h3>
            <p className="text-gray-300 mb-6">
              Assess your AI opportunities and get a clear path to results.
            </p>
            <Link
              href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
            >
              Book AI Consultation
            </Link>
          </div>

          {/* Career CTA */}
          <div className="animate-on-scroll bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center" style={{ transitionDelay: "100ms" }}>
            <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-4">
              For Professionals
            </p>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              Career Strategy Session
            </h3>
            <p className="text-gray-300 mb-6">
              Map out your next career move with a free 30-minute session.
            </p>
            <Link
              href="https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition-all"
            >
              Book Free Session
            </Link>
          </div>
        </div>

        <p className="mt-10 text-center text-gray-400">
          Or reach out directly:{" "}
          <Link
            href="mailto:jermaine@jmcbtech.com"
            className="text-accent hover:text-amber-400 transition-colors font-medium"
          >
            jermaine@jmcbtech.com
          </Link>
        </p>
      </div>
    </section>
  );
}
