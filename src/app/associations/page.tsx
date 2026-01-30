"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Users, 
  CheckCircle, 
  Building, 
  MessageSquare, 
  FileText,
  Calendar,
  TrendingUp,
  Heart,
  Globe
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const benefits = [
  {
    icon: TrendingUp,
    title: "Do More With Less",
    description: "AI helps small teams deliver big impact without adding headcount or burning out staff.",
  },
  {
    icon: MessageSquare,
    title: "Better Member Engagement",
    description: "Personalized communications, faster responses, and proactive outreach at scale.",
  },
  {
    icon: FileText,
    title: "Content at Scale",
    description: "Generate newsletters, reports, policy briefs, and social content without extra writers.",
  },
  {
    icon: Calendar,
    title: "Streamlined Operations",
    description: "Automate scheduling, event logistics, member management, and routine admin tasks.",
  },
];

const useCases = [
  {
    title: "Member Communications",
    description: "AI-assisted email campaigns, personalized newsletters, and automated member updates that maintain your voice.",
    example: "Draft personalized renewal reminders for 5,000 members in minutes, not days.",
  },
  {
    title: "Policy & Research",
    description: "Accelerate policy analysis, legislative tracking, and research synthesis without expanding your policy team.",
    example: "Summarize 50-page regulatory documents into executive briefs in seconds.",
  },
  {
    title: "Event & Conference Support",
    description: "Streamline registration, logistics coordination, speaker communications, and post-event follow-up.",
    example: "Generate personalized speaker invitations and attendee follow-ups at scale.",
  },
  {
    title: "Grant & Proposal Writing",
    description: "AI assistance for grant applications, RFP responses, and funding proposals while maintaining your unique voice.",
    example: "Draft first versions of grant narratives, then refine with your expertise.",
  },
  {
    title: "Knowledge Management",
    description: "Make institutional knowledge searchable and accessible to staff and members.",
    example: "Build an AI assistant that answers questions using your existing documents and FAQs.",
  },
  {
    title: "Board & Governance",
    description: "Streamline board communications, meeting prep, and governance documentation.",
    example: "Generate board meeting agendas, summaries, and action item tracking automatically.",
  },
];

const engagements = [
  {
    name: "AI Opportunity Assessment",
    price: "$5,000",
    duration: "2 weeks",
    description: "A focused evaluation of where AI can help your association or nonprofit most — tailored to your mission and budget.",
    deliverables: [
      "Staff workflow interviews",
      "AI opportunity mapping",
      "Prioritized recommendation list",
      "Implementation roadmap",
      "Budget-conscious tool recommendations",
    ],
    cta: "Get Started",
  },
  {
    name: "AI Quick Win Sprint",
    price: "$10,000 - $15,000",
    duration: "4-6 weeks",
    description: "Implement your first high-impact AI use case with training and support. Perfect for organizations ready to move.",
    deliverables: [
      "Everything in Assessment, plus:",
      "One AI workflow fully implemented",
      "Staff training (up to 10 people)",
      "Custom prompt library",
      "30-day support",
    ],
    cta: "Schedule Discussion",
    featured: true,
  },
  {
    name: "AI Strategy & Roadmap",
    price: "$25,000 - $50,000",
    duration: "8-12 weeks",
    description: "Comprehensive AI strategy for organizations ready for systematic transformation.",
    deliverables: [
      "Full organizational assessment",
      "Multi-use case implementation plan",
      "Governance and policy recommendations",
      "Board presentation",
      "Staff training program",
      "Ongoing advisory support",
    ],
    cta: "Discuss Requirements",
  },
];

const whyJMCB = [
  "Deep understanding of the association and nonprofit ecosystem",
  "Mission-first approach — technology should serve your purpose, not distract from it",
  "Budget-conscious — we work within nonprofit realities, not enterprise fantasies",
  "Practical, not theoretical — you'll have working AI tools, not just a strategy deck",
  "Training included — your team will be self-sufficient, not dependent on consultants",
];

export default function AssociationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-navy to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Users className="w-4 h-4" />
              Associations & Nonprofits
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
              AI That Multiplies{" "}
              <span className="text-accent">Your Mission Impact</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Your team is stretched thin. Your members expect more. AI can help you do more with less — 
              without losing the human touch that makes your organization special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://calendly.com/jermaine-jmcbtech/nonprofit-ai-consultation"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
              >
                Schedule Free Consultation
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

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              AI for Organizations That Put Mission First
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You shouldn&apos;t have to choose between serving your members and managing operations. AI handles the routine so you can focus on impact.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Practical Applications
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Where AI Helps Associations & Nonprofits
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-heading font-bold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{useCase.description}</p>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-700">
                    <strong>Example:</strong> {useCase.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why JMCB */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
                Why Work With Us
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                We Understand Your World
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Most AI consultants come from Big Tech or enterprise. We understand that associations and nonprofits 
                operate differently — tighter budgets, smaller teams, mission-driven cultures, and members who expect 
                the personal touch.
              </p>
              <ul className="space-y-4">
                {whyJMCB.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-heading font-bold text-gray-900">National Reach</p>
                  <p className="text-sm text-gray-600">Serving associations across the country</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Deep understanding of the nonprofit ecosystem</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Mission-first, technology-second approach</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Practical solutions for resource-constrained teams</span>
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
              Budget-Conscious Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;ve designed our engagements to deliver real value within nonprofit budget realities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {engagements.map((engagement) => (
              <div 
                key={engagement.name}
                className={`rounded-2xl p-8 ${
                  engagement.featured 
                    ? "bg-blue-600 text-white" 
                    : "bg-white border border-gray-200"
                }`}
              >
                {engagement.featured && (
                  <div className="inline-block px-3 py-1 bg-white text-blue-600 text-xs font-semibold rounded-full mb-4">
                    BEST VALUE
                  </div>
                )}
                <h3 className={`text-xl font-heading font-bold mb-2 ${engagement.featured ? "text-white" : "text-gray-900"}`}>
                  {engagement.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-2xl font-bold ${engagement.featured ? "text-white" : "text-gray-900"}`}>
                    {engagement.price}
                  </span>
                  <span className={`text-sm ml-2 ${engagement.featured ? "text-blue-100" : "text-gray-500"}`}>
                    / {engagement.duration}
                  </span>
                </div>
                <p className={`mb-6 ${engagement.featured ? "text-blue-100" : "text-gray-600"}`}>
                  {engagement.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {engagement.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${engagement.featured ? "text-blue-200" : "text-green-500"}`} />
                      <span className={`text-sm ${engagement.featured ? "text-blue-100" : "text-gray-600"}`}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="https://calendly.com/jermaine-jmcbtech/nonprofit-ai-consultation"
                  target="_blank"
                  className={`block w-full text-center px-6 py-3 font-semibold rounded-lg transition-all ${
                    engagement.featured
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {engagement.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Multiply Your Mission Impact?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule a free consultation to explore how AI can help your team do more of what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://calendly.com/jermaine-jmcbtech/nonprofit-ai-consultation"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
            >
              Schedule Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="mailto:jermaine@jmcbtech.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-all"
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
