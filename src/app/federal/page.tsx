"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Shield, 
  CheckCircle, 
  Building2, 
  FileCheck, 
  Users, 
  Lock,
  Award,
  Clock,
  Target
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const credibilityPoints = [
  {
    metric: "15+",
    label: "Years Federal Technology Experience",
  },
  {
    metric: "$2B",
    label: "Program Leadership (USPS)",
  },
  {
    metric: "DOJ",
    label: "U.S. Department of Justice",
  },
  {
    metric: "Active",
    label: "Security Clearance Eligible",
  },
];

const capabilities = [
  {
    icon: Shield,
    title: "AI Governance & Compliance",
    description: "FedRAMP-aligned AI governance frameworks, risk assessments, and compliance documentation that satisfy OMB, NIST, and agency-specific requirements.",
  },
  {
    icon: FileCheck,
    title: "AI Strategy & Roadmaps",
    description: "Executive-level AI strategies that align with agency missions, budget cycles, and federal AI executive orders.",
  },
  {
    icon: Users,
    title: "Workforce AI Enablement",
    description: "Training and change management programs that prepare federal employees to work effectively alongside AI systems.",
  },
  {
    icon: Lock,
    title: "Responsible AI Implementation",
    description: "Human-in-the-loop AI deployments with proper oversight, audit trails, and bias mitigation protocols.",
  },
];

const engagementTypes = [
  {
    name: "AI Readiness Assessment",
    price: "$25,000",
    duration: "4-6 weeks",
    description: "Comprehensive evaluation of your agency or program's AI readiness across governance, data, workforce, and technical dimensions.",
    deliverables: [
      "Executive briefing and findings presentation",
      "Detailed assessment report with gap analysis",
      "Prioritized AI opportunity roadmap",
      "Risk register and mitigation recommendations",
      "Budget-ready implementation plan",
    ],
    cta: "Request Assessment",
  },
  {
    name: "AI Strategy Development",
    price: "$50,000 - $100,000",
    duration: "8-12 weeks",
    description: "End-to-end AI strategy aligned with agency mission, federal mandates, and budget realities.",
    deliverables: [
      "AI vision and strategic objectives",
      "Use case prioritization framework",
      "Governance and oversight structure",
      "Workforce development plan",
      "Multi-year implementation roadmap",
      "Stakeholder alignment workshops",
    ],
    cta: "Schedule Discussion",
    featured: true,
  },
  {
    name: "AI Implementation Support",
    price: "Custom",
    duration: "3-12 months",
    description: "Hands-on advisory support for AI pilot programs and production deployments.",
    deliverables: [
      "Vendor evaluation and selection support",
      "Implementation oversight and QA",
      "Change management execution",
      "Training program delivery",
      "Ongoing advisory and optimization",
    ],
    cta: "Discuss Requirements",
  },
];

const idealFor = [
  "Federal agencies exploring or expanding AI adoption",
  "Government contractors building AI capabilities",
  "Program offices with AI modernization mandates",
  "CIOs and CTOs preparing AI governance frameworks",
  "Acquisition teams evaluating AI solutions",
];

export default function FederalPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-navy to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              Federal & Government
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
              AI Strategy for{" "}
              <span className="text-accent">Federal Missions</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Practical AI enablement built on 15+ years of federal technology leadership. 
              From strategy through implementation — with the compliance rigor your agency requires.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://calendly.com/jermaine-jmcbtech/federal-ai-consultation"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
              >
                Schedule Federal Consultation
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

      {/* Credibility Bar */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {credibilityPoints.map((point) => (
              <div key={point.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-navy mb-2">
                  {point.metric}
                </div>
                <div className="text-sm text-gray-600">{point.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why JMCB */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
                Federal Expertise
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                AI Advisory Built on Federal Experience
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Most AI consultants understand technology. Few understand how federal agencies actually operate — 
                the budget cycles, the acquisition processes, the stakeholder dynamics, the compliance requirements.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                With over 15 years at the U.S. Department of Justice and leadership of a $2 billion USPS technology 
                program, I bring the operational credibility and institutional knowledge that federal AI initiatives require.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">Former DOJ Technology Leader</span>
                    <p className="text-sm text-gray-600">Deep understanding of federal IT governance and compliance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">$2B Program Leadership</span>
                    <p className="text-sm text-gray-600">Proven ability to deliver at enterprise scale</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">Current Guidehouse Associate Director</span>
                    <p className="text-sm text-gray-600">Active in federal consulting ecosystem</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">Johns Hopkins AI Safety Fellow</span>
                    <p className="text-sm text-gray-600">Academic grounding in responsible AI practices</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-heading font-bold text-gray-900">Jermaine Barker</p>
                  <p className="text-sm text-gray-600">Founder & Principal Consultant</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span>Associate Director, Guidehouse</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span>15+ Years U.S. Department of Justice</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Target className="w-5 h-5 text-gray-400" />
                  <span>$2B USPS Technology Program Lead</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Award className="w-5 h-5 text-gray-400" />
                  <span>Johns Hopkins Ward Infinity Fellow (AI Safety)</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FileCheck className="w-5 h-5 text-gray-400" />
                  <span>M.S. Molecular Genetics, Howard University</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Federal AI Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end AI advisory designed for federal requirements
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((cap) => (
              <div key={cap.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mb-4">
                  <cap.icon className="w-6 h-6 text-navy" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2">{cap.title}</h3>
                <p className="text-sm text-gray-600">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Types */}
      <section className="py-20 bg-white">
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
            {engagementTypes.map((engagement) => (
              <div 
                key={engagement.name}
                className={`rounded-2xl p-8 ${
                  engagement.featured 
                    ? "bg-navy text-white border-2 border-navy" 
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                {engagement.featured && (
                  <div className="inline-block px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full mb-4">
                    MOST COMMON
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
                  href="https://calendly.com/jermaine-jmcbtech/federal-ai-consultation"
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Ideal For
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {idealFor.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Discuss Your Agency&apos;s AI Strategy?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Schedule a confidential consultation to explore how AI can support your mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://calendly.com/jermaine-jmcbtech/federal-ai-consultation"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
            >
              Schedule Federal Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="mailto:jermaine@jmcbtech.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              jermaine@jmcbtech.com
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
