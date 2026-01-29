"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Lightbulb, ClipboardCheck, Route, Zap, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Lightbulb,
    title: "The $1K Question",
    description:
      "Before you spend $50K on AI, spend $997 to find out if you should. Get your #1 AI opportunity identified in 48-72 hours.",
    price: "$997",
    popular: true,
    href: "/services#the-1k-question",
  },
  {
    icon: ClipboardCheck,
    title: "AI Readiness Scan",
    description:
      "Know where you stand in one week. A fast, honest assessment of your AI readiness with clear next steps.",
    price: "Let's Talk",
    href: "/services#ai-readiness-scan",
  },
  {
    icon: Route,
    title: "Responsible AI Roadmap",
    description:
      "Strategy + governance in one package. An executable plan your team can actually run with.",
    price: "Let's Talk",
    href: "/services#responsible-ai-roadmap",
  },
  {
    icon: Zap,
    title: "AI Pilot Sprint",
    description:
      "From idea to working AI in 8 weeks. We don't just advise. We build. A working solution, not a throwaway POC.",
    price: "Let's Talk",
    href: "/services#ai-pilot-sprint",
  },
];

export default function Solution() {
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
    <section ref={sectionRef} id="services" className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <p className="section-label">OUR SERVICES</p>
          <h2 className="section-heading text-gray-900 mb-4">
            Responsible AI That Ships
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Most governance consultants give you frameworks and leave. Most AI builders move fast and break things. We do both.
          </p>
          <p className="text-sm text-accent font-medium">
            Transparent pricing. No surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {services.map((service, index) => (
            <Link
              href={service.href}
              key={service.title}
              className={`card animate-on-scroll group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative ${
                service.popular ? "ring-2 ring-accent" : ""
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {service.popular && (
                <span className="absolute -top-3 left-6 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="flex items-start gap-5">
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                  service.popular ? "bg-accent/10" : "bg-primary/10"
                }`}>
                  <service.icon className={`w-7 h-7 ${service.popular ? "text-accent" : "text-primary"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center animate-on-scroll flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/services"
            className="btn-primary"
          >
            View All Services & Pricing
          </Link>
          <Link
            href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Book a Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
