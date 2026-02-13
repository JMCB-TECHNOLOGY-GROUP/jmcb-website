"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ASSESSMENT_QUESTIONS,
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

// ============================================================
// TYPES
// ============================================================

type AssessmentStage =
  | "intro"
  | "profiling"
  | "questions"
  | "mid-capture"
  | "questions-2"
  | "final-capture"
  | "analyzing"
  | "results";

interface UserProfile {
  companySize: CompanySize | null;
  role: Role | null;
  organization: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AssessmentResults {
  overallScore: number;
  dimensionScores: Record<string, number>;
  weakestDimension: string;
  strongestDimension: string;
  leadScore: string;
  reportBranding: { title: string; subtitle: string; focus: string };
  priorityActions: string[];
  serviceRecommendations: Array<{
    dimension: string;
    service: string;
    description: string;
    deliverable: string;
  }>;
  benchmarks: Record<string, number>;
}

// ============================================================
// CONSTANTS
// ============================================================

const CALENDLY_LINK =
  "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

const COMPANY_SIZES: { value: CompanySize; label: string }[] = [
  { value: "1-10", label: "1 to 10 employees" },
  { value: "11-50", label: "11 to 50 employees" },
  { value: "51-200", label: "51 to 200 employees" },
  { value: "200+", label: "200+ employees" },
];

const ROLES: { value: Role; label: string }[] = [
  { value: "c-suite", label: "C-Suite (CEO, CTO, COO, etc.)" },
  { value: "vp", label: "Vice President" },
  { value: "director", label: "Director" },
  { value: "manager", label: "Manager" },
  { value: "business-owner", label: "Business Owner" },
  { value: "individual-contributor", label: "Individual Contributor" },
  { value: "consultant", label: "Consultant / Advisor" },
  { value: "student", label: "Student / Researcher" },
];

const ANALYZING_STEPS = [
  "Mapping responses to ASCEND framework...",
  "Calculating dimension scores...",
  "Benchmarking against industry data...",
  "Identifying priority gaps...",
  "Generating personalized insights...",
  "Building your readiness profile...",
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AssessmentPage() {
  const [stage, setStage] = useState<AssessmentStage>("intro");
  const [profile, setProfile] = useState<UserProfile>({
    companySize: null,
    role: null,
    organization: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [microInsight, setMicroInsight] = useState<string | null>(null);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [emailCaptured, setEmailCaptured] = useState(false);

  const [utmParams, setUtmParams] = useState({
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // ── INIT ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
    });

    const token = params.get("resume");
    if (token) resumeFromToken(token);
  }, []);

  const resumeFromToken = async (token: string) => {
    try {
      const res = await fetch(`/api/assessment/partial?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.partial) {
          const p = data.partial;
          setProfile({
            companySize: p.companySize,
            role: p.role,
            organization: p.organization || "",
            firstName: p.firstName || "",
            lastName: p.lastName || "",
            email: p.email || "",
          });
          setAnswers(p.answersSoFar || {});
          setEmailCaptured(true);
          if (p.companySize) {
            const qs = getQuestionsForSize(p.companySize);
            setQuestions(qs);
            setCurrentQuestionIndex(p.currentQuestion || 5);
          }
          setStage("questions-2");
        }
      }
    } catch {
      // Start fresh
    }
  };

  useEffect(() => {
    if (profile.companySize) {
      setQuestions(getQuestionsForSize(profile.companySize));
    }
  }, [profile.companySize]);

  const totalQuestions = questions.length || 10;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // ── ANALYZING ANIMATION ──
  useEffect(() => {
    if (stage !== "analyzing") return;
    const interval = setInterval(() => {
      setAnalyzingStep((prev) => {
        if (prev >= ANALYZING_STEPS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [stage]);

  // ── ANSWER HANDLER ──
  const handleAnswer = useCallback(
    (questionId: string, value: number) => {
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);

      const question = questions.find((q) => q.id === questionId);
      if (question && profile.companySize) {
        setMicroInsight(generateMicroInsight(question, value, profile.companySize));
      }

      setTimeout(() => {
        setMicroInsight(null);
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex === 5 && !emailCaptured) {
          setStage("mid-capture");
          return;
        }

        if (nextIndex >= questions.length) {
          if (!emailCaptured) {
            setStage("final-capture");
          } else {
            submitAssessment(newAnswers);
          }
          return;
        }

        setCurrentQuestionIndex(nextIndex);
      }, 2200);
    },
    [answers, currentQuestionIndex, questions, profile.companySize, emailCaptured]
  );

  // ── SAVE PARTIAL ──
  const savePartialCompletion = async () => {
    try {
      await fetch("/api/assessment/partial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          organization: profile.organization,
          companySize: profile.companySize,
          role: profile.role,
          answersSoFar: answers,
          currentQuestion: currentQuestionIndex,
          ...utmParams,
        }),
      });
    } catch {
      // Silent
    }
  };

  // ── SUBMIT ──
  const submitAssessment = async (finalAnswers: Record<string, number>) => {
    setStage("analyzing");
    setAnalyzingStep(0);

    try {
      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          organization: profile.organization,
          companySize: profile.companySize,
          role: profile.role,
          answers: finalAnswers,
          ...utmParams,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResults({
          overallScore: data.overallScore,
          dimensionScores: data.dimensionScores,
          weakestDimension: data.weakestDimension,
          strongestDimension: data.strongestDimension,
          leadScore: data.leadScore,
          reportBranding: data.reportBranding,
          priorityActions: data.priorityActions,
          serviceRecommendations: data.serviceRecommendations,
          benchmarks: data.benchmarks,
        });
        setTimeout(() => setStage("results"), 4000);
      }
    } catch (error) {
      console.error("Submit error:", error);
      // Fallback: calculate locally
      const overallScore = calculateOverallScore(finalAnswers);
      const dimensionScores: Record<string, number> = {};
      questions.forEach((q) => {
        if (finalAnswers[q.id]) dimensionScores[q.dimension] = finalAnswers[q.id];
      });
      const sorted = Object.entries(dimensionScores).sort(([, a], [, b]) => a - b);

      setResults({
        overallScore,
        dimensionScores,
        weakestDimension: sorted[0]?.[0] || "",
        strongestDimension: sorted[sorted.length - 1]?.[0] || "",
        leadScore: "warm",
        reportBranding: REPORT_BRANDING[profile.companySize || "11-50"],
        priorityActions: PRIORITY_ACTIONS[sorted[0]?.[0] || "Data Foundation"],
        serviceRecommendations: sorted
          .filter(([, s]) => s < 3)
          .slice(0, 3)
          .map(([dim]) => ({ dimension: dim, ...DIMENSION_SERVICE_MAP[dim] })),
        benchmarks: Object.fromEntries(
          questions.map((q) => [q.dimension, q.benchmarks[profile.companySize || "11-50"]])
        ),
      });
      setTimeout(() => setStage("results"), 4000);
    }
  };

  // ── SHARE ──
  const handleShare = () => {
    if (!results) return;
    const text = `I scored ${results.overallScore}/100 on the JMCB AI Readiness Assessment. How ready is YOUR organization for AI?\n\nTake the free assessment: jmcbtech.com/assessment`;
    if (navigator.share) {
      navigator.share({ title: "My AI Readiness Score", text, url: "https://jmcbtech.com/assessment" });
    } else {
      navigator.clipboard.writeText(text);
      alert("Share text copied to clipboard!");
    }
  };

  // ── SCROLL ON STAGE CHANGE ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage, currentQuestionIndex]);

  // ============================================================
  // STYLES (inline to avoid conflicts with main site Tailwind)
  // ============================================================

  const S = {
    root: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #1a1040 100%)",
      color: "#e2e8f0",
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: "antialiased" as const,
    },
    container: {
      maxWidth: "680px",
      margin: "0 auto",
      padding: "24px 20px",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center" as const,
    },
    containerTop: {
      maxWidth: "680px",
      margin: "0 auto",
      padding: "80px 20px 24px",
    },
    label: {
      fontSize: "13px",
      color: "#3b82f6",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
      marginBottom: "10px",
    },
    h1: {
      fontSize: "clamp(28px, 5vw, 42px)",
      fontWeight: 700,
      lineHeight: 1.15,
      marginBottom: "16px",
      background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h2: {
      fontSize: "clamp(22px, 4vw, 28px)",
      fontWeight: 600,
      lineHeight: 1.3,
      marginBottom: "12px",
      color: "#f1f5f9",
    },
    p: { fontSize: "15px", color: "#94a3b8", lineHeight: 1.65, marginBottom: "24px" },
    btnPrimary: {
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      color: "white",
      border: "none",
      padding: "14px 32px",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
    },
    btnSecondary: {
      background: "transparent",
      color: "#94a3b8",
      border: "1px solid #334155",
      padding: "12px 28px",
      borderRadius: "10px",
      fontSize: "15px",
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
    },
    input: {
      width: "100%",
      background: "rgba(15, 23, 42, 0.6)",
      border: "1px solid #1e293b",
      borderRadius: "10px",
      padding: "14px 18px",
      color: "#e2e8f0",
      fontSize: "16px",
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box" as const,
    },
    card: {
      background: "rgba(15, 23, 42, 0.5)",
      border: "1px solid #1e293b",
      borderRadius: "16px",
      padding: "28px",
      backdropFilter: "blur(12px)",
    },
    optionCard: (selected: boolean) => ({
      background: selected ? "rgba(59, 130, 246, 0.12)" : "rgba(15, 23, 42, 0.4)",
      border: `1.5px solid ${selected ? "#3b82f6" : "#1e293b"}`,
      borderRadius: "12px",
      padding: "18px 22px",
      cursor: "pointer",
      textAlign: "left" as const,
      width: "100%",
      color: "#e2e8f0",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      boxShadow: selected ? "0 0 20px rgba(59, 130, 246, 0.15)" : "none",
    }),
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div ref={containerRef} style={S.root}>
      {/* ── PROGRESS BAR ── */}
      {(stage === "questions" || stage === "questions-2" || stage === "mid-capture" || stage === "final-capture") && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
          <div style={{ height: "3px", background: "#0f172a", width: "100%" }}>
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                width: `${progressPercent}%`,
                transition: "width 0.5s ease",
                borderRadius: "0 2px 2px 0",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 20px",
              background: "rgba(10, 15, 30, 0.85)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
            }}
          >
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
              JMCB AI Readiness Assessment
            </span>
            <span style={{ fontSize: "13px", color: "#3b82f6", fontWeight: 600 }}>
              {progressPercent}% complete
            </span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ══════ INTRO ══════ */}
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ ...S.container, textAlign: "center" }}
          >
            <div
              style={{
                width: 56, height: 56, borderRadius: "14px",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                margin: "0 auto 28px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", fontWeight: 800, color: "white",
              }}
            >
              AI
            </div>
            <h1 style={S.h1}>How ready is your organization for AI?</h1>
            <p style={{ ...S.p, maxWidth: "520px", margin: "0 auto 36px" }}>
              Get a personalized diagnostic across 10 critical dimensions. In 5 minutes,
              you'll know exactly where you stand and what to do next.
            </p>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "8px 16px", borderRadius: "20px",
                background: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.15)",
                marginBottom: "36px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#3b82f6", fontWeight: 500 }}>
                Join 500+ organizations assessed
              </span>
            </div>
            <div>
              <button style={{ ...S.btnPrimary, fontSize: "17px", padding: "16px 40px" }} onClick={() => setStage("profiling")}>
                Start Your Assessment
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#475569", marginTop: "20px" }}>
              Free. Takes 5 minutes. Get your personalized ASCEND report.
            </p>
          </motion.div>
        )}

        {/* ══════ PROFILING ══════ */}
        {stage === "profiling" && (
          <motion.div
            key="profiling"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            style={S.container}
          >
            <p style={S.label}>Before we begin</p>
            <h2 style={S.h2}>Tell us about your organization</h2>
            <p style={{ fontSize: "15px", color: "#64748b", marginBottom: "32px" }}>
              We'll tailor the assessment and benchmarks to companies like yours.
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "block", marginBottom: "8px" }}>
                Organization name
              </label>
              <input
                style={S.input}
                type="text"
                placeholder="Acme Corporation"
                value={profile.organization}
                onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "block", marginBottom: "10px" }}>
                How many employees?
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {COMPANY_SIZES.map((size) => (
                  <button
                    key={size.value}
                    style={{ ...S.optionCard(profile.companySize === size.value), padding: "14px 16px" }}
                    onClick={() => setProfile({ ...profile, companySize: size.value })}
                  >
                    <span style={{ fontSize: "15px", fontWeight: 500 }}>{size.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "block", marginBottom: "10px" }}>
                Your role
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    style={{ ...S.optionCard(profile.role === r.value), padding: "12px 16px" }}
                    onClick={() => setProfile({ ...profile, role: r.value })}
                  >
                    <span style={{ fontSize: "15px" }}>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              style={{ ...S.btnPrimary, opacity: (!profile.companySize || !profile.role) ? 0.5 : 1 }}
              disabled={!profile.companySize || !profile.role}
              onClick={() => { setCurrentQuestionIndex(0); setStage("questions"); }}
            >
              Begin Assessment
            </button>
          </motion.div>
        )}

        {/* ══════ QUESTIONS ══════ */}
        {(stage === "questions" || stage === "questions-2") &&
          questions.length > 0 &&
          currentQuestionIndex < questions.length && (
            <motion.div
              key={`q-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              style={S.containerTop}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#3b82f6", fontWeight: 600, letterSpacing: "0.06em" }}>
                  QUESTION {currentQuestionIndex + 1} OF {questions.length}
                </span>
                <span
                  style={{
                    fontSize: "11px", color: "#475569",
                    background: "rgba(59, 130, 246, 0.1)",
                    padding: "3px 8px", borderRadius: "4px", fontWeight: 500,
                  }}
                >
                  {questions[currentQuestionIndex].ascendPhase}
                </span>
              </div>

              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px", fontWeight: 500 }}>
                Dimension: {questions[currentQuestionIndex].dimension}
              </p>

              <h2 style={S.h2}>{questions[currentQuestionIndex].questionText}</h2>

              <button
                onClick={() => setShowHelp(!showHelp)}
                style={{
                  background: "none", border: "none", color: "#64748b",
                  fontSize: "13px", cursor: "pointer", display: "flex",
                  alignItems: "center", gap: "6px", marginBottom: "20px",
                  fontFamily: "inherit", padding: "4px 0",
                }}
              >
                {showHelp ? "▲ Hide" : "▼ Why this matters"}
              </button>

              <AnimatePresence>
                {showHelp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden", marginBottom: "20px" }}
                  >
                    <div
                      style={{
                        padding: "16px 18px", borderRadius: "10px",
                        background: "rgba(59, 130, 246, 0.06)",
                        border: "1px solid rgba(59, 130, 246, 0.12)",
                        fontSize: "14px", lineHeight: 1.6, color: "#94a3b8",
                      }}
                    >
                      {questions[currentQuestionIndex].helpText}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {questions[currentQuestionIndex].options.map((option) => {
                  const isSelected = answers[questions[currentQuestionIndex].id] === option.value;
                  return (
                    <button
                      key={option.value}
                      style={S.optionCard(isSelected)}
                      onClick={() => handleAnswer(questions[currentQuestionIndex].id, option.value)}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                        <div
                          style={{
                            width: "28px", height: "28px", borderRadius: "8px",
                            border: `2px solid ${isSelected ? "#3b82f6" : "#334155"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, fontSize: "13px", fontWeight: 600,
                            color: isSelected ? "#3b82f6" : "#475569",
                          }}
                        >
                          {option.value}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: "15px", marginBottom: "4px", color: "#e2e8f0" }}>
                            {option.label}
                          </div>
                          <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {microInsight && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: "14px 18px", borderRadius: "10px",
                      background: "rgba(16, 185, 129, 0.06)",
                      border: "1px solid rgba(16, 185, 129, 0.15)",
                      fontSize: "14px", color: "#6ee7b7", lineHeight: 1.5,
                    }}
                  >
                    ✓ {microInsight}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        {/* ══════ MID-CAPTURE ══════ */}
        {stage === "mid-capture" && (
          <motion.div
            key="mid"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            style={S.container}
          >
            <div style={S.card}>
              <h2 style={{ ...S.h2, fontSize: "24px" }}>You're halfway through.</h2>
              <p style={{ fontSize: "15px", color: "#94a3b8", marginBottom: "28px", lineHeight: 1.6 }}>
                Enter your details to save your progress and receive your full personalized ASCEND report when you finish.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input style={S.input} type="text" placeholder="First name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                  <input style={S.input} type="text" placeholder="Last name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                </div>
                <input style={S.input} type="email" placeholder="Work email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  style={{ ...S.btnPrimary, opacity: (!profile.email || !profile.firstName) ? 0.5 : 1 }}
                  disabled={!profile.email || !profile.firstName}
                  onClick={() => { setEmailCaptured(true); savePartialCompletion(); setCurrentQuestionIndex(5); setStage("questions-2"); }}
                >
                  Save & Continue
                </button>
                <button style={S.btnSecondary} onClick={() => { setCurrentQuestionIndex(5); setStage("questions-2"); }}>
                  Skip for now
                </button>
              </div>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "16px" }}>
                We'll never share your information. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        )}

        {/* ══════ FINAL CAPTURE ══════ */}
        {stage === "final-capture" && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} style={S.container}>
            <div style={S.card}>
              <h2 style={{ ...S.h2, fontSize: "24px" }}>Almost there.</h2>
              <p style={{ fontSize: "15px", color: "#94a3b8", marginBottom: "24px", lineHeight: 1.6 }}>
                Enter your details to receive your personalized AI Readiness Report as a downloadable PDF.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input style={S.input} type="text" placeholder="First name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                  <input style={S.input} type="text" placeholder="Last name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                </div>
                <input style={S.input} type="email" placeholder="Work email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <button
                style={{ ...S.btnPrimary, opacity: (!profile.email || !profile.firstName) ? 0.5 : 1 }}
                disabled={!profile.email || !profile.firstName}
                onClick={() => { setEmailCaptured(true); submitAssessment(answers); }}
              >
                Get My Report
              </button>
            </div>
          </motion.div>
        )}

        {/* ══════ ANALYZING ══════ */}
        {stage === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ ...S.container, textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", margin: "0 auto 32px", borderRadius: "50%", border: "3px solid #1e293b", borderTopColor: "#3b82f6", animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 style={{ ...S.h2, fontSize: "22px", marginBottom: "24px" }}>
              Analyzing your responses across 10 dimensions...
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px", margin: "0 auto" }}>
              {ANALYZING_STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", opacity: i <= analyzingStep ? 1 : 0.3, transition: "opacity 0.4s ease" }}>
                  <div
                    style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      background: i < analyzingStep ? "#10b981" : i === analyzingStep ? "#3b82f6" : "#1e293b",
                      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", color: "white",
                    }}
                  >
                    {i < analyzingStep ? "✓" : ""}
                  </div>
                  <span style={{ fontSize: "14px", color: i <= analyzingStep ? "#e2e8f0" : "#475569" }}>{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══════ RESULTS ══════ */}
        {stage === "results" && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: "760px", margin: "0 auto", padding: "24px 20px 60px" }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "40px", paddingTop: "20px" }}>
              <p style={S.label}>Your AI Readiness Assessment</p>
              <h1 style={{ ...S.h1, fontSize: "clamp(26px, 5vw, 36px)" }}>
                {profile.organization ? `${profile.organization}'s Results` : "Your Results"}
              </h1>
              <p style={{ fontSize: "14px", color: "#64748b" }}>{results.reportBranding.title}</p>
            </div>

            {/* Score Gauge */}
            <div style={{ ...S.card, textAlign: "center", marginBottom: "24px", padding: "40px 28px" }}>
              <div style={{ width: "180px", height: "180px", margin: "0 auto 20px", position: "relative" }}>
                <svg viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={results.overallScore >= 70 ? "#10b981" : results.overallScore >= 40 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(results.overallScore / 100) * 314} 314`}
                  />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <div style={{ fontSize: "48px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{results.overallScore}</div>
                  <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>OUT OF 100</div>
                </div>
              </div>
              <div style={{
                fontSize: "18px", fontWeight: 600, marginBottom: "4px",
                color: results.overallScore >= 70 ? "#10b981" : results.overallScore >= 40 ? "#f59e0b" : "#ef4444",
              }}>
                {results.overallScore >= 80 ? "AI Leader" : results.overallScore >= 60 ? "AI Ready" : results.overallScore >= 40 ? "AI Emerging" : "AI Exploring"}
              </div>
            </div>

            {/* Strongest / Weakest */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div style={{ ...S.card, borderColor: "rgba(16, 185, 129, 0.25)", background: "rgba(16, 185, 129, 0.04)" }}>
                <div style={{ fontSize: "11px", color: "#10b981", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Strongest</div>
                <div style={{ fontSize: "17px", fontWeight: 600, color: "#10b981", marginBottom: "4px" }}>{results.strongestDimension}</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#6ee7b7" }}>{results.dimensionScores[results.strongestDimension]}/5</div>
              </div>
              <div style={{ ...S.card, borderColor: "rgba(239, 68, 68, 0.25)", background: "rgba(239, 68, 68, 0.04)" }}>
                <div style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Priority Gap</div>
                <div style={{ fontSize: "17px", fontWeight: 600, color: "#ef4444", marginBottom: "4px" }}>{results.weakestDimension}</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#fca5a5" }}>{results.dimensionScores[results.weakestDimension]}/5</div>
              </div>
            </div>

            {/* Dimension Breakdown */}
            <div style={{ ...S.card, marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f1f5f9", marginBottom: "20px" }}>Dimension Breakdown</h3>
              {Object.entries(results.dimensionScores).sort(([, a], [, b]) => a - b).map(([dim, score]) => {
                const benchmark = results.benchmarks[dim] || 2.5;
                const isW = dim === results.weakestDimension;
                const isS = dim === results.strongestDimension;
                const barColor = isW ? "#ef4444" : isS ? "#10b981" : "#3b82f6";
                return (
                  <div key={dim} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: isW ? "#fca5a5" : isS ? "#6ee7b7" : "#e2e8f0" }}>{dim}</span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ fontSize: "12px", color: "#475569" }}>Avg: {benchmark}</span>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: barColor }}>{score}/5</span>
                      </div>
                    </div>
                    <div style={{ height: "8px", background: "#0f172a", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                      <div style={{ position: "absolute", left: `${(benchmark / 5) * 100}%`, top: 0, bottom: 0, width: "2px", background: "#475569", zIndex: 2 }} />
                      <div style={{ height: "100%", background: barColor, borderRadius: "4px", width: `${(score / 5) * 100}%`, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Priority Action */}
            <div style={{ ...S.card, marginBottom: "24px", borderColor: "rgba(245, 158, 11, 0.2)", background: "rgba(245, 158, 11, 0.03)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f59e0b", marginBottom: "14px" }}>
                ⚡ Your Priority Action
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "16px", lineHeight: 1.6 }}>
                Based on your {results.weakestDimension} score, here's the ONE thing to focus on first:
              </p>
              <div style={{
                padding: "16px 18px", background: "rgba(245, 158, 11, 0.06)", borderRadius: "10px",
                border: "1px solid rgba(245, 158, 11, 0.12)", fontSize: "15px", lineHeight: 1.7, color: "#e2e8f0",
              }}>
                {results.priorityActions[0]}
              </div>
            </div>

            {/* CTA: Book Call */}
            <div style={{
              ...S.card, textAlign: "center", marginBottom: "24px", padding: "36px 28px",
              borderColor: "rgba(59, 130, 246, 0.2)",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%)",
            }}>
              <h3 style={{ fontSize: "22px", fontWeight: 600, color: "#f1f5f9", marginBottom: "10px" }}>Ready to close the gaps?</h3>
              <p style={{ fontSize: "15px", color: "#94a3b8", marginBottom: "24px", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 24px" }}>
                Book a free 30-minute AI Strategy Call. We'll dig into your results and build a concrete action plan.
              </p>
              <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" style={{ ...S.btnPrimary, display: "inline-block", textDecoration: "none", fontSize: "17px", padding: "16px 36px" }}>
                Book Your Free Strategy Call
              </a>
            </div>

            {/* PDF Report */}
            <div style={{ ...S.card, textAlign: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f1f5f9", marginBottom: "8px" }}>Download Your Full ASCEND Report</h3>
              {emailCaptured ? (
                <p style={{ fontSize: "14px", color: "#10b981" }}>Your report is being generated and will arrive in your inbox within 5 minutes.</p>
              ) : (
                <div style={{ maxWidth: "400px", margin: "0 auto", display: "flex", gap: "10px" }}>
                  <input style={{ ...S.input, flex: 1 }} type="email" placeholder="Enter your email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  <button style={{ ...S.btnPrimary, opacity: !profile.email ? 0.5 : 1 }} disabled={!profile.email} onClick={() => { setEmailCaptured(true); submitAssessment(answers); }}>
                    Send
                  </button>
                </div>
              )}
            </div>

            {/* Share */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <button style={{ ...S.btnSecondary, display: "inline-flex", alignItems: "center", gap: "8px" }} onClick={handleShare}>
                Share Your Score on LinkedIn
              </button>
            </div>

            {/* Services */}
            {results.serviceRecommendations.length > 0 && (
              <div style={{ ...S.card, marginBottom: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f1f5f9", marginBottom: "16px" }}>How JMCB Can Help</h3>
                {results.serviceRecommendations.map((svc) => (
                  <div key={svc.dimension} style={{ padding: "16px", borderRadius: "10px", background: "rgba(15, 23, 42, 0.5)", border: "1px solid #1e293b", marginBottom: "12px" }}>
                    <div style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>Gap: {svc.dimension}</div>
                    <div style={{ fontSize: "16px", fontWeight: 600, color: "#e2e8f0", marginBottom: "6px" }}>{svc.service}</div>
                    <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "8px" }}>{svc.description}</p>
                    <div style={{ fontSize: "12px", color: "#3b82f6", fontWeight: 500 }}>Deliverable: {svc.deliverable}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div style={{ textAlign: "center", padding: "24px 0", borderTop: "1px solid #1e293b", marginTop: "20px" }}>
              <p style={{ fontSize: "13px", color: "#475569" }}>JMCB Technology Group | AI Strategy & Implementation</p>
              <p style={{ fontSize: "12px", color: "#334155", marginTop: "4px" }}>jmcbtech.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
