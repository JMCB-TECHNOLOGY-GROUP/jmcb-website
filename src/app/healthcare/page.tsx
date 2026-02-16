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
  FileCheck,
  AlertTriangle,
  Stethoscope,
  Hospital
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

const healthcareProblems = [
  {
    stat: "250K+",
    context: "preventable deaths per year",
    detail: "Medical errors remain the third leading cause of death in the US. AI-assisted clinical workflows catch what humans miss.",
    source: "BMJ / Johns Hopkins Study",
  },
  {
    stat: "55%",
    context: "of physician time spent on EHR and documentation",
    detail: "Clinicians are burning out on data entry instead of patient care. AI can return hours back to the bedside.",
    source: "Annals of Internal Medicine",
  },
  {
    stat: "$4.6T",
    context: "US healthcare spending, 30% estimated waste",
    detail: "Administrative complexity, care fragmentation, and missed interventions drive avoidable costs across the system.",
    source: "CMS / JAMA",
  },
];

const outcomeAreas = [
  {
    icon: Heart,
    title: "Reduce Preventable Readmissions",
    problem: "30-day readmission rates cost hospitals $26B annually and signal gaps in discharge planning and post-acute care coordination.",
    approach: "AI risk stratification at discharge. Predictive models flag patients likely to return within 30 days based on clinical, social, and behavioral signals. Automated follow-up protocols close the loop before the return visit.",
    outcome: "Targeted intervention for highest-risk patients. Fewer penalties. Better transitions of care.",
    metric: "CMS readmission penalties eliminated",
  },
  {
    icon: Activity,
    title: "Close Care Gaps Before They Become Crises",
    problem: "Patients with chronic conditions fall through the cracks between visits. Missed screenings, lapsed medications, and overdue labs compound into costly acute episodes.",
    approach: "Population health analytics that surface care gaps in real time. AI identifies which patients need outreach now, not at their next scheduled visit. Proactive, not reactive.",
    outcome: "Earlier intervention. Fewer ER visits. Better HEDIS and Stars performance.",
    metric: "Care gap closure at population scale",
  },
  {
    icon: FileCheck,
    title: "Reclaim Clinician Time from Documentation",
    problem: "Physicians spend 2 hours on documentation for every 1 hour of patient care. This drives burnout, reduces throughput, and directly impacts patient experience.",
    approach: "Ambient clinical documentation and AI-assisted note generation that drafts SOAP notes, discharge summaries, and referral letters in real time. Physicians still review and sign off on everything.",
    outcome: "More face time with patients. Reduced clinician burnout. Higher patient satisfaction scores.",
    metric: "Hours returned to direct patient care",
  },
  {
    icon: Users,
    title: "Reach Patients Where the System Fails Them",
    problem: "Underserved communities face transportation barriers, health literacy gaps, and fragmented care networks. They need the system to come to them.",
    approach: "AI-powered patient engagement workflows that personalize outreach by language, channel preference, and health literacy level. Intelligent triage that routes patients to the right resource the first time.",
    outcome: "Reduced no-show rates. Higher engagement in chronic disease management. Healthier communities.",
    metric: "Equity-centered engagement at scale",
  },
  {
    icon: Brain,
    title: "Accelerate Clinical Decision Support",
    problem: "Clinicians face information overload. Critical signals hide in thousands of data points across labs, imaging, vitals, and patient history.",
    approach: "AI-assisted diagnostic support that surfaces relevant patterns, flags anomalies, and provides evidence-based recommendations. The clinician makes the call. The AI makes sure nothing gets missed.",
    outcome: "Faster, more informed clinical decisions. Reduced diagnostic variability. Better patient outcomes.",
    metric: "Decision support with explainable AI",
  },
  {
    icon: Shield,
    title: "Strengthen Compliance and Audit Readiness",
    problem: "HIPAA violations cost $1.5M+ per incident. Regulatory complexity is growing with AI-specific guidance from HHS, ONC, and state-level requirements.",
    approach: "Governance-first AI implementation with built-in audit trails, consent management, bias monitoring, and data lineage tracking. This gets designed in from the start, not added after something goes wrong.",
    outcome: "AI workflows that pass regulatory scrutiny. Reduced compliance risk. Board-level confidence.",
    metric: "Zero-finding audit readiness",
  },
];

