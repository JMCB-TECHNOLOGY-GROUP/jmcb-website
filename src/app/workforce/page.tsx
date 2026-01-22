"use client";

import Link from "next/link";
import CareerLabHeader from "@/components/CareerLabHeader";
import CareerLabFooter from "@/components/CareerLabFooter";
import {
  Users,
  Target,
  TrendingUp,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Building2,
  GraduationCap,
  Compass,
  Zap,
} from "lucide-react";

const benefits = [
  {
    icon: BarChart3,
    title: "Baseline Assessment",
    description:
      "Understand where your team stands in career readiness, skill development, and adaptability before AI transformation.",
  },
  {
    icon: Target,
    title: "Identify Skill Gaps",
    description:
      "Pinpoint areas where employees need development to thrive alongside AI tools and automation.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "Measure improvement over time as your workforce develops new capabilities and mindsets.",
  },
  {
    icon: Users,
    title: "Team Insights",
    description:
      "Aggregate data reveals organizational patterns, helping you prioritize L&D investments.",
  },
];

const useCases = [
  {
    icon: Zap,
    title: "Pre-AI Implementation",
    description:
      "Assess workforce readiness before rolling out AI tools. Identify champions and those who need more support.",
  },
  {
    icon: GraduationCap,
    title: "Learning & Development",
    description:
      "Integrate with your L&D programs to measure career development effectiveness and ROI.",
  },
  {
    icon: Building2,
    title: "Change Management",
    description:
      "During organizational transformation, understand employee adaptability and concerns.",
  },
  {
    icon: Compass,
    title: "Career Pathing",
    description:
      "Help employees see clear paths for growth, increasing retention and engagement.",
  },
];

const outcomes = [
  "Reduced resistance to AI adoption",
  "Higher employee engagement scores",
  "Better L&D investment targeting",
  "Improved retention during transformation",
  "Data-driven workforce planning",
  "Faster time-to-productivity with new tools",
];

export default function WorkforcePage() {
  return (
    <main className="min-h-screen bg-white">
      <CareerLabHeader />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy via-navy to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-secondary/20 border border-secondary/30 rounded-full text-sm font-semibold text-secondary mb-6">
              Workforce Development
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
              Prepare Your Workforce for the AI Era
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              AI will transform every role. Assess your team&apos;s readiness, identify skill gaps,
              and build a workforce that thrives alongside intelligent systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Schedule a Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/career-assessment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Try the Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              The Challenge: AI Changes Everything
            </h2>
            <p className="text-lg text-gray-600">
              67% of employees are anxious about AI replacing their jobs. Yet organizations
              are racing to implement AI without understanding their workforce&apos;s readiness.
              The result? Resistance, poor adoption, and failed transformations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="text-4xl font-bold text-red-500 mb-2">67%</div>
              <p className="text-gray-600">
                of employees are anxious about AI&apos;s impact on their careers
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="text-4xl font-bold text-amber-500 mb-2">70%</div>
              <p className="text-gray-600">
                of digital transformations fail due to people, not technology
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="text-4xl font-bold text-green-500 mb-2">3x</div>
              <p className="text-gray-600">
                higher adoption when employees feel prepared and supported
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-secondary/10 rounded-full text-sm font-semibold text-secondary mb-4">
              The Solution
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Workforce Readiness Assessment
            </h2>
            <p className="text-lg text-gray-600">
              A diagnostic tool that measures your team&apos;s career clarity, adaptability,
              and readiness for change—giving you the insights to support them effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              How Organizations Use It
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="bg-white rounded-xl p-8 border border-gray-200 flex gap-6"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <useCase.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-green-100 rounded-full text-sm font-semibold text-green-700 mb-4">
                Outcomes
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                What You Can Expect
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Organizations that invest in workforce readiness before AI implementation
                see dramatically better outcomes.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Ready to Assess Your Workforce?
              </h3>
              <p className="text-gray-600 mb-6">
                Schedule a demo to see how the Workforce Readiness Assessment can support
                your AI transformation and employee development initiatives.
              </p>
              <Link
                href="https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-primary transition-all"
              >
                Schedule a Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Or{" "}
                <Link href="/career-assessment" className="text-secondary hover:underline">
                  try the individual assessment
                </Link>{" "}
                yourself first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Deploy", desc: "Send assessment link to your team via email or LMS" },
              { step: "2", title: "Assess", desc: "Employees complete the 8-question assessment (2 min)" },
              { step: "3", title: "Analyze", desc: "Review individual and aggregate results in dashboard" },
              { step: "4", title: "Act", desc: "Target L&D investments and support where needed" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
            Start Preparing Your Workforce Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Don&apos;t let your AI transformation fail because of people. Understand your
            workforce&apos;s readiness and give them the support they need to thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Talk to Us About Enterprise
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/career-assessment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              Try Individual Assessment
            </Link>
          </div>
        </div>
      </section>

      <CareerLabFooter />
    </main>
  );
}
