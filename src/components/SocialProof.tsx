"use client";

import { useEffect, useRef } from "react";

export default function SocialProof() {
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            Results That Matter
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Teams Like Yours, Already Using AI
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From 10-person startups to 200-person firms, these teams stopped experimenting and started shipping.
          </p>
        </div>

        {/* Case studies with metrics */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="animate-on-scroll bg-white/5 rounded-xl p-8 border border-white/10">
            <p className="text-accent text-sm font-semibold uppercase tracking-wide mb-4">
              Professional Services
            </p>
            <h3 className="text-lg font-heading font-bold text-white mb-3">
              25-Person Law Firm
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Deployed AI agents for contract review and client intake. Now processing documents 3x faster with fewer errors.
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold text-accent">60%</p>
                <p className="text-xs text-gray-500">Time saved on reviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">6 weeks</p>
                <p className="text-xs text-gray-500">To deployment</p>
              </div>
            </div>
          </div>

          <div className="animate-on-scroll bg-white/5 rounded-xl p-8 border border-white/10" style={{ transitionDelay: "100ms" }}>
            <p className="text-accent text-sm font-semibold uppercase tracking-wide mb-4">
              Healthcare
            </p>
            <h3 className="text-lg font-heading font-bold text-white mb-3">
              Medical Practice Group
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Used our playbooks to train front desk and billing staff on AI tools. Reduced patient wait times and billing errors.
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold text-accent">40%</p>
                <p className="text-xs text-gray-500">Faster scheduling</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">4 weeks</p>
                <p className="text-xs text-gray-500">Team trained</p>
              </div>
            </div>
          </div>

          <div className="animate-on-scroll bg-white/5 rounded-xl p-8 border border-white/10" style={{ transitionDelay: "200ms" }}>
            <p className="text-accent text-sm font-semibold uppercase tracking-wide mb-4">
              Marketing Agency
            </p>
            <h3 className="text-lg font-heading font-bold text-white mb-3">
              15-Person Creative Team
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Implemented content generation agents for first drafts. Writers now focus on strategy and client voice instead of blank pages.
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold text-accent">2x</p>
                <p className="text-xs text-gray-500">Content output</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">$497/mo</p>
                <p className="text-xs text-gray-500">Total AI cost</p>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="animate-on-scroll border-t border-white/10 pt-12">
          <p className="text-center text-sm text-gray-500 mb-6">
            Built by practitioners who have shipped AI at
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-400">
            <span>Fortune 500 Tech</span>
            <span className="text-white/20">|</span>
            <span>Federal Agencies</span>
            <span className="text-white/20">|</span>
            <span>Healthcare Systems</span>
            <span className="text-white/20">|</span>
            <span>High-Growth Startups</span>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Now we bring that experience to smaller teams who want enterprise-grade results without the enterprise price.
          </p>
        </div>
      </div>
    </section>
  );
}
