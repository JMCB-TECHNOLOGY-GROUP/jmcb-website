"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, Target, TrendingUp, ClipboardList } from "lucide-react";

const coachingServices = [
  {
    icon: MessageCircle,
    title: "Career Strategy Session",
    description: "A free 30-minute call to review where you are, identify your best next move, and map out a 90-day experiment.",
    price: "Free",
    cta: "Book Your Free Session",
    href: "https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review",
  },
  {
    icon: Target,
    title: "Strategy Intensive",
    description: "A deep-dive session to clarify your goals, audit your positioning, and build a concrete action plan for the next quarter.",
    price: "$297",
    cta: "Book Intensive",
    href: "https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review",
  },
  {
    icon: TrendingUp,
    title: "Ongoing Coaching",
    description: "Monthly 1:1 sessions to work through challenges, build skills, and maintain momentum toward your career goals.",
    price: "$497/mo",
    cta: "Learn More",
    href: "https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review",
  },
];

export default function CareerCoaching() {
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
    <section ref={sectionRef} id="career" className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-secondary rounded-full" />
            <span className="text-sm font-semibold tracking-wide text-secondary">
              FOR INDIVIDUAL PROFESSIONALS
            </span>
          </div>
          <h2 className="section-heading text-gray-900 mb-4">
            Build a Career That Compounds
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            The same systematic thinking we apply to enterprise AI strategy, now available for your professional growth.
          </p>
        </div>

        {/* Coaching Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {coachingServices.map((service, index) => (
            <div
              key={service.title}
              className="animate-on-scroll bg-white rounded-2xl p-8 shadow-lg border-2 border-transparent hover:border-secondary/20 transition-all"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-secondary" />
              </div>

              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-xl font-heading font-bold text-gray-900">
                  {service.title}
                </h3>
                <span className="text-sm font-bold text-secondary bg-secondary/10 px-2 py-1 rounded whitespace-nowrap">
                  {service.price}
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {service.description}
              </p>

              <Link
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {service.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Career Assessment CTA */}
        <div className="mt-12 animate-on-scroll" style={{ transitionDelay: "300ms" }}>
          <div className="bg-secondary/5 border-2 border-secondary/20 rounded-2xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <ClipboardList className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                  Not Sure What You Need?
                </h3>
                <p className="text-gray-600">
                  Take the free 2-minute Career Readiness Assessment. Get a personalized recommendation based on where you are in your journey.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/career-assessment"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Take the Assessment
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
