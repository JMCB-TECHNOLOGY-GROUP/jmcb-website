"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, RotateCcw, AlertTriangle, Zap, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Updated dimensions based on product specialist feedback - SMB/Agentic AI focused
const dimensions = [
  {
    id: "strategic",
    phase: "Assess",
    title: "Strategic Alignment",
    text: "We have 1–3 specific workflows where AI (including agents) will create measurable impact in the next 90 days (time saved, revenue gained, errors reduced), and we've defined how we'll measure success.",
    benchmark: 3.5,
    levels: {
      1: "No defined AI use case or success metric.",
      2: "Trying tools informally (ChatGPT, automations), but no agreed workflow, owner, or KPI.",
      3: "We've selected 1–3 workflows and basic KPIs (time saved, lead response time, cost), but execution plan is light.",
      4: "We have a documented plan (30/60/90), an owner, baseline measurements, and a pilot workflow selected.",
      5: "We review KPIs regularly, refine workflows, and have a repeatable process for selecting and scaling new AI/agent use cases.",
    },
  },
  {
    id: "executive",
    phase: "Strategize",
    title: "Executive Ownership",
    text: "A specific leader (e.g., owner/CEO, managing partner, practice director, GM, or department head) is accountable for AI decisions and outcomes - including approving use cases, budget/time, and success metrics.",
    benchmark: 4.0,
    levels: {
      1: "No clear owner for AI. Adoption is individual/experimental.",
      2: "Leadership is supportive, but no named owner, no budget, and no recurring review.",
      3: "A leader is named and approves tool spend/use cases, but accountability and reporting are inconsistent.",
      4: "Owner is named, responsibilities are clear, a small budget or time allocation exists, and progress is reviewed on a schedule.",
      5: "AI ownership is embedded in operations: KPIs are tracked, decisions are documented, and scaling/guardrails are consistently enforced.",
    },
  },
  {
    id: "oversight",
    phase: "Navigate",
    title: "Human Oversight",
    text: "For AI/agent-driven workflows, we have clear \"human-in-the-loop\" approval steps, defined exception rules, and an escalation path when confidence is low or risk is high (customer-facing, financial, legal, or clinical).",
    benchmark: 3.6,
    levels: {
      1: "AI outputs are used without review, or review is inconsistent and undocumented.",
      2: "People occasionally review AI work, but it depends on the person and there's no standard process.",
      3: "We've defined where review is required (e.g., customer messages, payments), and who approves, but escalation/exception handling is still informal.",
      4: "We have a consistent review workflow (approval gates), documented escalation paths, and a way to handle exceptions.",
      5: "Oversight is risk-based and measurable: we track error rates, review turnaround time, and continuously tune guardrails and thresholds as we scale.",
    },
  },
  {
    id: "data",
    phase: "Assess",
    title: "Data Foundation",
    text: "We have confidence that the data feeding AI/agent workflows is accurate, up to date, and permissioned across our core systems (CRM/sales, support tickets, finance/accounting, inventory/ops, internal documents) and we can trace where it came from.",
    benchmark: 3.8,
    levels: {
      1: "Data is scattered across tools/spreadsheets, inconsistent, and we don't know what the source of truth is.",
      2: "Some clean datasets exist, but quality varies, access is messy, and updates depend on individuals.",
      3: "We know our core systems of record (e.g., CRM/accounting), have basic data standards, and can use the data for a pilot use case.",
      4: "Data is reliable for key workflows: ownership is clear, access permissions are managed, and we have routine cleanup/validation.",
      5: "Data is audit-ready for AI at scale: consistent definitions, monitored quality, controlled access, and the ability to trace inputs/changes for AI decisions.",
    },
  },
  {
    id: "security",
    phase: "Navigate",
    title: "Security & Privacy",
    text: "We have clear rules and controls for what AI tools/agents can access and share (customer data, internal docs, financial data), including permissions, approved tools, and how sensitive data is handled.",
    benchmark: 3.7,
    levels: {
      1: "No defined rules for AI tool use or data access; people use whatever tools they want.",
      2: "Some informal \"do/don't\" guidance exists, but it isn't documented or consistently followed.",
      3: "We have documented rules for approved tools and what data can/can't be used, but enforcement and monitoring are limited.",
      4: "Access is permissioned (least privilege), sensitive data handling is clear, vendors are reviewed/approved, and policies are communicated and followed.",
      5: "Controls are enforced and continuously improved: training is routine, audits/checks occur, incidents are tracked, and policies evolve as AI use scales.",
    },
  },
  {
    id: "risk",
    phase: "Navigate",
    title: "Risk Management",
    text: "We've identified the main ways AI/agents could go wrong in our business (wrong answers, biased outcomes, data exposure, misuse, or over-reliance) and we have practical safeguards to detect and reduce these risks.",
    benchmark: 3.6,
    levels: {
      1: "We haven't discussed AI risks or set guardrails.",
      2: "We've talked about risks informally, but nothing is documented and controls vary by person.",
      3: "We've documented key risks for our intended use cases and defined basic mitigations (what needs review, what data is restricted, what AI shouldn't do).",
      4: "Risk controls are built into workflows: approval gates for high-impact actions, testing/validation steps, logs for key actions, and an escalation plan when issues arise.",
      5: "Risk management is ongoing and measurable: we monitor incidents/errors, update guardrails regularly, train staff, and refine policies as we scale AI/agent use.",
    },
  },
  {
    id: "governance",
    phase: "Navigate",
    title: "Governance Framework",
    text: "We have a lightweight process to approve, manage, and review AI/agent workflows - including who can approve them, how success/risk is monitored, and when a workflow must be paused or retired.",
    benchmark: 3.9,
    levels: {
      1: "No approval or review process; AI use is unmanaged.",
      2: "Approvals happen informally (if at all) and there's no consistent review cadence.",
      3: "We have a basic documented process (who approves + what to check), but monitoring and retirement decisions are inconsistent.",
      4: "AI/agent workflows follow a consistent lifecycle: evaluate → approve → pilot → monitor → improve/retire, with clear decision rights and a regular review cadence.",
      5: "Governance is embedded and efficient: standardized checklists, strong documentation/logging, KPI + risk dashboards, and fast iteration or shutdown when performance or risk thresholds are breached.",
    },
  },
  {
    id: "integration",
    phase: "Execution",
    title: "Operational Integration",
    text: "AI/agent workflows are integrated into the tools and processes our team already uses (CRM, support/helpdesk, scheduling, finance/accounting, docs) with clear handoffs and approvals - not just one-off experiments.",
    benchmark: 3.5,
    levels: {
      1: "AI isn't used in core workflows or systems.",
      2: "Individuals use AI tools manually (copy/paste), but nothing is standardized or integrated.",
      3: "We've identified specific workflows to integrate AI into and have basic SOPs, but integration is still partial or inconsistent.",
      4: "At least one AI/agent workflow is running in production with defined steps, approvals, and integration into core systems (or reliable automations).",
      5: "AI/agent workflows are standardized and scalable across teams: monitored, documented, continuously improved, and reliably connected to core systems.",
    },
  },
  {
    id: "workforce",
    phase: "Capability",
    title: "Workforce Enablement",
    text: "Our team knows how to use AI/agents safely and effectively in their day-to-day work - including what's allowed, what requires human approval, and who is responsible for outcomes.",
    benchmark: 3.6,
    levels: {
      1: "No training or guidance; people use AI inconsistently or not at all.",
      2: "A few individuals know how to use AI, but there's no shared playbook, templates, or accountability.",
      3: "We have basic training and written guidelines (do/don't, data rules, review requirements), but adoption varies by team.",
      4: "Training is role-based, templates/SOPs exist for key workflows, and responsibilities are clear (who reviews, who approves, who owns results).",
      5: "Enablement is continuous: onboarding includes AI, refreshers occur regularly, performance is measured, and the playbook evolves based on outcomes and risk learnings.",
    },
  },
  {
    id: "improvement",
    phase: "Deployment",
    title: "Continuous Improvement",
    text: "We regularly review AI/agent workflows on a defined schedule (monthly/quarterly) to ensure they're delivering business value - tracking KPIs like ROI/time saved, accuracy/error rates, and any unintended impacts.",
    benchmark: 3.4,
    levels: {
      1: "No performance tracking or formal review of AI results.",
      2: "We notice issues when they happen, but reviews and fixes are inconsistent and not documented.",
      3: "We track basic metrics (e.g., time saved, accuracy/error rate) and have an intended review cadence, but follow-through varies.",
      4: "We have documented review cycles, clear owners, KPI + error monitoring, and a consistent process to improve or pause workflows when results degrade.",
      5: "Continuous improvement is systematic: we benchmark performance, run structured updates, document changes, and proactively detect reliability drops as we scale.",
    },
  },
];

