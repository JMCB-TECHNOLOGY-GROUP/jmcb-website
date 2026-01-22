"use client";

import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";

// TODO: Replace with real testimonials
const testimonials = [
  {
    quote: "Jermaine helped us cut through the AI hype and focus on what would actually move the needle. Within 90 days we had our first AI system in production.",
    name: "Operations Director",
    company: "Healthcare Technology Firm",
    result: "First AI system live in 90 days",
  },
  {
    quote: "We'd been stuck in pilot purgatory for over a year. The AI Readiness Scan gave us clarity on what was blocking us and a clear path forward.",
    name: "VP of Technology",
    company: "Federal Contractor",
    result: "Broke through 14-month stall",
  },
  {
    quote: "No fluff, no jargon. Just honest advice about where AI made sense for our business and where it didn't. Saved us from a costly mistake.",
    name: "CEO",
    company: "Mid-size Professional Services",
    result: "Avoided $80K wrong investment",
  },
];

export default function Testimonials() {
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <p className="section-label">CLIENT RESULTS</p>
          <h2 className="section-heading text-gray-900">
            What Clients Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="animate-on-scroll bg-cream rounded-2xl p-8 relative"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Quote className="w-10 h-10 text-accent/20 absolute top-6 right-6" />

              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                "{testimonial.quote}"
              </p>

              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.company}</p>
                <p className="text-sm font-medium text-accent mt-2">
                  {testimonial.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
