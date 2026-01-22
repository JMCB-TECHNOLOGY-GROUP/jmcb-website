"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ClipboardList, BookOpen, Bot, ArrowRight } from "lucide-react";

const products = [
  {
    icon: ClipboardList,
    name: "AI Readiness Assessment",
    description: "Find out exactly where AI can help your business and where it would be a waste of money. Takes 3 minutes.",
    outcome: "Get a scored report showing your top AI opportunities ranked by ROI potential.",
    href: "/assessment",
    cta: "Take Free Assessment",
    price: "Free",
    highlight: true,
  },
  {
    icon: BookOpen,
    name: "AI Playbooks",
    description: "Step-by-step guides for using AI in sales, operations, marketing, and customer service. No tech background needed.",
    outcome: "Your team starts using AI tools effectively within a week.",
    href: "/solutions#products",
    cta: "Get Playbooks",
    price: "From $297",
    highlight: false,
  },
  {
    icon: Bot,
    name: "AI Agents",
    description: "Pre-built AI assistants that handle repetitive tasks: content drafts, email responses, data entry, report generation.",
    outcome: "Save 10+ hours per week on tasks that drain your team.",
    href: "/solutions#products",
    cta: "See Agents",
    price: "From $497/mo",
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <p className="section-label">Ready-to-Use AI Products</p>
          <h2 className="section-heading text-gray-900 mb-4">
            Start Using AI This Week
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            You do not need a custom build or a six-figure budget. These products are designed for small teams who want to move fast without breaking things.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.name}
              className={`animate-on-scroll bg-white rounded-2xl p-8 shadow-lg flex flex-col ${
                product.highlight
                  ? "border-2 border-accent ring-4 ring-accent/10"
                  : "border border-gray-100"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {product.highlight && (
                <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-4">
                  Most Popular
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <product.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{product.price}</p>
                </div>
              </div>

              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {product.name}
              </h3>

              <p className="text-gray-600 mb-4 flex-grow">
                {product.description}
              </p>

              <div className="bg-primary/5 rounded-lg p-4 mb-6">
                <p className="text-sm text-primary font-medium">
                  {product.outcome}
                </p>
              </div>

              <Link
                href={product.href}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  product.highlight
                    ? "bg-accent text-white hover:bg-amber-600"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {product.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