const engagements = [
  {
    name: "Healthcare AI Assessment",
    price: "$15,000",
    duration: "3-4 weeks",
    description: "Evaluate where AI can improve outcomes across clinical, operational, and compliance dimensions specific to your organization.",
    deliverables: [
      "Clinical workflow AI opportunity mapping",
      "HIPAA and compliance gap analysis",
      "Outcome-focused use case prioritization",
      "Implementation roadmap with ROI projections",
      "Executive presentation with board-ready summary",
    ],
    cta: "Request Assessment",
  },
  {
    name: "AI Strategy & Roadmap",
    price: "$35,000 - $75,000",
    duration: "6-10 weeks",
    description: "A comprehensive AI strategy tied to quality metrics, clinical outcomes, and operational efficiency, not just technology adoption.",
    deliverables: [
      "AI governance framework for clinical environments",
      "Use case prioritization with clinical stakeholder input",
      "Vendor-agnostic tool evaluation and recommendations",
      "Workforce enablement and change management plan",
      "Multi-year implementation roadmap tied to outcome metrics",
      "Board-ready presentation and financial model",
    ],
    cta: "Schedule Discussion",
    featured: true,
  },
  {
    name: "Implementation Advisory",
    price: "Custom",
    duration: "3-12 months",
    description: "Hands-on support for AI pilot programs and production deployments in clinical and operational settings, with human oversight built in.",
    deliverables: [
      "Clinical workflow integration and validation",
      "Staff training, adoption support, and SOPs",
      "Compliance documentation and audit readiness",
      "Outcome measurement and continuous optimization",
      "Ongoing advisory partnership with quarterly reviews",
    ],
    cta: "Discuss Requirements",
  },
];

const guardrails = [
  "HIPAA compliance and PHI protection at every layer",
  "Clinical validation protocols before production deployment",
  "Algorithmic bias detection, monitoring, and mitigation",
  "Human-in-the-loop oversight for all clinical decisions",
  "FDA guidance alignment where applicable",
  "Full audit trails with explainable AI outputs",
  "Patient consent and transparency workflows",
  "Continuous outcome monitoring and model drift detection",
];

