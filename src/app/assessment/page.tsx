"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Save, Mail } from "lucide-react";
import Script from "next/script";
import { useAuth, useUser } from "@clerk/nextjs";

// Data
const dimensions = [
  { id: "strategic", phase: "Assess", title: "Strategic Alignment", text: "Our organization has a clearly defined purpose for AI adoption that directly supports measurable business objectives, not exploratory experimentation.", benchmark: 3.5 },
  { id: "executive", phase: "Strategize", title: "Executive Sponsorship", text: "There is explicit executive ownership and accountability for AI strategy, investments, and outcomes at the C-suite or board level.", benchmark: 4.0 },
  { id: "oversight", phase: "Capability Build", title: "Human Oversight", text: "AI-assisted decisions are reviewed and governed by qualified humans through defined, consistent processes with clear escalation paths.", benchmark: 3.6 },
  { id: "data", phase: "Assess", title: "Data Foundation", text: "We have confidence in the quality, relevance, lineage, and governance of data that would feed AI systems across the organization.", benchmark: 3.8 },
  { id: "security", phase: "Capability Build", title: "Security & Privacy", text: "Security controls, privacy requirements, and access policies for AI tools and associated data are clearly defined, documented, and enforced.", benchmark: 3.7 },
  { id: "risk", phase: "Capability Build", title: "Risk Management", text: "We have systematically identified, assessed, and documented potential AI risks including bias, accuracy, misuse, and over-reliance.", benchmark: 3.6 },
  { id: "governance", phase: "Capability Build", title: "Governance Framework", text: "A formal process exists for evaluating, approving, monitoring, and retiring AI use cases with clear decision rights and review cadences.", benchmark: 3.9 },
  { id: "integration", phase: "Execution", title: "Operational Integration", text: "AI initiatives are embedded into production workflows and core business systems, not isolated in innovation labs or pilot programs.", benchmark: 3.5 },
  { id: "workforce", phase: "Capability Build", title: "Workforce Enablement", text: "Teams across the organization understand how to work effectively alongside AI systems and their responsibilities when AI is involved.", benchmark: 3.6 },
  { id: "improvement", phase: "Deployment", title: "Continuous Improvement", text: "We regularly evaluate AI systems for performance, business impact, drift, and unintended consequences with documented review cycles.", benchmark: 3.4 },
];

// Maturity levels for reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const maturityLevels: Record<number, string> = {
  1: "Not in place",
  2: "Ad hoc",
  3: "Defined",
  4: "Established",
  5: "Optimized",
};

const scaleOptions = [
  { value: 1, label: "Not in place" },
  { value: 2, label: "Ad hoc" },
  { value: 3, label: "Defined" },
  { value: 4, label: "Established" },
  { value: 5, label: "Optimized" },
];

