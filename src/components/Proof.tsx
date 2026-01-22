"use client";

import { useEffect, useRef } from "react";

const metrics = [
  {
    value: "15+",
    label: "Years of enterprise technology leadership across federal and private sectors",
  },
  {
    value: "JHU",
    label: "Johns Hopkins Ward Infinity Fellow building proactive healthcare solutions",
  },
  {
    value: "M.S.",
    label: "Molecular Genetics background bringing scientific rigor to AI strategy",
  },
  {
    value: "PMP",
    label: "Certified project management with hands-on delivery experience",
  },
];

export default function Proof() {
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
    <section ref={sectionRef} id="results" className="py-24 md:py-32 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <p className="section-label">CREDENTIALS</p>
          <h2 className="section-heading text-white">Experience You Can Trust</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {metrics.map((metric, index) => (
            <div
              key={metric.value}
              className="text-center animate-on-scroll"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl md:text-5xl font-heading font-bold text-accent mb-3">
                {metric.value}
              </div>
              <p className="text-gray-400 leading-relaxed">{metric.label}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 animate-on-scroll">
          Background includes work with DOJ, USPS, Accenture, and Guidehouse.
        </p>
      </div>
    </section>
  );
}
