"use client";

import { useEffect, useRef } from "react";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const credentials = [
  "Johns Hopkins Ward Infinity Fellow",
  "M.S. Molecular Genetics, Howard University",
  "PMP Certified",
  "15+ Years Enterprise Technology",
];

export default function About() {
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
    <section ref={sectionRef} id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <div className="lg:col-span-3 animate-on-scroll">
            <p className="section-label">LEADERSHIP</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
              Jermaine Barker
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Founder & Principal Consultant
            </p>

            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                JMCB Technology Group was founded on a simple premise:{" "}
                <span className="text-primary font-semibold">
                  enterprise AI needs experienced operators, not just advisors.
                </span>
              </p>

              <p>
                Our founder, Jermaine Barker, has spent 15+ years in the trenches
                of enterprise technology. He has led initiatives at Accenture,
                served as Director of Technology at BRMi, and currently works
                as Associate Director at Guidehouse. His teams have shipped
                systems for USPS, federal agencies, and major healthcare
                organizations.
              </p>

              <p>
                In 2025, Jermaine was selected as a Johns Hopkins Ward Infinity
                Fellow, focused on bringing proactive healthcare to an industry
                that has long favored reactive approaches. Through this work,
                he&apos;s building connected, data-led solutions that provide better
                access and care to providers and their patients.
              </p>

              <p>
                We started this firm because too many organizations are stuck in
                AI pilot purgatory. They have great ideas and capable teams,
                but lack the specialized experience to move from proof of concept
                to production. We bridge that gap.
              </p>
            </div>

            {/* Credentials */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {credentials.map((credential) => (
                  <span
                    key={credential}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    {credential}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Photo */}
          <div className="lg:col-span-2 animate-on-scroll" style={{ transitionDelay: "200ms" }}>
            <div className="sticky top-32">
              {/* Headshot */}
              <div className="relative">
                <div className="w-full max-w-sm mx-auto">
                  <Image
                    src="/jermaine-barker.jpg"
                    alt="Jermaine Barker"
                    width={400}
                    height={400}
                    className="w-full rounded-2xl shadow-2xl object-cover"
                    priority
                  />
                </div>

                {/* Decorative element */}
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-accent/20 rounded-2xl -z-10" />
              </div>

              {/* LinkedIn Link */}
              <Link
                href="https://linkedin.com/in/jermainebarker"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span className="font-medium">Connect on LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
