"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MessageSquare } from "lucide-react";

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

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-on-scroll text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            3 Spots Left for February
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
            Ready to Deploy Your First AI Agent?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Apply for the AI Deployment Sprint. We review every application within 48 hours and schedule a discovery call with qualified teams.
          </p>
        </div>

        <div className="animate-on-scroll bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 text-center">
          <h3 className="text-2xl font-heading font-bold text-white mb-4">
            What Happens Next
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-accent font-bold">1</span>
              </div>
              <p className="text-white font-semibold mb-1">Apply (2 min)</p>
              <p className="text-gray-400 text-sm">Tell us about your team and the problem you want to solve</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-accent font-bold">2</span>
              </div>
              <p className="text-white font-semibold mb-1">Discovery Call</p>
              <p className="text-gray-400 text-sm">30-min call to scope your agent and confirm fit</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-accent font-bold">3</span>
              </div>
              <p className="text-white font-semibold mb-1">Sprint Kicks Off</p>
              <p className="text-gray-400 text-sm">Your agent goes live within 30 days</p>
            </div>
          </div>

          <Link
            href="/sprint"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg text-lg"
          >
            Apply for AI Deployment Sprint
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Applications reviewed within 48 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>No commitment until discovery call</span>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-gray-400">
          Questions before applying?{" "}
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
