"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Heart, 
  CheckCircle, 
  Shield, 
  Users, 
  Activity,
  Brain,
  Clock,
  TrendingUp,
  FileCheck
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const outcomes = [
  {
    metric: "87%",
    label: "Medication Adherence Improvement",
    context: "VitalGuardian AI pilot results",
  },
  {
    metric: "40%",
    label: "Reduction in Care Gaps",
    context: "Chronic disease management",
  },
  {
    metric: "15+",
    label: "Years Healthcare Technology",
    context: "Federal health IT experience",
  },
];

const useCases = [
  {
    icon: Activity,
    title: "Clinical Decision Support",
    description: "AI-assisted diagnostic tools, treatment recommendations, and care pathway optimization with appropriate physician oversight.",
  },
  {
    icon: Users,
    title: "Patient Engagement",
    description: "Intelligent chatbots, personalized health coaching, and automated outreach that improves adherence and outcomes.",
  },
  {
    icon: FileCheck,
    title: "Administrative Automation",
    description: "Prior authorization, claims processing, documentation, and scheduling workflows that reduce burden on staff.",
  },
  {
    icon: Brain,
    title: "Population Health",
    description: "Risk stratification, care gap identification, and predictive analytics for proactive intervention.",
  },
];

const engagements = [
  {
    name: "Healthcare AI Assessment",
    price: "$15,000",
    duration: "3-4 weeks",
    description: "Evaluate AI readiness across clinical, operational, and compliance dimensions specific to healthcare.",
    deliverables: [
      "Clinical workflow AI opportunity mapping",
      "HIPAA and compliance gap analysis",
      "Vendor landscape and recommendations",
      "Implementation roadmap with ROI projections",
      "Executive presentation",
    ],
    cta: "Request Assessment",
  },
  {
    name: "AI Strategy & Roadmap",
    price: "$35,000 - $75,000",
    duration: "6-10 weeks",
    description: "Comprehensive AI strategy aligned with organizational goals, regulatory requirements, and clinical workflows.",
    deliverables: [
      "AI vision and governance framework",
      "Use case prioritization with clinical input",
      "Vendor selection support",
      "Change management and training plan",
      "Multi-year implementation roadmap",
      "Board-ready presentation",
    ],
    cta: "Schedule Discussion",
    featured: true,
  },
  {
    name: "Implementation Advisory",
    price: "Custom",
    duration: "3-12 months",
    description: "Hands-on support for AI pilot programs and production deployments in clinical and operational settings.",
    deliverables: [
      "Clinical workflow integration",
      "Staff training and adoption support",
      "Compliance and audit readiness",
      "Performance monitoring and optimization",
      "Ongoing advisory partnership",
    ],
    cta: "Discuss Requirements",
  },
];

const idealFor = [
  "Health systems exploring AI for clinical or operational use",
  "Payers implementing AI for claims, engagement, or analytics",
  "Healthcare IT vendors building AI capabilities",
  "Population health organizations optimizing care management",
  "Digital health companies seeking strategic guidance",
];

export default function HealthcarePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-navy to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Heart className="w-4 h-4" />
              Healthcare AI
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
              AI That Improves{" "}
              <span className="text-accent">Patient Outcomes</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Responsible AI implementation for health systems, payers, and healthcare organizations — 
              with the clinical understanding and compliance rigor your patients deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://calendly.com/jermaine-jmcbtech/healthcare-ai-consultation"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
              >
                Schedule Healthcare Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Take AI Readiness Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Bar */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {outcomes.map((outcome) => (
              <div key={outcome.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-navy mb-2">
                  {outcome.metric}
                </div>
                <div className="font-semibold text-gray-900 mb-1">{outcome.label}</div>
                <div className="text-sm text-gray-500">{outcome.context}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Story / Why */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
                Why Healthcare AI Matters to Me
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                This Work Is Personal
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                In 2024, I lost my father to complications from Type 2 Diabetes. As his caregiver, I saw firsthand 
                how disconnected healthcare systems fail patients — missed appointments, medication confusion, 
                gaps in care coordination.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                That experience drove me to build VitalGuardian AI (now Tendivo Health), a chronic disease 
                management platform that achieved 87% medication adherence improvements in early pilots.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                I bring that same mission-driven approach to every healthcare AI engagement: 
                <strong className="text-gray-900"> technology should serve patients and the clinicians who care for them.</strong>
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Founded Tendivo Health (chronic disease management AI)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">M.S. Molecular Genetics, Howard University</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Johns Hopkins AI Safety Fellow</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">15+ years federal health IT experience</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-heading font-bold text-gray-900 text-lg">Tendivo Health</p>
                  <p className="text-sm text-gray-600">Chronic Disease Management Platform</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Medication Adherence</span>
                    <span className="text-sm font-bold text-green-600">87%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "87%" }} />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Care Gap Closure</span>
                    <span className="text-sm font-bold text-green-600">40%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "40%" }} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Results from VitalGuardian AI pilot program
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Healthcare AI Applications
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Where AI Creates Value in Healthcare
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <useCase.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-sm text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Focus */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-2xl p-8 md:p-12">
            <div className="flex items-start gap-6">
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                  Healthcare AI Requires Special Care
                </h2>
                <p className="text-gray-300 mb-6">
                  AI in healthcare isn&apos;t just about efficiency — it&apos;s about patient safety, privacy, and trust. 
                  Every engagement includes rigorous attention to:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>HIPAA compliance and PHI protection</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Clinical validation and safety protocols</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Bias detection and mitigation</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Human oversight and accountability</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>FDA guidance alignment (where applicable)</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>Audit trails and explainability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Engagement Options
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              How We Work Together
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {engagements.map((engagement) => (
              <div 
                key={engagement.name}
                className={`rounded-2xl p-8 ${
                  engagement.featured 
                    ? "bg-navy text-white" 
                    : "bg-white border border-gray-200"
                }`}
              >
                {engagement.featured && (
                  <div className="inline-block px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full mb-4">
                    RECOMMENDED
                  </div>
                )}
                <h3 className={`text-xl font-heading font-bold mb-2 ${engagement.featured ? "text-white" : "text-gray-900"}`}>
                  {engagement.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-2xl font-bold ${engagement.featured ? "text-white" : "text-gray-900"}`}>
                    {engagement.price}
                  </span>
                  <span className={`text-sm ml-2 ${engagement.featured ? "text-gray-300" : "text-gray-500"}`}>
                    / {engagement.duration}
                  </span>
                </div>
                <p className={`mb-6 ${engagement.featured ? "text-gray-300" : "text-gray-600"}`}>
                  {engagement.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {engagement.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${engagement.featured ? "text-accent" : "text-green-500"}`} />
                      <span className={`text-sm ${engagement.featured ? "text-gray-300" : "text-gray-600"}`}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="https://calendly.com/jermaine-jmcbtech/healthcare-ai-consultation"
                  target="_blank"
                  className={`block w-full text-center px-6 py-3 font-semibold rounded-lg transition-all ${
                    engagement.featured
                      ? "bg-accent text-white hover:bg-amber-600"
                      : "bg-navy text-white hover:bg-gray-800"
                  }`}
                >
                  {engagement.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal For */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Ideal For
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {idealFor.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Let&apos;s Improve Patient Outcomes Together
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Schedule a consultation to explore how AI can serve your patients, clinicians, and organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://calendly.com/jermaine-jmcbtech/healthcare-ai-consultation"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all"
            >
              Schedule Healthcare Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
