"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Book() {
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
    <section ref={sectionRef} id="products" className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Book Cover */}
          <div className="animate-on-scroll order-2 md:order-1">
            <div className="relative max-w-sm mx-auto">
              {/* Book mockup */}
              <div
                className="relative bg-gradient-to-br from-primary to-secondary rounded-lg p-8 shadow-2xl"
                style={{ transform: "perspective(1000px) rotateY(-5deg)" }}
              >
                <div className="absolute inset-0 bg-black/10 rounded-lg" />
                <div className="relative text-white">
                  <p className="text-sm font-medium tracking-wider mb-4 opacity-80">
                    JERMAINE BARKER
                  </p>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3">
                    Skills Close
                    <br />
                    the Deal
                  </h3>
                  <div className="w-16 h-1 bg-accent mb-4" />
                  <p className="text-sm opacity-80">
                    How to Bulletproof Your Career and Life
                  </p>
                </div>
                {/* Spine effect */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-primary/50 rounded-l-lg" />
              </div>

              {/* Shadow */}
              <div className="absolute -bottom-6 left-4 right-4 h-8 bg-black/20 blur-xl rounded-full" />
            </div>
          </div>

          {/* Content */}
          <div className="animate-on-scroll order-1 md:order-2" style={{ transitionDelay: "200ms" }}>
            <span className="inline-block px-4 py-1 bg-accent text-white text-sm font-semibold rounded-full mb-6">
              NEW BOOK
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
              Skills Close the Deal
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              How to Bulletproof Your Career and Life
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              This is the systematic framework I used to go from the overnight
              shift to Johns Hopkins Fellow. Not motivation. Method. I call it
              the Laboratory Method for career experimentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#" className="btn-primary">
                Get the Book
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors group"
              >
                Read the Free Chapter
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