const resultProfiles = {
  early: {
    color: "#DC2626",
    bgColor: "#FEF2F2",
    level: "Foundation",
    risk: "Higher Risk Profile",
    title: "Foundation Stage: Building AI Readiness",
    summary: "is in the early stages of AI readiness. While foundational capabilities are emerging, there are significant opportunities to strengthen governance, strategic alignment, and operational integration.",
    recommendations: [
      { title: "Establish Executive Sponsorship", details: "Secure visible, accountable leadership for AI strategy at the C-suite or board level." },
      { title: "Develop a Foundational AI Governance Framework", details: "Formalize decision rights, review cadence, and escalation paths for all AI initiatives." },
      { title: "Conduct a Full Data Readiness Assessment", details: "Audit data sources for quality, relevance, and governance." },
      { title: "Identify 2-3 Low-Risk, High-Visibility Pilot Projects", details: "Select pilots with clear business metrics and success criteria." },
      { title: "Create an AI Risk Register", details: "Systematically identify, assess, and review risks including bias, accuracy, and misuse." },
    ],
    cta: "Schedule a Foundation Review",
  },
  developing: {
    color: "#D97706",
    bgColor: "#FFFBEB",
    level: "Developing",
    risk: "Moderate Risk Profile",
    title: "Developing Stage: Strengthening AI Capabilities",
    summary: "has established early foundations for AI adoption but gaps remain that may limit scale or introduce risk if adoption accelerates. Strengthening governance and building systematic processes will position the organization for successful scaling.",
    recommendations: [
      { title: "Formalize AI Governance Structure", details: "Establish clear roles, responsibilities, and escalation paths across all AI initiatives." },
      { title: "Standardize Human Oversight Protocols", details: "Create consistent review processes across all AI use cases with documented procedures." },
      { title: "Develop Integration Roadmaps", details: "Connect AI initiatives to core business workflows with clear milestones." },
      { title: "Implement Structured AI Training", details: "Develop role-specific training for teams and stakeholders working with AI." },
      { title: "Establish Metrics Framework", details: "Create systematic measurement of AI impact and ROI across initiatives." },
    ],
    cta: "Schedule a Strategy Session",
  },
  advanced: {
    color: "#059669",
    bgColor: "#F0FDF4",
    level: "Advanced",
    risk: "Lower Risk Profile",
    title: "Advanced Stage: Optimizing AI Value",
    summary: "demonstrates strong preparation for responsible AI adoption with mature governance, clear ownership, and integrated operations. The focus now shifts to disciplined scaling, governance refinement, and developing sustainable competitive advantages.",
    recommendations: [
      { title: "Scale AI Patterns Systematically", details: "Expand successful AI implementations across business units with proven frameworks." },
      { title: "Refine Governance Based on Learnings", details: "Continuously improve governance based on operational experience and emerging risks." },
      { title: "Explore Advanced AI Capabilities", details: "Evaluate generative AI, autonomous systems, and emerging technologies." },
      { title: "Establish AI Center of Excellence", details: "Formalize knowledge transfer and best practice sharing across the organization." },
      { title: "Develop Differentiation Strategy", details: "Use AI capabilities to build sustainable competitive advantage." },
    ],
    cta: "Schedule a Scale Discussion",
  },
};

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/wbivsc5yc47d73dsu1re7wewnq3ffxsp";

type Screen = "intro" | "questions" | "capture" | "results";
type Band = "early" | "developing" | "advanced";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
}