export default function HealthcarePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              AI That Improves{" "}
              <span className="text-accent">Patient Outcomes</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4 max-w-3xl">
              This isn't about adding AI to your tech stack. It's about using AI to measurably improve 
              how patients are cared for, with the governance, safety protocols, and human oversight 
              your organization actually needs.
            </p>
            <p className="text-sm text-gray-400 mb-8 max-w-2xl">
              Led by a Johns Hopkins AI Safety Fellow with a molecular genetics background and 15+ years 
              in healthcare technology. Co-founded VitalGuardian AI, winner of the Ward Infinity 
              Pitch Competition and Community Impact Award.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={CALENDLY_URL}
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

      {/* The Real Healthcare Problem */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              The Problem We Solve
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The problem isn't a lack of AI tools. It's a lack of better outcomes.
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every vendor is pitching AI right now. Meanwhile, clinicians are burning out, 
              patients are falling through cracks, and the system keeps spending more while delivering less.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {healthcareProblems.map((p) => (
              <div key={p.stat} className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">{p.stat}</div>
                <div className="text-lg font-semibold text-gray-900 mb-3">{p.context}</div>
                <p className="text-sm text-gray-600 mb-3">{p.detail}</p>
                <p className="text-xs text-gray-400">{p.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Story */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
                Why This Work Is Personal
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                I built healthcare AI because the system failed my family.
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                In 2024, I lost my father to complications from Type 2 Diabetes. I was his caregiver, and I 
                watched disconnected systems fail him over and over. Missed appointments. Medication confusion. 
                Gaps in care coordination that snowballed into crises nobody saw coming.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                That's what drove me to co-found VitalGuardian AI, a chronic disease management platform 
                that won the <strong className="text-gray-900">Johns Hopkins Ward Infinity Pitch Competition</strong> and 
                the <strong className="text-gray-900">Community Impact Award</strong>. That work continues through 
                Tendivo Health, focused on reaching patients where the healthcare system keeps failing them.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                I bring that same drive to every healthcare AI engagement. 
                <strong className="text-gray-900"> If the technology doesn't make patients healthier and clinicians' lives easier, it's not worth building.</strong>
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Johns Hopkins Ward Infinity Fellow (AI Safety)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Ward Infinity Pitch Competition Winner</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Community Impact Award Winner</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">M.S. Molecular Genetics, Howard University</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">15+ years federal health IT experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Nasdaq Entrepreneurial Center Milestone Circles</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Our Healthcare AI Approach</p>
                  <p className="text-sm text-gray-600">Outcomes first. Then we figure out the tech.</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Start with the clinical outcome", desc: "What patient result are we trying to improve?" },
                  { label: "Map the care pathway", desc: "Where do patients and clinicians lose time, information, or follow-through?" },
                  { label: "Design the intervention", desc: "What AI capability closes that specific gap?" },
                  { label: "Build the guardrails", desc: "How do we ensure safety, privacy, equity, and oversight?" },
                  { label: "Measure what matters", desc: "Outcomes, not outputs. Patient health, not model accuracy." },
                ].map((step, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcome-Focused AI */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Healthcare Outcomes We Target
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Every AI workflow starts with a patient outcome.
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We don't sell AI tools. We design interventions that measurably improve care quality, 
              operational efficiency, and patient experience, then build the AI to deliver them.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {outcomeAreas.map((area) => (
              <div key={area.title} className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <area.icon className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{area.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold text-gray-800">The problem:</span> {area.problem}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold text-gray-800">Our approach:</span> {area.approach}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold text-gray-800">The outcome:</span> {area.outcome}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <span className="text-xs font-semibold text-green-700">TARGET: {area.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guardrails */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12">
            <div className="flex items-start gap-6">
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Healthcare AI Without Guardrails Isn't Innovation. It's Reckless.
                </h2>
                <p className="text-gray-300 mb-6">
                  Every engagement includes governance, safety, and compliance built in from day one. 
                  Not as an afterthought. Not as an add-on. As the foundation.
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {guardrails.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
              Engagement Options
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Work Together
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every engagement follows the JMCB ASCEND methodology, adapted for healthcare's 
              unique regulatory, clinical, and safety requirements.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {engagements.map((engagement) => (
              <div 
                key={engagement.name}
                className={`rounded-2xl p-8 ${
                  engagement.featured 
                    ? "bg-gray-900 text-white" 
                    : "bg-white border border-gray-200"
                }`}
              >
                {engagement.featured && (
                  <div className="inline-block px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full mb-4">
                    RECOMMENDED
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${engagement.featured ? "text-white" : "text-gray-900"}`}>
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
                <p className={`mb-6 text-sm ${engagement.featured ? "text-gray-300" : "text-gray-600"}`}>
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
                  href={CALENDLY_URL}
                  target="_blank"
                  className={`block w-full text-center px-6 py-3 font-semibold rounded-lg transition-all text-sm ${
                    engagement.featured
                      ? "bg-accent text-white hover:bg-amber-600"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {engagement.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built For Healthcare Leaders Who Measure Success in Patient Outcomes
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Health systems implementing AI for quality improvement",
              "Payers focused on reducing avoidable utilization",
              "FQHCs and safety-net providers serving underserved populations",
              "Population health organizations closing care gaps at scale",
              "Healthcare IT teams navigating AI governance and compliance",
              "Clinical leaders who want AI that supports, not replaces, their judgment",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Let's Improve Patient Outcomes Together
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Schedule a consultation to explore where AI can measurably improve care quality, 
            operational efficiency, and patient experience in your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={CALENDLY_URL}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all"
            >
              Schedule Healthcare Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition-all"
            >
              Take Free AI Assessment
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
