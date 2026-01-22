"use client";

import { useEffect, useRef } from "react";
import { ClipboardCheck, Target, Wrench, Play, Rocket } from "lucide-react";

const stages = [
  {
    icon: ClipboardCheck,
    letter: "A",
    name: "Assess",
    outcome: "Know exactly where you stand",
    description: "Take our free assessment to see which AI opportunities fit your business and which are a waste of time.",
    timeframe: "Week 1",
  },
  {
    icon: Target,
    letter: "S",
    name: "Strategize",
    outcome: "Pick your highest-impact wins",
    description: "We help you identify 2-3 AI projects that will actually move the needle, with clear ROI estimates.",
    timeframe: "Week 2",
  },
  {
    icon: Wrench,
    letter: "C",
    name: "Capability",
    outcome: "Get your team ready",
    description: "Quick training for your team so they can work with AI tools confidently, not fearfully.",
    timeframe: "Weeks 3-4",
  },
  {
    icon: Play,
    letter: "E",
    name: "Execution",
    outcome: "Build and test with real work",
    description: "We build or configure your first AI solution and test it with actual business tasks before going live.",
    timeframe: "Weeks 5-6",
  },
  {
    icon: Rocket,
    letter: "D",
    name: "Deployment",
    outcome: "Go live and keep improving",
    description: "Launch your AI tools into daily operations with monitoring to make sure they keep delivering value.",
    timeframe: "Weeks 7-8",
  },
];

export default function AscendFramework() {
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
          <p className="section-label">The JMCB ASCEND™ Framework</p>
          <h2 className="section-heading text-gray-900 mb-4">
            From "Where Do We Start?" to Working AI in 8 Weeks
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Most AI projects fail because teams skip steps or overcomplicate things. JMCB ASCEND™ keeps you focused on what matters: getting AI tools that your team will actually use.
          </p>
        </div>

        {/* Framework Stages */}
        <div className="grid md:grid-cols-5 gap-4 lg:gap-6 mb-12">
          {stages.map((stage, index) => (
            <div
              key={stage.name}
              className="animate-on-scroll bg-cream rounded-xl p-6 text-center relative"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 lg:-right-4 w-6 lg:w-8 h-0.5 bg-accent/30" />
              )}

              <div className="text-xs font-semibold text-accent mb-3">
                {stage.timeframe}
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">{stage.letter}</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                {stage.name}
              </h3>
              <p className="text-sm text-primary font-medium mb-3">
                {stage.outcome}
              </p>
              <p className="text-sm text-gray-600">
                {stage.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm animate-on-scroll">
          Works for teams of any size. Whether you have 5 employees or 500, the framework scales to fit your pace and budget.
        </p>
      </div>
    </section>
  );
}
