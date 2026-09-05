"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Upload,
  Users,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  COACH_NAME,
  HANDOFF_KEY,
  RUBRIC,
  buildPersona,
  buildQuestionPlan,
  buildCvFacts,
  type CoachHandoff,
  type CoachSession,
  type CoachQuestion,
  type Turn,
  type AnswerScore,
  type Debrief,
} from "@/lib/interview-coach";
import { validateResumeFile, ACCEPTED_EXTENSIONS, type ResumeExtraction } from "@/lib/resume";

// The Interview Coach. Everything deterministic (persona, question plan,
// averages) is built in the browser from lib/interview-coach.ts; the two
// routes score answers and write the debrief. Career Compass hands over its
// CV extraction and answers through sessionStorage so nobody uploads twice.

type Stage = "intro" | "setup" | "reading" | "interview" | "debriefing" | "debrief";

// Draft pricing. Every tier is priced; the only free thing is the assessment
// that feeds it. Change here and nowhere else.
const PRICING = [
  {
    name: "Individual",
    price: "Included",
    note: "in the Residency ($1,500) and Lab Bench ($199/mo)",
    audience: "Job seekers",
    points: ["Unlimited sessions against your own CV", "Every debrief kept, so you can see the trend", "Your rewritten answers, ready to practise"],
  },
  {
    name: "Coach",
    price: "$149/mo",
    note: "up to 20 active candidates",
    audience: "Careers coaches and outplacement",
    points: ["Send a candidate a link, get the coach notes back", "Rubric scores per candidate, per session", "Your name on the debrief"],
    featured: true,
  },
  {
    name: "Team",
    price: "$499/mo",
    note: "up to 100 candidates, own branding",
    audience: "HR, talent and L&D teams",
    points: ["Internal mobility and pre-interview prep at scale", "Your own question bank alongside ours", "Aggregate view: where your candidates fall down"],
  },
];

type DebriefResult = Debrief & {
  summary: string;
  fixes: string[];
  rewrittenAnswers: { questionId: string; question: string; answer: string }[];
  coachNotes: string;
  generated: boolean;
  recorded?: boolean;
};

