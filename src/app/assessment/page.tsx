"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getQuestionsForSize,
  calculateOverallScore,
  generateMicroInsight,
  ASCEND_PHASES,
  REPORT_BRANDING,
  PRIORITY_ACTIONS,
  DIMENSION_SERVICE_MAP,
  type AssessmentQuestion,
  type CompanySize,
  type Role,
} from "@/lib/assessment-content";

type Stage = "intro" | "profiling" | "questions" | "mid-capture" | "questions-2" | "final-capture" | "analyzing" | "results";

interface UserProfile {
  companySize: CompanySize | null;
  role: Role | null;
  organization: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Results {
  overallScore: number;
  dimensionScores: Record<string, number>;
  weakestDimension: string;
  strongestDimension: string;
  leadScore: string;
  reportBranding: { title: string; subtitle: string; focus: string };
  priorityActions: string[];
  serviceRecommendations: Array<{ dimension: string; service: string; description: string; deliverable: string }>;
  benchmarks: Record<string, number>;
}

const CALENDLY_LINK = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

const COMPANY_SIZES: { value: CompanySize; label: string }[] = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "200+", label: "200+ employees" },
];

const ROLES: { value: Role; label: string }[] = [
  { value: "c-suite", label: "C-Suite / Executive" },
  { value: "vp", label: "Vice President" },
  { value: "director", label: "Director" },
  { value: "manager", label: "Manager" },
  { value: "business-owner", label: "Business Owner" },
  { value: "individual-contributor", label: "Individual Contributor" },
  { value: "consultant", label: "Consultant / Advisor" },
  { value: "student", label: "Student / Researcher" },
];

const ASCEND_ITEMS = [
  { letter: "A", word: "Assess", desc: "Identify your best AI use cases + what's blocking them" },
  { letter: "S", word: "Strategize", desc: "Pick priorities and define ROI with a 30/60/90-day roadmap" },
  { letter: "C", word: "Construct", desc: "Confirm your tools, skills, and data access" },
  { letter: "E", word: "Execute", desc: "Pilot one workflow with clear success metrics" },
  { letter: "N", word: "Navigate", desc: "Put guardrails in place for responsible AI" },
  { letter: "D", word: "Develop", desc: "Roll out and optimize with continuous improvement" },
];

const PHASE_COLORS: Record<string, string> = {
  Assess: "#d97706",
  Strategize: "#2563eb",
  Construct: "#7c3aed",
  Execute: "#059669",
  Normalize: "#dc2626",
  Develop: "#0891b2",
};

const ANALYZING_STEPS = [
  "Mapping responses to ASCEND framework...",
  "Calculating dimension scores...",
  "Benchmarking against industry data...",
  "Identifying priority gaps...",
  "Generating personalized insights...",
  "Building your readiness profile...",
];

// ── ASCEND domain grouping for results ──
const ASCEND_DOMAINS: { phase: string; label: string; color: string; icon: string; dimensions: string[] }[] = [
  { phase: "Assess", label: "Assess Domain", color: "#d97706", icon: "🔍", dimensions: ["Strategic Alignment", "Data Foundation"] },
  { phase: "Strategize", label: "Strategize Domain", color: "#2563eb", icon: "🎯", dimensions: ["Executive Ownership"] },
  { phase: "Construct", label: "Construct Domain", color: "#7c3aed", icon: "🔧", dimensions: ["Workforce Enablement"] },
  { phase: "Execute", label: "Execute Domain", color: "#059669", icon: "⚡", dimensions: ["Operational Integration"] },
  { phase: "Normalize", label: "Navigate Domain", color: "#dc2626", icon: "🛡️", dimensions: ["Human Oversight", "Security & Privacy", "Risk Management", "Governance Framework"] },
  { phase: "Develop", label: "Develop Domain", color: "#0891b2", icon: "📈", dimensions: ["Continuous Improvement"] },
];