export default function AssessmentPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedResultId, setSavedResultId] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Pre-fill form data from Clerk user if signed in
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.emailAddresses[0]?.emailAddress || prev.email,
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  const getScore = () => {
    let sum = 0;
    for (let i = 0; i < 10; i++) sum += answers[i] || 0;
    return sum;
  };

  const getBand = (score: number): Band => {
    if (score <= 24) return "early";
    if (score <= 39) return "developing";
    return "advanced";
  };

  const getGapAnalysis = (score: number, benchmark: number) => {
    const diff = benchmark - score;
    if (diff <= 0) return "On track";
    if (diff <= 1) return "Minor gap";
    if (diff <= 2) return "Needs attention";
    return "Critical gap";
  };

  const selectAnswer = (val: number) => {
    setAnswers({ ...answers, [currentQ]: val });
    setTimeout(() => {
      if (currentQ < 9) {
        setCurrentQ(currentQ + 1);
      } else {
        setScreen("capture");
      }
    }, 250);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const currentScore = getScore();
    const currentBand = getBand(currentScore);
    const currentProfile = resultProfiles[currentBand];

    try {
      // Send data to Make.com webhook (for marketing/CRM)
      const webhookData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        organization: formData.organization,
        role: formData.role,
        score: currentScore,
        band: currentBand,
        answers: answers,
        dimensions: dimensions.map((dim, i) => ({
          title: dim.title,
          score: answers[i] || 0,
          benchmark: dim.benchmark,
        })),
        timestamp: new Date().toISOString(),
      };

      await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookData),
        mode: "no-cors",
      });

      // If user is signed in, save to database
      if (isSignedIn) {
        const saveResponse = await fetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessment_type: "ai_readiness",
            score: currentScore,
            band: currentBand,
            answers: answers,
            dimensions: dimensions.map((dim, i) => ({
              title: dim.title,
              score: answers[i] || 0,
              benchmark: dim.benchmark,
            })),
            recommendations: currentProfile.recommendations,
            organization: formData.organization,
            role: formData.role,
          }),
        });

        if (saveResponse.ok) {
          const { result } = await saveResponse.json();
          setIsSaved(true);
          setSavedResultId(result.id);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
    }

    setIsSubmitting(false);
    setScreen("results");
  };

  const handleSendEmail = async () => {
    if (!savedResultId || !isSignedIn) return;

    setIsSendingEmail(true);
    try {
      const response = await fetch("/api/email/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId: savedResultId }),
      });

      if (response.ok) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Email send error:", error);
    }
    setIsSendingEmail(false);
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswers({});
    setFormData({ firstName: "", lastName: "", email: "", organization: "", role: "" });
    setScreen("intro");
  };

  const score = getScore();
  const band = getBand(score);
  const profile = resultProfiles[band];
  const pct = Math.round(((currentQ + 1) / 10) * 100);

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js" />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-navy py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="JMCB Technology Group"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <span className="px-4 py-2 bg-accent/20 border border-accent/30 rounded-md text-xs font-semibold text-accent tracking-wide">
            ASCEND™ Framework
          </span>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          {/* INTRO SCREEN */}
          {screen === "intro" && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">
                  Executive Assessment
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                  AI Readiness<br />Assessment
                </h1>
                <p className="text-lg text-gray-500 max-w-lg mx-auto">
                  Evaluate your organization&apos;s preparedness for responsible AI adoption with our proprietary ASCEND™ methodology.
                </p>
              </div>

              {/* ASCEND Framework */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
                <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
                  The ASCEND™ Framework
                </p>
                <p className="text-gray-700 mb-6">
                  A proven methodology for evaluating and accelerating organizational AI maturity across five critical stages:
                </p>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { letter: "A", word: "ASSESS", desc: "Current State" },
                    { letter: "S", word: "STRATEGIZE", desc: "Priorities & Roadmap" },
                    { letter: "C", word: "CAPABILITY", desc: "Skills & Infrastructure" },
                    { letter: "E", word: "EXECUTION", desc: "Build & Validate" },
                    { letter: "D", word: "DEPLOYMENT", desc: "Scale & Optimize" },
                  ].map((item) => (
                    <div key={item.letter} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-accent mb-1">{item.letter}</div>
                      <div className="text-[10px] font-semibold text-gray-900">{item.word}</div>
                      <div className="text-[9px] text-gray-500 mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-8 mb-8 flex-wrap">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Questions</div>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">3</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Minutes</div>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">6-Page</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">PDF Report</div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setScreen("questions")}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Start Your Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="mt-6 text-sm text-gray-400">
                  Trusted by organizations in tech, healthcare, government, and education
                </p>
              </div>
            </div>
          )}

          {/* QUESTIONS SCREEN */}
          {screen === "questions" && (
            <div className="animate-fade-in">
              {/* Progress */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500">
                    Question {currentQ + 1} of 10
                  </span>
                  <span className="text-sm font-semibold text-accent">{pct}%</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-amber-500 rounded-full transition-all duration-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                <span className="inline-block px-3 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  ASCEND™ {dimensions[currentQ].phase}
                </span>
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">
                  {dimensions[currentQ].title}
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  {dimensions[currentQ].text}
                </p>
              </div>

              {/* Scale Options */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
                {scaleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => selectAnswer(option.value)}
                    className={`p-3 sm:p-5 rounded-xl border-2 text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${
                      answers[currentQ] === option.value
                        ? "bg-navy border-navy"
                        : "bg-white border-gray-200 hover:border-accent"
                    }`}
                  >
                    <div
                      className={`text-xl sm:text-2xl font-bold mb-1 ${
                        answers[currentQ] === option.value ? "text-accent" : "text-gray-900"
                      }`}
                    >
                      {option.value}
                    </div>
                    <div
                      className={`text-[8px] sm:text-[10px] font-medium uppercase tracking-tight ${
                        answers[currentQ] === option.value ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              {currentQ > 0 && (
                <button
                  onClick={() => setCurrentQ(currentQ - 1)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Question
                </button>
              )}
            </div>
          )}

          {/* CAPTURE SCREEN */}
          {screen === "capture" && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-7 h-7 text-green-600" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                  Assessment Complete
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Enter your details to receive your full AI Readiness Report with benchmarking, recommendations, and action plan.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none bg-white"
                  >
                    <option value="">Select your role...</option>
                    <option value="CEO / President">CEO / President</option>
                    <option value="COO">COO / Chief Operating Officer</option>
                    <option value="CFO">CFO / Chief Financial Officer</option>
                    <option value="CTO">CTO / Chief Technology Officer</option>
                    <option value="CIO">CIO / Chief Information Officer</option>
                    <option value="CISO">CISO / Chief Information Security Officer</option>
                    <option value="CDO">CDO / Chief Data Officer</option>
                    <option value="VP / SVP / EVP">VP / SVP / EVP</option>
                    <option value="Director">Director / Senior Director</option>
                    <option value="Managing Director / Partner">Managing Director / Partner</option>
                    <option value="Enterprise Architect">Enterprise Architect</option>
                    <option value="Solutions Architect">Solutions Architect</option>
                    <option value="Head of IT / Engineering">Head of IT / Engineering</option>
                    <option value="Head of AI / ML / Data">Head of AI / ML / Data</option>
                    <option value="Consultant / Advisor">Consultant / Advisor</option>
                    <option value="Founder / Board Member">Founder / Board Member</option>
                    <option value="Other Executive">Other Executive Role</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      View My Results
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-400 mt-4">
                  Your information is kept confidential and never shared.
                </p>
              </form>
            </div>
          )}

          {/* RESULTS SCREEN */}
          {screen === "results" && (
            <div className="animate-fade-in">
              {/* Score Display */}
              <div className="text-center mb-10">
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-4"
                  style={{ color: profile.color }}
                >
                  {profile.risk}
                </p>
                <div
                  className="text-6xl font-heading font-bold mb-4"
                  style={{ color: profile.color }}
                >
                  {score}
                  <span className="text-2xl opacity-60">/50</span>
                </div>
                <h1 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                  {profile.title}
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto">
                  {formData.organization} {profile.summary}
                </p>
              </div>

              {/* Breakdown */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
                  Assessment Breakdown
                </p>
                <div className="space-y-3">
                  {dimensions.map((dim, i) => {
                    const val = answers[i] || 0;
                    const barColor = val >= 4 ? "#059669" : val >= 3 ? "#D97706" : "#DC2626";
                    return (
                      <div
                        key={dim.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{dim.title}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Benchmark: {dim.benchmark} | {getGapAnalysis(val, dim.benchmark)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(val / 5) * 100}%`, backgroundColor: barColor }}
                            />
                          </div>
                          <span
                            className="text-sm font-semibold min-w-[20px] text-right"
                            style={{ color: barColor }}
                          >
                            {val}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
                  Key Recommendations
                </p>
                <div className="space-y-3">
                  {profile.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-4"
                    >
                      <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-gray-900">{rec.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{rec.details}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Status Banner */}
              {isSignedIn && isSaved ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Save className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Results Saved to Dashboard</p>
                      <p className="text-sm text-green-600">Access your results anytime from your dashboard</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={handleSendEmail}
                      disabled={isSendingEmail || emailSent}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-green-300 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4" />
                      {emailSent ? "Email Sent!" : isSendingEmail ? "Sending..." : "Email Report"}
                    </button>
                  </div>
                </div>
              ) : !isSignedIn ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Save className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800">Save Your Results</p>
                      <p className="text-sm text-blue-600">Create a free account to save and track your progress over time</p>
                    </div>
                  </div>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Free Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : null}

              {/* CTA */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                  Ready to Accelerate Your AI Journey?
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Schedule a complimentary strategy session to review your results, discuss the roadmap, and plan next steps.
                </p>
                <Link
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg mb-4"
                >
                  {profile.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div>
                  <button
                    onClick={restart}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake Assessment
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 py-8 text-center">
          <p className="text-sm text-gray-500">
            © 2026 JMCB Technology Group. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            <Link href="/" className="hover:text-gray-600">
              jmcbtech.com
            </Link>{" "}
            · Powered by the ASCEND™ Framework
          </p>
        </footer>
      </div>
    </>
  );
}
