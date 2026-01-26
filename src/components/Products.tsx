"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Rocket, TrendingUp, Building2, ArrowRight, Check } from "lucide-react";

const sprintPackages = [
  {
    icon: Rocket,
    name: "Starter Sprint",
    description: "One production-ready AI agent deployed to your team. Ideal for teams testing AI for the first time.",
    features: [
      "1 custom AI agent",
      "Integration with 2 tools",
      "2-hour team training",
      "30-day Slack support",
      "Documentation + SOPs",
    ],
    href: "/sprint",
    cta: "Apply Now",
    price: "$7,500",
    highlight: false,
  },
  {
    icon: TrendingUp,
    name: "Growth Sprint",
    description: "AI agent plus workflow automation. Best for teams ready to see measurable ROI from their first deployment.",
    features: [
      "1 custom AI agent",
      "Integration with 5 tools",
      "Full workflow automation",
      "4-hour team training",
      "60-day priority support",
      "Monthly optimization call",
    ],
    href: "/sprint",
    cta: "Apply Now",
    price: "$10,000",
    highlight: true,
  },
  {
    icon: Building2,
    name: "Scale Sprint",
    description: "Multiple agents working together. For teams who want to transform an entire department or process.",
    features: [
      "Up to 3 AI agents",
      "Unlimited integrations",
      "Cross-agent workflows",
      "Full-day team workshop",
      "90-day dedicated support",
      "Quarterly strategy sessions",
    ],
    href: "/sprint",
    cta: "Apply Now",
    price: "$15,000",
    highlight: false,
  },
];

export default function Products() {
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
    <section ref={sectionRef} id="how-it-works" className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <p className="section-label">AI Deployment Sprint Packages</p>
          <h2 className="section-heading text-gray-900 mb-4">
            Choose Your Sprint
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Every sprint delivers a working AI agent in 30 days. Pick the package that matches your team size and goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {sprintPackages.map((pkg, index) => (
            <div
              key={pkg.name}
              className={`animate-on-scroll bg-white rounded-2xl p-8 shadow-lg flex flex-col ${
                pkg.highlight
                  ? "border-2 border-accent ring-4 ring-accent/10 relative"
                  : "border border-gray-100"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {pkg.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold uppercase tracking-wide px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <pkg.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{pkg.price}</p>
                  <p className="text-xs text-gray-500">one-time</p>
                </div>
              </div>

              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {pkg.name}
              </h3>

              <p className="text-gray-600 mb-6">
                {pkg.description}
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={pkg.href}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  pkg.highlight
                    ? "bg-accent text-white hover:bg-amber-600"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {pkg.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          All packages include a discovery call to scope your project. No commitment until we agree on deliverables.
        </p>
      </div>
    </section>
  );
}