// ── DonutChart SVG component ──
function DonutChart({ score, max, color, size = 140, label }: { score: number; max: number; color: string; size?: number; label?: string }) {
  const pct = Math.round((score / max) * 100);
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1.2s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size > 120 ? "32px" : "22px", fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{score}</span>
        {label && <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>{label}</span>}
      </div>
    </div>
  );
}

// ── HorizontalBar component ──
function HBar({ label, score, benchmark, color }: { label: string; score: number; benchmark: number; color: string }) {
  const pct = (score / 5) * 100;
  const bPct = (benchmark / 5) * 100;
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#334155" }}>{label}</span>
        <span style={{ fontSize: "14px", fontWeight: 700, color }}>{score.toFixed(1)}</span>
      </div>
      <div style={{ position: "relative", height: "22px", background: "#f1f5f9", borderRadius: "4px", overflow: "visible" }}>
        <div style={{ height: "100%", background: color, borderRadius: "4px", width: `${pct}%`, transition: "width 1s ease", opacity: 0.85 }} />
        <div style={{ position: "absolute", left: `${bPct}%`, top: "-3px", bottom: "-3px", width: "2px", background: "#0f172a", borderRadius: "1px", zIndex: 2 }} title={`Benchmark: ${benchmark}`} />
        <span style={{ position: "absolute", left: `${bPct}%`, top: "-16px", transform: "translateX(-50%)", fontSize: "9px", color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>{benchmark}</span>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [profile, setProfile] = useState<UserProfile>({ companySize: null, role: null, organization: "", firstName: "", lastName: "", email: "" });
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [microInsight, setMicroInsight] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [utmParams, setUtmParams] = useState({ utmSource: "", utmMedium: "", utmCampaign: "" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    setUtmParams({ utmSource: p.get("utm_source") || "", utmMedium: p.get("utm_medium") || "", utmCampaign: p.get("utm_campaign") || "" });
    const token = p.get("resume");
    if (token) resumeFromToken(token);
  }, []);

  const resumeFromToken = async (token: string) => {
    try {
      const res = await fetch(`/api/assessment/partial?token=${token}`);
      if (res.ok) { const d = await res.json(); if (d.success && d.partial) { const p = d.partial; setProfile({ companySize: p.companySize, role: p.role, organization: p.organization||"", firstName: p.firstName||"", lastName: p.lastName||"", email: p.email||"" }); setAnswers(p.answersSoFar||{}); setEmailCaptured(true); if (p.companySize) { setQuestions(getQuestionsForSize(p.companySize)); setQIndex(p.currentQuestion||5); } setStage("questions-2"); } }
    } catch { /* fresh */ }
  };

  useEffect(() => { if (profile.companySize) setQuestions(getQuestionsForSize(profile.companySize)); }, [profile.companySize]);

  const totalQ = questions.length || 10;
  const answered = Object.keys(answers).length;
  const pct = Math.round((answered / totalQ) * 100);

  useEffect(() => {
    if (stage !== "analyzing") return;
    const iv = setInterval(() => { setAnalyzingStep(p => { if (p >= ANALYZING_STEPS.length - 1) { clearInterval(iv); return p; } return p + 1; }); }, 600);
    return () => clearInterval(iv);
  }, [stage]);

  const handleAnswer = useCallback((qId: string, val: number) => {
    const newA = { ...answers, [qId]: val };
    setAnswers(newA);
    const q = questions.find(x => x.id === qId);
    if (q && profile.companySize) setMicroInsight(generateMicroInsight(q, val, profile.companySize));
    setTimeout(() => {
      setMicroInsight(null);
      const next = qIndex + 1;
      if (next === 5 && !emailCaptured) { setStage("mid-capture"); return; }
      if (next >= questions.length) { if (!emailCaptured) setStage("final-capture"); else submitAssessment(newA); return; }
      setQIndex(next);
    }, 2200);
  }, [answers, qIndex, questions, profile.companySize, emailCaptured]);

  const savePartial = async () => {
    try { await fetch("/api/assessment/partial", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: profile.email, firstName: profile.firstName, lastName: profile.lastName, organization: profile.organization, companySize: profile.companySize, role: profile.role, answersSoFar: answers, currentQuestion: qIndex, ...utmParams }) }); } catch {}
  };

  const buildLocal = (fa: Record<string, number>): Results => {
    const os = calculateOverallScore(fa);
    const ds: Record<string, number> = {};
    questions.forEach(q => { if (fa[q.id] !== undefined) ds[q.dimension] = fa[q.id]; });
    const sorted = Object.entries(ds).sort(([,a],[,b]) => a - b);
    const w = sorted[0]?.[0] || "Data Foundation", s = sorted[sorted.length-1]?.[0] || "Strategic Alignment";
    const sz = profile.companySize || "11-50";
    return { overallScore: os, dimensionScores: ds, weakestDimension: w, strongestDimension: s, leadScore: "warm", reportBranding: REPORT_BRANDING[sz], priorityActions: PRIORITY_ACTIONS[w] || ["Focus on building foundations."], serviceRecommendations: sorted.filter(([,v])=>v<3).slice(0,3).map(([d])=>({dimension:d,...(DIMENSION_SERVICE_MAP[d]||{service:"AI Strategy Session",description:"Personalized guidance.",deliverable:"Action plan"})})), benchmarks: Object.fromEntries(questions.map(q=>[q.dimension,q.benchmarks[sz]])) };
  };

  const submitAssessment = async (fa: Record<string, number>) => {
    setStage("analyzing"); setAnalyzingStep(0);
    const safety = setTimeout(() => { setResults(p => p || buildLocal(fa)); setStage("results"); }, 5000);
    try {
      const res = await fetch("/api/assessment/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ firstName: profile.firstName, lastName: profile.lastName, email: profile.email, organization: profile.organization, companySize: profile.companySize, role: profile.role, answers: fa, ...utmParams }) });
      if (!res.ok) throw new Error(`${res.status}`);
      const d = await res.json();
      if (d.success) { clearTimeout(safety); setResults({ overallScore: d.overallScore, dimensionScores: d.dimensionScores, weakestDimension: d.weakestDimension, strongestDimension: d.strongestDimension, leadScore: d.leadScore, reportBranding: d.reportBranding, priorityActions: d.priorityActions, serviceRecommendations: d.serviceRecommendations, benchmarks: d.benchmarks }); setTimeout(() => setStage("results"), 4000); }
      else { clearTimeout(safety); setResults(buildLocal(fa)); setTimeout(() => setStage("results"), 4000); }
    } catch { clearTimeout(safety); setResults(buildLocal(fa)); setTimeout(() => setStage("results"), 4000); }
  };

  const handleShare = () => {
    if (!results) return;
    const t = `I scored ${results.overallScore}/100 on the JMCB AI Readiness Assessment.\n\nTake the free assessment: jmcbtech.com/assessment`;
    if (navigator.share) navigator.share({ title: "AI Readiness Score", text: t, url: "https://jmcbtech.com/assessment" });
    else { navigator.clipboard.writeText(t); alert("Copied to clipboard!"); }
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [stage, qIndex]);

  const currentQ = questions[qIndex];
  const phaseColor = currentQ ? (PHASE_COLORS[currentQ.ascendPhase] || "#d97706") : "#d97706";

  // ── INPUT STYLE ──
  const inputStyle = "w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16 pt-28">
        <AnimatePresence mode="wait">

          {/* ═══ INTRO ═══ */}
          {stage === "intro" && (
            <motion.div key="intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,y:-20}} className="animate-fade-in">
              <div className="text-center mb-10">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">Executive Assessment</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">AI Readiness Assessment</h1>
                <p className="text-lg text-accent font-medium mb-4">Ready for agentic AI? Start with the right workflows and guardrails.</p>
                <p className="text-gray-500 max-w-lg mx-auto">Assess your data, processes, and risk exposure, then get a recommended starting point and rollout plan via the JMCB ASCEND™ methodology.</p>
              </div>

              {/* ASCEND Framework */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
                <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">The JMCB ASCEND™ Framework</p>
                <p className="text-gray-700 text-sm mb-4">A practical path to deploy agentic AI safely, starting with the workflows that matter most.</p>
                <div className="space-y-3 text-sm">
                  {ASCEND_ITEMS.map(item => (
                    <div key={item.letter} className="flex gap-3">
                      <span className="font-bold text-accent w-6">{item.letter}</span>
                      <div><strong>{item.word}</strong> — {item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-8 mb-8 flex-wrap">
                {[{v:"10",l:"Questions"},{v:"5",l:"Minutes"},{v:"Free",l:"Report"}].map((s,i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{s.v}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button onClick={() => setStage("profiling")} className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  Start Your Assessment <span>→</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ PROFILING ═══ */}
          {stage === "profiling" && (
            <motion.div key="prof" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} className="animate-fade-in">
              <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">Before We Begin</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your organization</h2>
              <p className="text-gray-500 text-sm mb-8">We'll tailor the assessment and benchmarks to companies like yours.</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization name</label>
                <input className={inputStyle} type="text" placeholder="Acme Corporation" value={profile.organization} onChange={e => setProfile({...profile, organization: e.target.value})} />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">How many employees?</label>
                <div className="grid grid-cols-2 gap-3">
                  {COMPANY_SIZES.map(s => (
                    <button key={s.value} onClick={() => setProfile({...profile, companySize: s.value})}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${profile.companySize === s.value ? "border-accent bg-amber-50 text-accent" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your role</label>
                <div className="space-y-2">
                  {ROLES.map(r => (
                    <button key={r.value} onClick={() => setProfile({...profile, role: r.value})}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${profile.role === r.value ? "border-accent bg-amber-50 text-accent" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button disabled={!profile.companySize || !profile.role} onClick={() => { setQIndex(0); setStage("questions"); }}
                className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition disabled:opacity-50">
                Begin Assessment
              </button>
            </motion.div>
          )}

          {/* ═══ QUESTIONS ═══ */}
          {(stage === "questions" || stage === "questions-2") && currentQ && (
            <motion.div key={`q-${qIndex}`} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}} transition={{duration:0.3}}>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Question {qIndex + 1} of {totalQ}</span>
                  <span className="font-semibold text-accent">{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: phaseColor }} />
                </div>
              </div>

              {/* ASCEND Phase Badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: phaseColor }}>
                  ASCEND: {currentQ.ascendPhase}
                </div>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500 font-medium">{currentQ.dimension}</span>
              </div>

              {/* ASCEND Phase Description */}
              <div className="mb-5 px-4 py-3 rounded-lg border-l-4" style={{ borderColor: phaseColor, background: `${phaseColor}08` }}>
                <p className="text-xs text-gray-600">
                  <strong style={{ color: phaseColor }}>{currentQ.ascendPhase}</strong> — {ASCEND_ITEMS.find(a => a.word === currentQ.ascendPhase || a.word.toLowerCase() === currentQ.ascendPhase.toLowerCase())?.desc || "Evaluating this dimension of your AI readiness."}
                </p>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">{currentQ.questionText}</h2>

              <button onClick={() => setShowHelp(!showHelp)} className="text-xs text-gray-400 hover:text-gray-600 mb-5 flex items-center gap-1">
                {showHelp ? "▲ Hide details" : "▼ Why this matters"}
              </button>

              <AnimatePresence>
                {showHelp && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden mb-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 leading-relaxed border border-gray-100">{currentQ.helpText}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3 mb-6">
                {currentQ.options.map(opt => {
                  const sel = answers[currentQ.id] === opt.value;
                  return (
                    <button key={opt.value} onClick={() => handleAnswer(currentQ.id, opt.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${sel ? "border-accent bg-amber-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${sel ? "bg-accent text-white" : "bg-gray-100 text-gray-500"}`}>{opt.value}</div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{opt.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {microInsight && (
                  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                    ✓ {microInsight}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══ MID-CAPTURE ═══ */}
          {stage === "mid-capture" && (
            <motion.div key="mid" initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="animate-fade-in">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">You're halfway through.</h2>
                <p className="text-gray-500 text-sm mb-6">Save your progress and get your full ASCEND report when you finish.</p>
                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <input className={inputStyle} placeholder="First name" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} />
                    <input className={inputStyle} placeholder="Last name" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} />
                  </div>
                  <input className={inputStyle} type="email" placeholder="Work email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                </div>
                <div className="flex gap-3">
                  <button disabled={!profile.email || !profile.firstName} onClick={() => { setEmailCaptured(true); savePartial(); setQIndex(5); setStage("questions-2"); }}
                    className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition disabled:opacity-50">Save & Continue</button>
                  <button onClick={() => { setQIndex(5); setStage("questions-2"); }}
                    className="px-6 py-3 border border-gray-200 text-gray-500 font-medium rounded-lg hover:bg-gray-50 transition">Skip</button>
                </div>
                <p className="text-xs text-gray-400 mt-4">We never share your information.</p>
              </div>
            </motion.div>
          )}

          {/* ═══ FINAL CAPTURE ═══ */}
          {stage === "final-capture" && (
            <motion.div key="final" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="animate-fade-in">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost there.</h2>
                <p className="text-gray-500 text-sm mb-6">Enter your details to receive your AI Readiness Report.</p>
                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <input className={inputStyle} placeholder="First name" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} />
                    <input className={inputStyle} placeholder="Last name" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} />
                  </div>
                  <input className={inputStyle} type="email" placeholder="Work email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                </div>
                <button disabled={!profile.email || !profile.firstName} onClick={() => { setEmailCaptured(true); submitAssessment(answers); }}
                  className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition disabled:opacity-50">Get My Report</button>
              </div>
            </motion.div>
          )}

          {/* ═══ ANALYZING ═══ */}
          {stage === "analyzing" && (
            <motion.div key="analyzing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full border-4 border-gray-200 border-t-accent animate-spin" />
              <h2 className="text-xl font-bold text-gray-900 mb-6">Analyzing your responses...</h2>
              <div className="max-w-sm mx-auto space-y-3 text-left">
                {ANALYZING_STEPS.map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 transition-opacity duration-300 ${i <= analyzingStep ? "opacity-100" : "opacity-30"}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ${i < analyzingStep ? "bg-green-500" : i === analyzingStep ? "bg-accent" : "bg-gray-200"}`}>
                      {i < analyzingStep ? "✓" : ""}
                    </div>
                    <span className="text-sm text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ RESULTS ═══ */}
          {stage === "results" && results && (
            <motion.div key="results" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.6}}>
              {/* Report Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-accent">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">JMCB Technology Group</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">AI Readiness Assessment Report</h1>
                <p className="text-sm text-gray-500">Prepared for {profile.organization || "Your Organization"} · {new Date().toLocaleDateString("en-US", {year:"numeric",month:"long",day:"numeric"})}</p>
              </div>

              {/* Overall Level - Vizient style */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <DonutChart score={results.overallScore} max={100} color={results.overallScore >= 70 ? "#059669" : results.overallScore >= 40 ? "#d97706" : "#dc2626"} size={150} label="Overall" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="text-lg font-bold text-gray-900">Overall Readiness</h2>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${results.overallScore >= 70 ? "bg-green-100 text-green-800" : results.overallScore >= 40 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                        {results.overallScore >= 80 ? "AI Leader" : results.overallScore >= 60 ? "AI Ready" : results.overallScore >= 40 ? "AI Emerging" : "AI Exploring"}
                      </span>
                    </div>
                    {/* Mini bars for all dimensions sorted */}
                    {Object.entries(results.dimensionScores).sort(([,a],[,b]) => b - a).map(([dim, score]) => (
                      <div key={dim} className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-gray-500 w-32 truncate">{dim}</span>
                        <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
                          <div className="h-full rounded" style={{ width: `${(score/5)*100}%`, background: dim === results.weakestDimension ? "#dc2626" : dim === results.strongestDimension ? "#059669" : "#d97706", transition: "width 1s ease" }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-6 text-right">{score.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Findings */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Strongest Area</p>
                  <p className="text-base font-bold text-green-900">{results.strongestDimension}</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">{results.dimensionScores[results.strongestDimension]?.toFixed(1)}<span className="text-sm font-normal text-green-500">/5.0</span></p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Priority Gap</p>
                  <p className="text-base font-bold text-red-900">{results.weakestDimension}</p>
                  <p className="text-2xl font-bold text-red-700 mt-1">{results.dimensionScores[results.weakestDimension]?.toFixed(1)}<span className="text-sm font-normal text-red-500">/5.0</span></p>
                </div>
              </div>

              {/* Domain Breakdown - Vizient style grouped by ASCEND */}
              {ASCEND_DOMAINS.map(domain => {
                const dims = domain.dimensions.filter(d => results.dimensionScores[d] !== undefined);
                if (dims.length === 0) return null;
                const avg = dims.reduce((sum, d) => sum + (results.dimensionScores[d] || 0), 0) / dims.length;
                return (
                  <div key={domain.phase} className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <DonutChart score={parseFloat(avg.toFixed(1))} max={5} color={domain.color} size={80} label="Level" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: domain.color }}>{domain.icon} {domain.label}</p>
                        <p className="text-sm text-gray-500 mt-0.5">ASCEND Phase: {domain.phase}</p>
                      </div>
                    </div>
                    {dims.map(dim => (
                      <HBar key={dim} label={dim} score={results.dimensionScores[dim]} benchmark={results.benchmarks[dim] || 2.5} color={domain.color} />
                    ))}
                  </div>
                );
              })}

              {/* Priority Action */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
                <h3 className="text-base font-bold text-amber-900 mb-2">⚡ Your #1 Priority Action</h3>
                <p className="text-sm text-amber-700 mb-3">Based on your <strong>{results.weakestDimension}</strong> score:</p>
                <div className="bg-white border border-amber-200 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">{results.priorityActions[0]}</div>
              </div>

              {/* CTA */}
              <div className="bg-gray-900 rounded-2xl p-8 text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Ready to close the gaps?</h3>
                <p className="text-sm text-gray-400 mb-5">Book a free 30-minute AI Strategy Call. We'll review your results and build a concrete action plan.</p>
                <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition">Book Your Free Strategy Call →</a>
              </div>

              {/* PDF notice */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-1">Your Full ASCEND Report</h3>
                {emailCaptured ? (
                  <p className="text-sm text-green-600">Your detailed PDF report will arrive in your inbox within 5 minutes.</p>
                ) : (
                  <div className="flex gap-2 max-w-sm mx-auto mt-3">
                    <input className={inputStyle + " flex-1"} type="email" placeholder="Your email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                    <button disabled={!profile.email} onClick={() => { setEmailCaptured(true); submitAssessment(answers); }} className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg disabled:opacity-50">Send</button>
                  </div>
                )}
              </div>

              {/* Services */}
              {results.serviceRecommendations.length > 0 && (
                <div className="border border-gray-200 rounded-2xl p-6 mb-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">How JMCB Can Help</h3>
                  {results.serviceRecommendations.map(svc => (
                    <div key={svc.dimension} className="bg-gray-50 rounded-lg p-4 mb-3 last:mb-0">
                      <p className="text-xs font-bold text-red-600 uppercase mb-1">Gap: {svc.dimension}</p>
                      <p className="text-sm font-bold text-gray-900">{svc.service}</p>
                      <p className="text-xs text-gray-500 mt-1">{svc.description}</p>
                      <p className="text-xs text-accent font-medium mt-1">Deliverable: {svc.deliverable}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="text-center mb-8">
                <button onClick={handleShare} className="px-6 py-2 border border-gray-200 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                  Share Your Score on LinkedIn
                </button>
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-400">© 2026 JMCB Technology Group · jmcbtech.com</p>
                <p className="text-xs text-gray-400 mt-1">Powered by the JMCB ASCEND™ Framework</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {stage !== "results" && <Footer />}
    </div>
  );
}