const scaleOptions = [
  { value: 1, label: "Not in place" },
  { value: 2, label: "Ad hoc" },
  { value: 3, label: "Defined" },
  { value: 4, label: "Established" },
  { value: 5, label: "Optimized" },
];

// Recommended first workflows based on score patterns
const workflowRecommendations = [
  {
    name: "Customer Support Triage Agent",
    description: "Supervised agent that categorizes and routes support tickets, drafts initial responses for human review.",
    kpis: ["First response time", "Ticket routing accuracy", "Agent time saved"],
    bestFor: "Teams with high support volume and inconsistent response times",
  },
  {
    name: "Sales Research & Prep Agent",
    description: "Agent that researches prospects, summarizes company info, and drafts personalized outreach for human approval.",
    kpis: ["Research time saved", "Meeting prep quality", "Outreach response rate"],
    bestFor: "Sales teams spending too much time on manual research",
  },
  {
    name: "Document Processing Agent",
    description: "Agent that extracts data from documents (invoices, contracts, forms), flags exceptions for human review.",
    kpis: ["Processing time", "Extraction accuracy", "Exception rate"],
    bestFor: "Teams with repetitive document handling workflows",
  },
  {
    name: "Internal Knowledge Assistant",
    description: "Agent that answers team questions using your internal docs, SOPs, and knowledge base - with source citations.",
    kpis: ["Questions resolved", "Time to answer", "Source accuracy"],
    bestFor: "Teams where tribal knowledge slows down onboarding and daily work",
  },
];

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/wsneore7j9b7sy6smxpbs0al2mf8ef75";

