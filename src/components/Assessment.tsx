"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Assessment() {
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
    <section ref={sectionRef} id="assessment" className="py-24 md:py-32 bg-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-on-scroll">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-8">
            <img
              src="/logo.png"
              alt="JMCB"
              className="w-12 h-12 object-contain"
            />
          </div>

          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Take the free 5-minute AI Readiness Assessment and get a
            personalized report on your organization&apos;s AI maturity.
          </p>

          <Link href="/assessment" className="btn-primary text-lg px-8 py-4">
            Start the Assessment
          </Link>

          <p className="mt-6 text-sm text-gray-500">
            No email required to see your score. Full report delivered to your
            inbox.
          </p>
        </div>
      </div>
    </section>
  );
}