export default function InterviewCoachPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [handoff, setHandoff] = useState<CoachHandoff | null>(null);

  // setup
  const [targetTitle, setTargetTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [cvText, setCvText] = useState("");
  const [extraction, setExtraction] = useState<ResumeExtraction | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [answers, setAnswers] = useState<Record<string, number> | undefined>(undefined);
  const [setupError, setSetupError] = useState("");
  const [cvName, setCvName] = useState("");

  // interview
  const [session, setSession] = useState<CoachSession | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [current, setCurrent] = useState<CoachQuestion | null>(null);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [lastScore, setLastScore] = useState<AnswerScore | null>(null);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [answeringFollowUp, setAnsweringFollowUp] = useState(false);
  const [turnError, setTurnError] = useState("");

  // debrief
  const [debrief, setDebrief] = useState<DebriefResult | null>(null);
  const [email, setEmail] = useState("");
  const [coachRef, setCoachRef] = useState("");
  const [website, setWebsite] = useState("");
  const [formStartedAt] = useState(() => Date.now());

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(HANDOFF_KEY);
      if (!raw) return;
      const h = JSON.parse(raw) as CoachHandoff;
      setHandoff(h);
      if (h.targetTitle) setTargetTitle(h.targetTitle);
      if (h.firstName) setFirstName(h.firstName);
      if (h.extraction) setExtraction(h.extraction);
      if (h.cvText) setSourceText(h.cvText);
      if (h.answers) setAnswers(h.answers);
    } catch {
      /* no handoff, or storage blocked: the setup form still works */
    }
  }, []);

  // ── setup ──
  async function readCv(payload: { fileBase64?: string; fileName?: string; text?: string }, label: string) {
    setStage("reading");
    setSetupError("");
    setCvName(label);
    try {
      const res = await fetch("/api/career-assessment/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, targetTitle, targetRole: handoff?.targetField }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We couldn't read that.");
      setExtraction(data.extraction ?? null);
      setSourceText(data.sourceText ?? "");
      if (!firstName && data.extraction?.contact?.firstName) setFirstName(data.extraction.contact.firstName);
      setStage("setup");
    } catch (err) {
      setSetupError(err instanceof Error ? err.message : "We couldn't read that file.");
      setStage("setup");
    }
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    const problem = validateResumeFile(file);
    if (problem) {
      setSetupError(problem);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = String(reader.result).split(",")[1] ?? "";
      readCv({ fileBase64: b64, fileName: file.name }, file.name);
    };
    reader.onerror = () => setSetupError("We couldn't open that file. Try pasting the text instead.");
    reader.readAsDataURL(file);
  }

  function startInterview() {
    if (targetTitle.trim().length < 2) {
      setSetupError("Tell us the role first. The interviewer needs to know what they're hiring for.");
      return;
    }
    const questions = buildQuestionPlan({ targetTitle: targetTitle.trim(), extraction: extraction ?? undefined, answers });
    const s: CoachSession = {
      targetTitle: targetTitle.trim(),
      targetField: handoff?.targetField,
      firstName: firstName.trim() || undefined,
      persona: buildPersona(targetTitle.trim(), extraction?.industries ?? []),
      cvFacts: buildCvFacts(extraction),
      cvText: sourceText || undefined,
      questions,
    };
    setSession(s);
    setTurns([]);
    setCurrent(questions[0]);
    setDraft("");
    setLastScore(null);
    setFollowUp(null);
    setStage("interview");
  }

  // ── interview ──
  async function submitAnswer() {
    if (!session || !current || draft.trim().length === 0) return;
    setPending(true);
    setTurnError("");
    const isFollowUp = answeringFollowUp;
    const priorTurn = isFollowUp ? turns.find((t) => t.questionId === current.id) : undefined;
    const combined = isFollowUp && priorTurn ? `${priorTurn.answer}\n\n${draft.trim()}` : draft.trim();
    try {
      const res = await fetch("/api/interview-coach/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session,
          turns: turns.filter((t) => t.questionId !== current.id),
          questionId: current.id,
          answer: combined,
          isFollowUp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We couldn't score that.");
      const score: AnswerScore = data.score;
      const turn: Turn = isFollowUp && priorTurn
        ? { ...priorTurn, followUpAnswer: draft.trim(), score }
        : { questionId: current.id, question: current.text, answer: draft.trim(), score, followUp: data.followUp ?? undefined };
      setTurns((prev) => [...prev.filter((t) => t.questionId !== current.id), turn]);
      setLastScore(score);
      setDraft("");
      if (!isFollowUp && data.followUp) {
        setFollowUp(data.followUp);
        setAnsweringFollowUp(true);
      } else {
        setFollowUp(null);
        setAnsweringFollowUp(false);
      }
    } catch (err) {
      setTurnError(err instanceof Error ? err.message : "We couldn't score that answer.");
    } finally {
      setPending(false);
    }
  }

  function nextQuestion() {
    if (!session || !current) return;
    const idx = session.questions.findIndex((q) => q.id === current.id);
    const next = session.questions[idx + 1];
    setLastScore(null);
    setFollowUp(null);
    setAnsweringFollowUp(false);
    setDraft("");
    if (next) setCurrent(next);
    else finish();
  }

  async function finish(contact?: { email: string }) {
    if (!session) return;
    setStage("debriefing");
    try {
      const res = await fetch("/api/interview-coach/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session,
          turns,
          contact: contact ? { firstName: firstName || undefined, email: contact.email } : undefined,
          coachRef: coachRef || undefined,
          website,
          formStartedAt,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We couldn't build the debrief.");
      setDebrief(data);
    } catch (err) {
      setTurnError(err instanceof Error ? err.message : "We couldn't build the debrief.");
    } finally {
      setStage("debrief");
    }
  }

  const field = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent";
  const questionNumber = session && current ? session.questions.findIndex((q) => q.id === current.id) + 1 : 0;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* ===== INTRO ===== */}
        {stage === "intro" && (
          <>
            <section className="bg-primary text-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
                <MessageSquare className="w-10 h-10 text-accent mb-6" />
                <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-4">
                  Six questions · 20 minutes · built from your CV
                </p>
                <h1 className="font-display text-5xl font-bold mb-6">{COACH_NAME}</h1>
                <p className="text-2xl text-gray-100 leading-snug mb-6 max-w-2xl">
                  Practise with a hiring manager who has read your CV, and will ask about the line with no number on it.
                </p>
                <p className="text-gray-300 leading-relaxed max-w-2xl mb-10">
                  Generic mock interviews ask generic questions. This one interviews you from your own CV and the role you
                  are actually going for. It picks the claims you can&rsquo;t yet prove, asks for the working behind the
                  figures you can, scores every answer on the same four lines a real panel uses, and rewrites your weakest
                  answers the way a strong candidate would say them. Nothing in it is invented: every suggested answer
                  is built only from what you said and what your CV shows.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setStage("setup")} className="btn-primary text-base">
                    {handoff?.extraction ? "Start with my Career Compass CV" : "Start a session"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  {!handoff && (
                    <Link href="/career-assessment" className="btn-outline-white text-base">
                      Do Career Compass first
                    </Link>
                  )}
                </div>
                {handoff?.extraction && (
                  <p className="text-sm text-gray-300 mt-6 inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" /> We have your CV and your Compass answers from a moment
                    ago. No need to upload again.
                  </p>
                )}
              </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-8">How a session runs</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  ["It reads your CV", "Skills, the achievements that carry a number, the claims that don't, and what the target role expects that the CV doesn't show."],
                  ["It asks the hard six", "An opener, your unproven claims, the working behind your figures, the gap the role will notice, and a closer that tests whether you know your worth."],
                  ["It scores and rewrites", "Structure, evidence, relevance and concision, one to five, every answer. Then your two weakest answers rewritten in your own facts, with [X] where only you know the figure."],
                ].map(([h, p]) => (
                  <div key={h}>
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{h}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{p}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== FOR COACHES AND HR ===== */}
            <section className="bg-gray-50 border-y border-gray-200">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-accent" />
                  <p className="text-xs tracking-widest uppercase text-accent font-semibold">For coaches and HR teams</p>
                </div>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                  Your candidates practise. You get the notes.
                </h2>
                <p className="text-gray-600 leading-relaxed max-w-2xl mb-10">
                  Send someone a link before their interview. They practise against their own CV; you receive a coach
                  debrief: rubric scores, the habit that cost them most, and what to work on with them. Employers use it
                  for internal mobility, so the people you already have stop losing to outside candidates on interview
                  technique alone.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {PRICING.map((t) => (
                    <div key={t.name} className={`rounded-2xl border p-6 bg-white ${t.featured ? "border-accent" : "border-gray-200"}`}>
                      <p className="text-xs tracking-widest uppercase text-gray-500 font-semibold mb-1">{t.audience}</p>
                      <h3 className="font-display text-2xl font-bold text-gray-900">{t.name}</h3>
                      <p className="text-3xl font-bold text-gray-900 mt-3">{t.price}</p>
                      <p className="text-xs text-gray-500 mb-5">{t.note}</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {t.points.map((p) => (
                          <li key={p} className="flex gap-2">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <Link href="/contact" className="btn-primary text-base">
                    Talk to Jermaine about a licence <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button onClick={() => setStage("setup")} className="btn-outline text-base">
                    Try a session yourself
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ===== SETUP ===== */}
        {(stage === "setup" || stage === "reading") && (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
            <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-3">Before we start</p>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">Who is interviewing you, and for what?</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              The interviewer takes the role you name. With a CV, the questions come from your own lines. Without one,
              you still get six that force evidence.
            </p>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="targetTitle">The exact job title</label>
                <input id="targetTitle" className={field} value={targetTitle} onChange={(e) => setTargetTitle(e.target.value)} placeholder="e.g. Operations Coordinator" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="firstName">First name <span className="text-gray-400 font-normal">optional</span></label>
                <input id="firstName" className={field} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
            </div>

            {extraction ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
                <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-2">CV loaded{cvName ? `: ${cvName}` : ""}</p>
                <p className="text-sm text-gray-700">
                  {extraction.currentTitle && <strong>{extraction.currentTitle}</strong>}
                  {extraction.yearsExperience != null && ` · ${extraction.yearsExperience} years`}
                  {" · "}
                  {(extraction.quantifiedAchievements ?? []).length} lines with a number,{" "}
                  {(extraction.unquantifiedClaims ?? []).length} without. The interviewer will ask about those.
                </p>
                <button onClick={() => { setExtraction(null); setSourceText(""); setCvName(""); }} className="text-xs text-gray-500 hover:text-gray-900 mt-3 underline">
                  Use a different CV
                </button>
              </div>
            ) : (
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-900 mb-2">Your CV <span className="text-gray-400 font-normal">recommended</span></p>
                <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-accent cursor-pointer mb-3">
                  <Upload className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-sm text-gray-700">Drop or choose a file</span>
                  <span className="block text-xs text-gray-500 mt-1">PDF, Word, OpenDocument, RTF or text, under 2.5MB</span>
                  <input type="file" className="hidden" accept={ACCEPTED_EXTENSIONS} onChange={(e) => handleFile(e.target.files?.[0])} disabled={stage === "reading"} />
                </label>
                <textarea className={`${field} min-h-[120px]`} placeholder="Or paste your CV text here…" value={cvText} onChange={(e) => setCvText(e.target.value)} />
                <button onClick={() => readCv({ text: cvText }, "pasted CV")} disabled={cvText.trim().length < 50 || stage === "reading"} className="btn-outline text-sm mt-3 disabled:opacity-50">
                  Use this text
                </button>
              </div>
            )}

            {stage === "reading" && (
              <p className="text-sm text-gray-600 inline-flex items-center gap-2 mb-6"><Loader2 className="w-4 h-4 animate-spin" /> Reading {cvName}…</p>
            )}
            {setupError && (
              <p className="text-sm text-red-700 flex items-center gap-2 mb-6"><AlertCircle className="w-4 h-4" /> {setupError}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={startInterview} disabled={stage === "reading"} className="btn-primary text-base disabled:opacity-50">
                Start the interview <ArrowRight className="w-5 h-5" />
              </button>
              {!extraction && (
                <button onClick={startInterview} disabled={stage === "reading"} className="btn-outline text-base disabled:opacity-50">
                  Skip the CV
                </button>
              )}
            </div>
          </section>
        )}

        {/* ===== INTERVIEW ===== */}
        {stage === "interview" && session && current && (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
            <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-3">
              Question {questionNumber} of {session.questions.length} · {session.targetTitle}
            </p>
            <div className="border border-gray-200 rounded-2xl p-6 mb-6 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2 inline-flex items-center gap-1"><Briefcase className="w-3 h-3" /> Hiring manager</p>
              <p className="font-display text-2xl font-bold text-gray-900 leading-snug">{current.text}</p>
            </div>

            {lastScore && (
              <div className="rounded-2xl border border-accent p-6 mb-6 bg-white">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {RUBRIC.map((r) => (
                    <div key={r.key}>
                      <p className="text-xs text-gray-500">{r.label}</p>
                      <p className="font-bold text-gray-900">{lastScore[r.key]}<span className="text-gray-400 font-normal">/5</span></p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-800 leading-relaxed">{lastScore.note}</p>
                {lastScore.betterAnswer && (
                  <div className="bg-cream rounded-lg p-4 mt-4">
                    <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-2">How a strong candidate says it</p>
                    <p className="text-sm text-gray-800 leading-relaxed">{lastScore.betterAnswer}</p>
                  </div>
                )}
                <details className="mt-4">
                  <summary className="text-xs text-gray-500 cursor-pointer">Why this question was asked</summary>
                  <p className="text-sm text-gray-600 mt-2">{current.why}</p>
                  <p className="text-sm text-gray-600 mt-1"><strong>Looking for:</strong> {current.lookingFor}</p>
                </details>
              </div>
            )}

            {followUp && (
              <div className="border border-gray-200 rounded-2xl p-6 mb-6 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">Follow-up</p>
                <p className="font-semibold text-gray-900 leading-snug">{followUp}</p>
              </div>
            )}

            {(!lastScore || followUp) && (
              <>
                <textarea
                  className={`${field} min-h-[160px]`}
                  placeholder={followUp ? "Answer the follow-up…" : "Answer as you would out loud. Situation, what you did, what happened."}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={pending}
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">{draft.trim() ? draft.trim().split(/\s+/).length : 0} words</span>
                  <button onClick={submitAnswer} disabled={pending || draft.trim().length === 0} className="btn-primary text-sm disabled:opacity-50">
                    {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Scoring…</> : <>Answer <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </>
            )}

            {lastScore && !followUp && (
              <div className="flex justify-end mt-4">
                <button onClick={nextQuestion} className="btn-primary text-sm">
                  {questionNumber < session.questions.length ? "Next question" : "Finish and get my debrief"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {turnError && (
              <p className="text-sm text-red-700 flex items-center gap-2 mt-4"><AlertCircle className="w-4 h-4" /> {turnError}</p>
            )}
          </section>
        )}

        {/* ===== DEBRIEFING ===== */}
        {stage === "debriefing" && (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
            <p className="text-gray-700">Writing your debrief…</p>
          </section>
        )}

        {/* ===== DEBRIEF ===== */}
        {stage === "debrief" && session && (
          <>
            <section className="bg-primary text-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
                <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-4">Your debrief · {session.targetTitle}</p>
                {debrief ? (
                  <>
                    <div className="flex items-end gap-6 mb-6">
                      <span className="font-display text-7xl font-bold">{debrief.overall}</span>
                      <div className="pb-3">
                        <p className="text-2xl font-bold">{debrief.band.label}</p>
                        <p className="text-gray-300">out of 100</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-200 leading-relaxed whitespace-pre-wrap max-w-3xl">{debrief.summary}</p>
                  </>
                ) : (
                  <p className="text-gray-200">{turnError || "We couldn't build the debrief. Your answers are still on this page."}</p>
                )}
              </div>
            </section>

            {debrief && (
              <>
                <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                  <h2 className="font-display text-3xl font-bold text-gray-900 mb-8">The four lines a panel scores on</h2>
                  <div className="space-y-5">
                    {RUBRIC.map((r) => {
                      const v = debrief.averages[r.key];
                      return (
                        <div key={r.key}>
                          <div className="flex items-baseline justify-between mb-1.5">
                            <span className="font-semibold text-gray-900">{r.label}{r.key === debrief.weakest && <span className="text-xs text-accent ml-2">fix this first</span>}</span>
                            <span className="text-sm text-gray-500">{v}/5</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${(v / 5) * 100}%` }} />
                          </div>
                          <p className="text-sm text-gray-600 mt-1.5">{r.blurb}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="bg-gray-50 border-y border-gray-200">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                    <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">Before the real one</h2>
                    <ol className="space-y-3 mb-12">
                      {debrief.fixes.map((f, i) => (
                        <li key={i} className="flex gap-4 text-gray-800 leading-relaxed"><span className="font-display text-2xl font-bold text-accent leading-none">{i + 1}</span><span>{f}</span></li>
                      ))}
                    </ol>
                    {debrief.rewrittenAnswers.length > 0 && (
                      <>
                        <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Your weakest answers, rewritten</h3>
                        <p className="text-sm text-gray-600 mb-6">Only your facts. Where you see [X], that is a figure only you can supply, and it is the figure the interviewer wanted.</p>
                        <div className="space-y-5">
                          {debrief.rewrittenAnswers.map((r) => (
                            <div key={r.questionId} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                              <p className="text-sm text-gray-500 px-5 py-3 bg-gray-50">{r.question}</p>
                              <p className="text-gray-900 px-5 py-4 leading-relaxed">{r.answer}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </section>

                <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                  <details className="border border-gray-200 rounded-2xl p-6">
                    <summary className="font-semibold text-gray-900 cursor-pointer inline-flex items-center gap-2"><Users className="w-4 h-4 text-accent" /> For your coach or HR partner</summary>
                    <p className="text-gray-700 leading-relaxed mt-4">{debrief.coachNotes}</p>
                  </details>
                </section>

                {!debrief.recorded && (
                  <section className="bg-gray-50 border-y border-gray-200">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
                      <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Keep this debrief</h2>
                      <p className="text-gray-600 text-sm mb-6">We&rsquo;ll keep the scores against your name so the next session shows the trend. If a coach or employer sent you here, tell us who.</p>
                      <form onSubmit={(e) => { e.preventDefault(); if (email) finish({ email }); }} className="space-y-4">
                        <input type="email" required className={field} placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input className={field} placeholder="Practising for (coach, employer, or role) — optional" value={coachRef} onChange={(e) => setCoachRef(e.target.value)} />
                        <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                        <button type="submit" className="btn-primary text-sm">Save my debrief <ArrowRight className="w-4 h-4" /></button>
                      </form>
                    </div>
                  </section>
                )}
                {debrief.recorded && (
                  <p className="max-w-2xl mx-auto px-4 sm:px-6 pb-8 text-sm text-gray-600 inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Saved. Jermaine has the coach notes.</p>
                )}

                <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => { setStage("setup"); setDebrief(null); setTurns([]); }} className="btn-primary text-base">Run it again <ArrowRight className="w-5 h-5" /></button>
                    <Link href="/contact" className="btn-outline text-base">Talk to Jermaine</Link>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