type Screen = "intro" | "questions" | "capture" | "results";
type Band = "early" | "developing" | "advanced";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  companySize: string;
}

export default function AssessmentPage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
    companySize: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Get top 3 blockers (lowest scoring dimensions)
  const getBlockers = () => {
    const scored = dimensions.map((dim, i) => ({
      ...dim,
      score: answers[i] || 0,
      index: i,
    }));
    return scored
      .filter((d) => d.score < 4) // Only include scores below "Established"
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  };

  // Get recommended workflow based on answers
  const getRecommendedWorkflow = () => {
    const dataScore = answers[3] || 0;
    const integrationScore = answers[7] || 0;
    const workforceScore = answers[8] || 0;

    // If data foundation is weak, start with internal knowledge
    if (dataScore <= 2) return workflowRecommendations[3];
    // If integration is weak, start with document processing (standalone)
    if (integrationScore <= 2) return workflowRecommendations[2];
    // If workforce enablement is weak, start with sales research (high visibility)
    if (workforceScore <= 2) return workflowRecommendations[1];
    // Default to support triage (common quick win)
    return workflowRecommendations[0];
  };

  // Generate recommendations based on ACTUAL low scores
  const getRecommendations = () => {
    const blockers = getBlockers();
    const recommendations: { title: string; details: string }[] = [];

    blockers.forEach((blocker) => {
      switch (blocker.id) {
        case "strategic":
          recommendations.push({
            title: "Define 1-3 AI Quick Wins",
            details: "Identify specific workflows with measurable KPIs (time saved, errors reduced) and a 30/60/90-day execution plan.",
          });
          break;
        case "executive":
          recommendations.push({
            title: "Establish AI Ownership",
            details: "Name a specific leader accountable for AI decisions, budget, and outcomes with a regular review cadence.",
          });
          break;
        case "oversight":
          recommendations.push({
            title: "Define Human-in-the-Loop Rules",
            details: "Document which AI outputs require human approval, who approves, and escalation paths for exceptions.",
          });
          break;
        case "data":
          recommendations.push({
            title: "Audit Your Data Foundation",
            details: "Identify your systems of record, clean up data quality issues, and establish access permissions for AI tools.",
          });
          break;
        case "security":
          recommendations.push({
            title: "Set AI Security Policies",
            details: "Document approved tools, data access rules, and sensitive data handling procedures.",
          });
          break;
        case "risk":
          recommendations.push({
            title: "Create an AI Risk Register",
            details: "Document potential failure modes, define guardrails, and establish monitoring for AI/agent workflows.",
          });
          break;
        case "governance":
          recommendations.push({
            title: "Build a Lightweight Governance Process",
            details: "Create a simple approval workflow for AI use cases with defined decision rights and review cadence.",
          });
          break;
        case "integration":
          recommendations.push({
            title: "Pilot One Integrated Workflow",
            details: "Move from copy/paste AI use to one production workflow integrated with your core systems.",
          });
          break;
        case "workforce":
          recommendations.push({
            title: "Create AI Usage Guidelines",
            details: "Document what's allowed, what requires approval, and train your team on responsible AI use.",
          });
          break;
        case "improvement":
          recommendations.push({
            title: "Establish Review Cadence",
            details: "Set up monthly/quarterly reviews of AI performance with clear KPIs and improvement triggers.",
          });
          break;
      }
    });

    // If somehow no blockers, give general advice
    if (recommendations.length === 0) {
      recommendations.push({
        title: "Scale Your AI Success",
        details: "You're well-positioned. Focus on expanding proven workflows and refining governance as you scale.",
      });
    }

    return recommendations;
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
    const blockers = getBlockers();
    const recommendations = getRecommendations();
    const recommendedWorkflow = getRecommendedWorkflow();

    const dimensionData = dimensions.map((dim, i) => ({
      title: dim.title,
      score: answers[i] || 0,
      benchmark: dim.benchmark,
      phase: dim.phase,
    }));

    try {
      // Send data to Make.com webhook
      const webhookData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        organization: formData.organization,
        role: formData.role,
        companySize: formData.companySize,
        score: currentScore,
        band: currentBand,
        answers: answers,
        dimensions: dimensionData,
        blockers: blockers.map((b) => ({ title: b.title, score: b.score })),
        recommendations: recommendations,
        recommendedWorkflow: recommendedWorkflow,
        calendlyUrl: CALENDLY_URL,
        timestamp: new Date().toISOString(),
      };

      // Fire webhook to Make
      await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookData),
        mode: "no-cors",
      });

      // Save lead to database
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            organization: formData.organization,
            role: formData.role,
            companySize: formData.companySize,
            score: currentScore,
            band: currentBand,
            answers: answers,
            dimensions: dimensionData,
          }),
        });
      } catch (leadError) {
        console.error("Lead capture error:", leadError);
      }
    } catch (error) {
      console.error("Submit error:", error);
    }

    setIsSubmitting(false);
    setScreen("results");
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswers({});
    setFormData({ firstName: "", lastName: "", email: "", organization: "", role: "", companySize: "" });
    setScreen("intro");
  };

  const score = getScore();
  const band = getBand(score);
  const blockers = getBlockers();
  const recommendations = getRecommendations();
  const recommendedWorkflow = getRecommendedWorkflow();
  const pct = Math.round(((currentQ + 1) / 10) * 100);

  const bandInfo = {
    early: {
      color: "#DC2626",
      bgColor: "#FEF2F2",
      label: "Foundation Stage",
      risk: "Higher Risk Profile",
      summary: "is in the early stages of agentic AI readiness. Focus on establishing fundamentals before deploying AI agents.",
    },
    developing: {
      color: "#D97706",
      bgColor: "#FFFBEB",
      label: "Developing Stage",
      risk: "Moderate Risk Profile",
      summary: "has foundations in place but gaps remain. Address blockers before scaling agentic AI workflows.",
    },
    advanced: {
      color: "#059669",
      bgColor: "#F0FDF4",
      label: "Advanced Stage",
      risk: "Lower Risk Profile",
      summary: "is well-positioned for agentic AI. Focus on scaling proven workflows and refining governance.",
    },
  };

  const profile = bandInfo[band];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16 pt-28">
        {/* INTRO SCREEN */}
        {screen === "intro" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">
                Executive Assessment
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                AI Readiness Assessment
              </h1>
              <p className="text-lg text-accent font-medium mb-4">
                Ready for agentic AI? Start with the right workflows and guardrails.
              </p>
              <p className="text-gray-500 max-w-lg mx-auto">
                Assess your data, processes, and risk exposure, then get a recommended starting point and rollout plan via the JMCB ASCEND™ methodology.
              </p>
            </div>

            {/* JMCB ASCEND Framework */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
                The JMCB ASCEND™ Framework
              </p>
              <p className="text-gray-700 text-sm mb-4">
                A practical path to deploy agentic AI safely — starting with the workflows that matter most.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="font-bold text-accent w-6">A</span>
                  <div><strong>Assess</strong> — Identify your best AI use cases + what's blocking them</div>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-accent w-6">S</span>
                  <div><strong>Strategize</strong> — Pick priorities and define ROI with a 30/60/90-day roadmap</div>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-accent w-6">C</span>
                  <div><strong>Capability</strong> — Confirm your tools, skills, and data access</div>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-accent w-6">E</span>
                  <div><strong>Execution</strong> — Pilot one workflow with clear success metrics</div>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-accent w-6">N</span>
                  <div><strong>Navigate</strong> — Put guardrails in place for responsible AI</div>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-accent w-6">D</span>
                  <div><strong>Deployment</strong> — Roll out and optimize with continuous improvement</div>
                </div>
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
                <div className="text-3xl font-bold text-gray-900">5</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Minutes</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">Free</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Report</div>
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
                Built for small teams: clear steps, minimal disruption, measurable outcomes.
              </p>
            </div>
          </div>
        )}

        {/* QUESTIONS SCREEN */}
        {screen === "questions" && (
          <div className="animate-fade-in">
            {/* Progress */}
            <div className="mb-8">
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
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded text-xs font-semibold uppercase tracking-wide mb-4">
                ASCEND™ {dimensions[currentQ].phase}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {dimensions[currentQ].title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {dimensions[currentQ].text}
              </p>
            </div>

            {/* Scale Options - Stacked with descriptions */}
            <div className="space-y-2 mb-6">
              {scaleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => selectAnswer(option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:border-accent ${
                    answers[currentQ] === option.value
                      ? "bg-accent/10 border-accent"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-lg font-bold ${
                        answers[currentQ] === option.value ? "text-accent" : "text-gray-400"
                      }`}
                    >
                      {option.value}
                    </span>
                    <div>
                      <div className={`font-semibold ${answers[currentQ] === option.value ? "text-accent" : "text-gray-900"}`}>
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {dimensions[currentQ].levels[option.value as 1 | 2 | 3 | 4 | 5]}
                      </div>
                    </div>
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
                Previous
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Agentic AI Readiness Report is Ready
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Enter your details to unlock:
              </p>
              <ul className="text-gray-600 mt-4 space-y-2 max-w-sm mx-auto text-left">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Your ASCEND™ Readiness Score + risk flags</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Top 3 blockers to agentic AI in your business</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Recommended first AI agent workflow</span>
                </li>
              </ul>
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
                  <option value="Owner / Founder">Owner / Founder</option>
                  <option value="CEO / President">CEO / President</option>
                  <option value="COO / Operations">COO / Operations</option>
                  <option value="CFO / Finance">CFO / Finance</option>
                  <option value="CTO / CIO / Technology">CTO / CIO / Technology</option>
                  <option value="VP / Director">VP / Director</option>
                  <option value="Manager">Manager</option>
                  <option value="Consultant / Advisor">Consultant / Advisor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size *
                </label>
                <select
                  required
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none bg-white"
                >
                  <option value="">Select company size...</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
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
                    Unlock My Results
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                We'll email your report. No spam. Unsubscribe anytime. We never sell your data.
              </p>
            </form>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {screen === "results" && (
          <div className="animate-fade-in">
            {/* Score Header */}
            <div className="text-center mb-8">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: profile.color }}
              >
                {profile.risk}
              </p>
              <div
                className="text-6xl font-bold mb-3"
                style={{ color: profile.color }}
              >
                {score}
                <span className="text-2xl opacity-60">/50</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {profile.label}
              </h1>
              <p className="text-gray-500 max-w-lg mx-auto">
                {formData.organization} {profile.summary}
              </p>
            </div>

            {/* TOP 3 BLOCKERS */}
            {blockers.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-sm font-semibold text-red-800 uppercase tracking-wide">
                    Top {blockers.length} Blockers to Agentic AI
                  </p>
                </div>
                <div className="space-y-3">
                  {blockers.map((blocker, i) => (
                    <div
                      key={blocker.id}
                      className="bg-white border border-red-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-red-600">{i + 1}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{blocker.title}</div>
                          <div className="text-sm text-gray-500">
                            Score: {blocker.score}/5 • {blocker.phase} phase
                          </div>
                        </div>
                      </div>
                      <span
                        className="text-2xl font-bold"
                        style={{
                          color: blocker.score <= 2 ? "#DC2626" : "#D97706",
                        }}
                      >
                        {blocker.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RECOMMENDED FIRST WORKFLOW */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-green-600" />
                <p className="text-sm font-semibold text-green-800 uppercase tracking-wide">
                  Recommended First Agent Workflow
                </p>
              </div>
              <div className="bg-white border border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {recommendedWorkflow.name}
                </h3>
                <p className="text-gray-600 mb-3">{recommendedWorkflow.description}</p>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">KPIs to Track:</p>
                  <div className="flex flex-wrap gap-2">
                    {recommendedWorkflow.kpis.map((kpi) => (
                      <span key={kpi} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  <strong>Best for:</strong> {recommendedWorkflow.bestFor}
                </p>
              </div>
            </div>

            {/* RECOMMENDATIONS */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
                Priority Actions
              </p>
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
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

            {/* DIMENSION BREAKDOWN */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
                Full Assessment Breakdown
              </p>
              <div className="space-y-2">
                {dimensions.map((dim, i) => {
                  const val = answers[i] || 0;
                  const barColor = val >= 4 ? "#059669" : val >= 3 ? "#D97706" : "#DC2626";
                  return (
                    <div
                      key={dim.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{dim.title}</div>
                        <div className="text-xs text-gray-400">{dim.phase}</div>
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

            {/* CTA */}
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-8 text-center">
              <Calendar className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Let's Build Your AI Roadmap
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Book a free 30-minute call to review your results, prioritize your blockers, and map out your first AI agent workflow.
              </p>
              <Link
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Book Free Strategy Call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="mt-6">
                <button
                  onClick={restart}
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
