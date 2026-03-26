"use client";

import Link from "next/link";
import { ArrowRight, Heart, Shield, Users, CheckCircle2, Activity, Stethoscope, AlertTriangle, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

export default function HealthcarePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80&auto=format" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-6">Healthcare AI</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-6">
            AI that improves
            <br />
            <span className="text-accent italic">patient outcomes.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mb-10">
            This isn't about adding AI to your tech stack. It's about using AI to measurably improve how patients are cared for, with governance, safety, and human oversight at every step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-base">
              Schedule Healthcare Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/assessment" className="btn-outline-white text-base">
              Take AI Readiness Assessment
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="py-10 px-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {[
              { stat: "250K+", label: "Preventable deaths per year from medical errors", source: "BMJ / Johns Hopkins" },
              { stat: "55%", label: "Of physician time spent on EHR documentation", source: "Annals of Internal Medicine" },
              { stat: "$4.6T", label: "US healthcare spending, 30% estimated waste", source: "CMS / JAMA" },
            ].map((item) => (
              <div key={item.stat} className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-red-600">{item.stat}</div>
                <p className="text-xs text-gray-600 mt-1">{item.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Story */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-3">
              <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Why This Work Is Personal</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                I built healthcare AI because the system <span className="italic text-accent">failed my family.</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  In 2024, I lost my father to complications from Type 2 Diabetes. I was his caregiver, and I watched disconnected systems fail him over and over. Missed appointments. Medication confusion. Gaps in care coordination that snowballed into crises nobody saw coming.
                </p>
                <p>
                  That's what drove me to co-found VitalGuardian AI, a chronic disease management platform that won the Johns Hopkins Ward Infinity Pitch Competition and the Community Impact Award. That work continues through Tendivo Health, focused on reaching patients where the healthcare system keeps failing them.
                </p>
                <p className="font-semibold text-gray-800">
                  I bring that same drive to every healthcare AI engagement. If the technology doesn't make patients healthier and clinicians' lives easier, it's not worth building.
                </p>
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              {[
                "Johns Hopkins Ward Infinity Fellow (AI Safety)",
                "Ward Infinity Pitch Competition Winner",
                "Community Impact Award Winner",
                "M.S. Molecular Genetics, Howard University",
                "15+ years enterprise health IT experience",
              ].map((cred) => (
                <div key={cred} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{cred}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes We Target */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Clinical Impact</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Every AI workflow starts with a <span className="italic text-accent">patient outcome.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We don't sell AI tools. We design interventions that measurably improve care quality, operational efficiency, and patient experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: AlertTriangle,
                title: "Reduce Preventable Readmissions",
                desc: "AI risk stratification at discharge. Predictive models flag patients likely to return within 30 days. Automated follow-up protocols close the loop before the return visit.",
                target: "CMS readmission penalties eliminated",
              },
              {
                icon: Activity,
                title: "Close Care Gaps Before Crises",
                desc: "Population health analytics that surface care gaps in real time. AI identifies which patients need outreach now, not at their next scheduled visit.",
                target: "Care gap closure at population scale",
              },
              {
                icon: Clock,
                title: "Reclaim Clinician Time",
                desc: "Ambient clinical documentation and AI-assisted note generation. Physicians review and sign off. The AI handles the paperwork so clinicians can handle patients.",
                target: "Hours returned to direct patient care",
              },
              {
                icon: Users,
                title: "Reach Underserved Patients",
                desc: "AI-powered engagement workflows personalized by language, channel, and health literacy. Intelligent triage that routes patients to the right resource the first time.",
                target: "Equity-centered engagement at scale",
              },
              {
                icon: Stethoscope,
                title: "Accelerate Clinical Decisions",
                desc: "AI-assisted diagnostic support that surfaces relevant patterns and flags anomalies. The clinician makes the call. The AI makes sure nothing gets missed.",
                target: "Decision support with explainable AI",
              },
              {
                icon: Shield,
                title: "Strengthen Compliance",
                desc: "Governance-first AI with built-in audit trails, consent management, bias monitoring, and data lineage tracking. Designed in from the start, not added after something goes wrong.",
                target: "Zero-finding audit readiness",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-6 card-hover">
                <item.icon className="w-6 h-6 text-accent mb-4" />
                <h3 className="font-display font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{item.desc}</p>
                <div className="text-xs font-semibold text-accent uppercase tracking-wide">Target: {item.target}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guardrails */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1920&q=80&auto=format" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900/92" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
            Healthcare AI without guardrails <span className="italic text-accent">isn't innovation.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every engagement includes governance, safety, and compliance built in from day one. Not as an afterthought. As the foundation.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-left max-w-3xl mx-auto">
            {[
              "HIPAA compliance and PHI protection at every layer",
              "Clinical validation protocols before production",
              "Algorithmic bias detection and mitigation",
              "Human-in-the-loop oversight for all clinical decisions",
              "Full audit trails with explainable AI outputs",
              "Continuous outcome monitoring and model drift detection",
            ].map((g) => (
              <div key={g} className="flex items-start gap-2.5 p-3">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Engagement Options</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Built for healthcare's <span className="italic text-accent">unique requirements.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Healthcare AI Assessment", price: "$15,000", duration: "3-4 weeks", desc: "Evaluate where AI can improve outcomes across clinical, operational, and compliance dimensions.", popular: false },
              { name: "AI Strategy & Roadmap", price: "$35,000 - $75,000", duration: "6-10 weeks", desc: "Comprehensive AI strategy tied to quality metrics, clinical outcomes, and operational efficiency.", popular: true },
              { name: "Implementation Advisory", price: "Custom", duration: "3-12 months", desc: "Hands-on support for AI pilot programs and production deployments in clinical settings.", popular: false },
            ].map((tier) => (
              <div key={tier.name} className={`relative flex flex-col bg-white rounded-xl p-7 card-hover ${tier.popular ? "border-2 border-accent shadow-lg shadow-accent/10" : "border border-gray-200"}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold rounded-full tracking-wide">Recommended</div>
                )}
                <h3 className="font-display text-lg font-bold text-gray-900 mb-1">{tier.name}</h3>
                <p className="text-accent font-bold text-sm mb-0.5">{tier.price}</p>
                <p className="text-xs text-gray-400 mb-4">{tier.duration}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">{tier.desc}</p>
                <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={tier.popular ? "btn-primary text-sm justify-center" : "btn-outline text-sm justify-center"}>
                  Schedule Discussion
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Let's improve patient outcomes <span className="italic text-accent">together.</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
            Schedule a consultation to explore where AI can measurably improve care quality, operational efficiency, and patient experience in your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-base">Schedule Healthcare Consultation <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/assessment" className="btn-outline text-base">Take Free AI Assessment</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
