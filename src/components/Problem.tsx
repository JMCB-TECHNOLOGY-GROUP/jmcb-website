"use client";

import { useEffect, useRef } from "react";
import { CircleDashed, Shuffle, UserMinus } from "lucide-react";

const problems = [
  {
    icon: CircleDashed,
    title: "Pilot Purgatory",
    description:
      "AI experiments that never reach production. Proofs of concept pile up while competitors ship real solutions.",
  },
  {
    icon: Shuffle,
    title: "Vendor Confusion",
    description:
      "Every vendor promises transformation. None take accountability for business outcomes or long-term success.",
  },
  {
    icon: UserMinus,
    title: "Leadership Gap",
    description:
      "Internal teams are capable, but AI strategy requires specialized experience that most organizations lack.",
  },
];

export default function Problem() {
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
          <p className="section-label">THE CHALLENGE</p>
          <h2 className="section-heading text-gray-900">
            Why Most AI Initiatives Stall
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="card animate-on-scroll"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-light rounded-xl flex items-center justify-center mb-6">
                <problem.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {problem.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-lg md:text-xl text-gray-700 max-w-3xl mx-auto animate-on-scroll">
          Organizations don&apos;t need another vendor. They need a{" "}
          <span className="text-primary font-semibold">strategic partner</span>{" "}
          with the experience to move AI from concept to production.
        </p>
      </div>
    </section>
  );
}
