"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Compass,
  Loader2,
  Sparkles,
  Upload,
  FileText,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ASSESSMENT_NAME,
  PREFERENCE_FIELDS,
  COMPASS_QUESTIONS,
  COMPASS_DIMENSIONS,
  DIMENSION_ACTIONS,
  calculateOverallScore,
  calculateDimensionScores,
  getBand,
  isComplete,
  rankDimensions,
  getRoleMatch,
  type CompassDimension,
} from "@/lib/career-assessment";
import { PROGRAM_NAME, COHORT, SESSION_DAY, SESSION_TIME } from "@/lib/program";
import {
  validateResumeFile,
  flattenSkills,
  ACCEPTED_EXTENSIONS,
  type ResumeExtraction,
} from "@/lib/resume";
import {
  CROSS_CHECKED_QUESTIONS,
  cvChecksFor,
  reconcile,
  optionLabel,
  rewriteLinkLine,
} from "@/lib/career-crosscheck";

type Stage = "intro" | "preferences" | "resume" | "compass" | "capture" | "analyzing" | "results";
type PrefValue = string | string[];

const ANALYZING_STEPS = [
  "Scoring your seven dimensions",
  "Comparing your target against your readiness",
  "Finding the two gaps that cost you most",
  "Writing your 90-day plan",
];

export default function CareerAssessmentPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [prefIndex, setPrefIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [preferences, setPreferences] = useState<Record<string, PrefValue>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [targetTitle, setTargetTitle] = useState("");
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "", location: "" });
  const [joinFounding, setJoinFounding] = useState(true);
  type ResumeRewrite = {
    headline?: string;
    summary?: string;
    skillsSection?: string[];
    bulletRewrites?: { before: string; after: string; note: string }[];
    fixes?: string[];
  };
  type Report = {
    summary: string;
    phases?: { title: string; body: string }[];
    resume?: ResumeRewrite | null;
    training?: { week: number; project: string; theme: string }[];
    trainingWhy?: string | null;
  };
  const [report, setReport] = useState<Report | null>(null);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [website, setWebsite] = useState("");
  const [formStartedAt] = useState(() => Date.now());
  const [utm, setUtm] = useState({ utmSource: "", utmMedium: "", utmCampaign: "" });

  // CV capture. Extraction is kicked off when they hand the file over and runs
  // while they answer the COMPASS questions, so nobody waits on the model.
  const [resumeStatus, setResumeStatus] = useState<"idle" | "reading" | "done" | "error" | "skipped">("idle");
  const [resumeExtraction, setResumeExtraction] = useState<ResumeExtraction | null>(null);
  const [resumePath, setResumePath] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeText, setResumeText] = useState("");
  // The applicant's own CV text, held in their session so the report step can
  // verify its rewrites against the same document.
  const [resumeSource, setResumeSource] = useState("");
  const [resumeVerification, setResumeVerification] = useState<{
    skillsKept: number;
    skillsDropped: number;
  } | null>(null);
  // Which profile fields we filled in from the CV, so the capture step can
  // present itself as a confirmation instead of a form.
  const [prefilled, setPrefilled] = useState<string[]>([]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtm({
      utmSource: p.get("utm_source") || "",
      utmMedium: p.get("utm_medium") || "",
      utmCampaign: p.get("utm_campaign") || "",
    });
  }, []);

  // Each step is a new screen, so start it at the top. Without this the
  // browser keeps the previous scroll offset and the question heading opens
  // above the fold — the taller the previous screen, the worse it looks.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [stage, prefIndex, qIndex]);

  const score = useMemo(() => calculateOverallScore(answers), [answers]);
  const dimensionScores = useMemo(() => calculateDimensionScores(answers), [answers]);
  const band = useMemo(() => getBand(score), [score]);
  const complete = useMemo(() => isComplete(answers), [answers]);
  const ranked = useMemo(() => rankDimensions(dimensionScores), [dimensionScores]);
  const roleMatch = useMemo(
    () => getRoleMatch(preferences.targetField as string | undefined, dimensionScores, score),
    [preferences.targetField, dimensionScores, score]
  );

  // ── preference handling ──
  const prefField = PREFERENCE_FIELDS[prefIndex];
  const prefAnswered = prefField ? preferences[prefField.id] !== undefined : false;

  function choosePref(fieldId: string, value: string, multi?: boolean, max?: number) {
    setPreferences((prev) => {
      if (!multi) return { ...prev, [fieldId]: value };
      const current = Array.isArray(prev[fieldId]) ? (prev[fieldId] as string[]) : [];
      if (current.includes(value)) return { ...prev, [fieldId]: current.filter((v) => v !== value) };
      if (max && current.length >= max) return prev;
      return { ...prev, [fieldId]: [...current, value] };
    });
  }

  function nextPref() {
    if (prefIndex < PREFERENCE_FIELDS.length - 1) setPrefIndex((i) => i + 1);
    else setStage("resume");
  }

  // ── CV handling ──
  // Deliberately fire-and-forget: we move the applicant straight on to the
  // COMPASS questions and let the read finish in the background.
  function startExtraction(payload: Record<string, unknown>, label: string) {
    setResumeStatus("reading");
    setResumeError("");
    setResumeName(label);
    setStage("compass");
    fetch("/api/career-assessment/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        targetRole: (preferences.targetField as string) || undefined,
        targetTitle: targetTitle || undefined,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "We couldn't read that file.");
        setResumeExtraction(data.extraction ?? null);
        setResumePath(data.resumePath ?? null);
        setResumeSource(data.sourceText ?? "");
        setResumeVerification(data.verification ?? null);

        // Fill the contact step from the CV so they confirm rather than
        // retype. Only ever fills a field that is still empty, so anything
        // the applicant has already typed wins.
        const c = data.extraction?.contact;
        if (c) {
          const filled: string[] = [];
          setProfile((prev) => {
            const next = { ...prev };
            for (const key of ["firstName", "lastName", "email", "phone", "location"] as const) {
              const value = c[key];
              if (value && !next[key]) {
                next[key] = value;
                filled.push(key);
              }
            }
            return next;
          });
          setPrefilled(filled);
        }

        setResumeStatus("done");
      })
      .catch((err) => {
        setResumeError(err instanceof Error ? err.message : "We couldn't read that file.");
        setResumeStatus("error");
      });
  }

  function handleResumeFile(file: File | undefined) {
    if (!file) return;
    const problem = validateResumeFile(file);
    if (problem) {
      setResumeError(problem);
      setResumeStatus("error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      startExtraction({ fileBase64: base64, fileName: file.name }, file.name);
    };
    reader.onerror = () => {
      setResumeError("We couldn't open that file. Try pasting the text instead.");
      setResumeStatus("error");
    };
    reader.readAsDataURL(file);
  }

  // ── compass handling ──
  const question = COMPASS_QUESTIONS[qIndex];
  const questionIsCrossChecked = Boolean(question) && CROSS_CHECKED_QUESTIONS.includes(question.id);

  // ── answers against the CV (deterministic, from the verified extraction) ──
  const cvChecks = cvChecksFor(resumeExtraction);
  const discrepancies = reconcile(resumeExtraction, answers);
  const discrepancyFor = (questionId: string) => discrepancies.find((d) => d.questionId === questionId);

  function answerQuestion(value: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setTimeout(() => {
      if (qIndex < COMPASS_QUESTIONS.length - 1) setQIndex((i) => i + 1);
      else setStage("capture");
    }, 180);
  }

  // ── submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setStage("analyzing");

    const iv = setInterval(
      () => setAnalyzingStep((p) => (p >= ANALYZING_STEPS.length - 1 ? p : p + 1)),
      700
    );
    // Never strand the user on the spinner if a call hangs.
    const safety = setTimeout(() => setStage("results"), 30_000);

    const payload = {
      ...profile,
      targetTitle,
      preferences,
      answers,
      score,
      band: band.label,
      dimensions: dimensionScores,
      complete,
      joinFoundingCohort: joinFounding && complete,
      resume: resumeExtraction,
      resumePath,
      website,
      formStartedAt,
      ...utm,
    };

    try {
      const [submitRes, reportRes] = await Promise.allSettled([
        fetch("/api/career-assessment/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch("/api/career-assessment/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: profile.firstName,
            score,
            dimensionScores,
            preferences,
            targetTitle,
            resume: resumeExtraction,
            sourceText: resumeSource,
            answers,
          }),
        }),
      ]);

      if (submitRes.status === "fulfilled" && submitRes.value.ok) {
        const d = await submitRes.value.json().catch(() => ({}));
        setRegistered(Boolean(d.registeredFounding));
      } else {
        setSubmitError("We couldn't save your results, but here they are. Please get in touch so we don't lose you.");
      }

      if (reportRes.status === "fulfilled" && reportRes.value.ok) {
        const d = await reportRes.value.json().catch(() => null);
        if (d?.summary)
          setReport({
            summary: d.summary,
            phases: d.phases,
            resume: d.resume ?? null,
            training: d.training ?? [],
            trainingWhy: d.trainingWhy ?? null,
          });
      }
    } catch {
      setSubmitError("We couldn't save your results, but here they are.");
    } finally {
      clearInterval(iv);
      clearTimeout(safety);
      setStage("results");
    }
  }

  const field = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent";
  const totalSteps = PREFERENCE_FIELDS.length + COMPASS_QUESTIONS.length;
  const stepNow =
    stage === "preferences" ? prefIndex : stage === "compass" ? PREFERENCE_FIELDS.length + qIndex : totalSteps;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* progress */}
      {(stage === "preferences" || stage === "compass") && (
        <div className="fixed top-[64px] left-0 right-0 h-1 bg-gray-100 z-40">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(stepNow / totalSteps) * 100}%` }}
          />
        </div>
      )}

      <main className="flex-1">
        {/* ===== INTRO ===== */}
        {stage === "intro" && (
          <section className="relative overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-gray-900 to-gray-900" />
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24">
              <Compass className="w-10 h-10 text-accent mb-6" />
              <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-5">
                Free · 6 minutes · No CV needed
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-6">
                {ASSESSMENT_NAME}
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl leading-relaxed mb-5">
                Find out exactly why your job search isn&rsquo;t working, and what to fix first.
              </p>
              <p className="text-base text-gray-400 max-w-2xl leading-relaxed mb-10">
                Most career quizzes tell you your personality type. This one asks what you actually
                want from your next job, scores you across the seven things employers screen on, and
                tells you honestly whether the role you&rsquo;re going for is realistic today. You get
                your results on screen, plus a written 90-day plan.
              </p>
              <button onClick={() => setStage("preferences")} className="btn-primary text-base">
                Start the assessment
                <ArrowRight className="w-5 h-5" />
              </button>

              <dl className="grid sm:grid-cols-3 gap-6 border-t border-white/10 pt-10 mt-14">
                {[
                  ["What you want", "Role, pay, flexibility, timeline. In your words."],
                  ["Where you stand", "Seven scored dimensions, benchmarked honestly."],
                  ["What to do next", "A 90-day plan tied to your actual answers."],
                ].map(([t, d]) => (
                  <div key={t}>
                    <dt className="text-white font-semibold mb-1">{t}</dt>
                    <dd className="text-sm text-gray-400 leading-relaxed">{d}</dd>
                  </div>
                ))}
              </dl>

              <p className="text-sm text-gray-500 mt-10 leading-relaxed max-w-2xl">
                Finish every question and you earn a place in the {PROGRAM_NAME} founding cohort —
                eight weeks, free, {SESSION_DAY}s at {SESSION_TIME}.
              </p>
            </div>
          </section>
        )}

        {/* ===== PREFERENCES ===== */}
        {stage === "preferences" && prefField && (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
            <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-3">
              What you want · {prefIndex + 1} of {PREFERENCE_FIELDS.length}
            </p>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">{prefField.question}</h2>
            {prefField.helpText && (
              <p className="text-gray-600 leading-relaxed mb-8">{prefField.helpText}</p>
            )}

            <div className="space-y-3">
              {prefField.options.map((o) => {
                const current = preferences[prefField.id];
                const selected = Array.isArray(current) ? current.includes(o.value) : current === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => choosePref(prefField.id, o.value, prefField.multi, prefField.maxChoices)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                      selected
                        ? "border-accent bg-cream"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className="font-semibold text-gray-900">{o.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Exact title, asked right after the role family so it's in context */}
            {prefField.id === "targetField" && (
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="targetTitle">
                  If you know the exact job title you want, what is it?{" "}
                  <span className="font-normal text-gray-400">optional</span>
                </label>
                <input
                  id="targetTitle"
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  placeholder="e.g. Operations Analyst"
                  className={field}
                />
              </div>
            )}

            <div className="flex items-center gap-4 mt-8">
              {prefIndex > 0 && (
                <button
                  onClick={() => setPrefIndex((i) => i - 1)}
                  className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button onClick={nextPref} disabled={!prefAnswered} className="btn-primary ml-auto disabled:opacity-40">
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        )}

        {/* ===== CV ===== */}
        {stage === "resume" && (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
            <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-3">
              Your CV · optional but worth it
            </p>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
              Give us your CV and we&rsquo;ll rewrite it for you.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We read it to see what you can actually evidence, then hand back a reformatted
              version: a headline aimed at the role you want, your weak lines rewritten, and the
              skills section ordered the way employers screen for.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              It also tells us which parts of the training you actually need, instead of putting you
              through all of it. We keep it private and only Jermaine sees it.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              <strong className="text-gray-900">Nothing gets invented.</strong> Every skill and every
              rewritten line is checked back against your own document, and anything we can&rsquo;t
              find in it is thrown away rather than shown to you. Where a number is needed that only
              you know, you&rsquo;ll see <code className="text-sm bg-gray-100 px-1 rounded">[X]</code>{" "}
              for you to fill in.
            </p>

            <label
              htmlFor="cv-file"
              className="block border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-accent hover:bg-cream/40 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleResumeFile(e.dataTransfer.files?.[0]);
              }}
            >
              <Upload className="w-8 h-8 text-accent mx-auto mb-4" />
              <span className="block font-semibold text-gray-900 mb-1">
                Drop your CV here, or click to choose
              </span>
              <span className="block text-sm text-gray-500">
                PDF, Word (.docx, .doc), OpenDocument, RTF or plain text. Up to 2.5MB.
              </span>
              <input
                id="cv-file"
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                className="hidden"
                onChange={(e) => handleResumeFile(e.target.files?.[0])}
              />
            </label>

            {resumeError && (
              <p className="mt-4 text-sm text-red-600 flex items-start gap-2" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{resumeError}</span>
              </p>
            )}

            <div className="mt-8">
              <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="cv-text">
                Or paste the text instead.
              </label>
              <textarea
                id="cv-text"
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your CV here…"
                className={field}
              />
              <button
                onClick={() => startExtraction({ text: resumeText }, "pasted CV")}
                disabled={resumeText.trim().length < 50}
                className="btn-outline mt-3 text-sm disabled:opacity-40"
              >
                Use this text
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-10 pt-8 border-t border-gray-100">
              <button
                onClick={() => setStage("preferences")}
                className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => {
                  setResumeStatus("skipped");
                  setStage("compass");
                }}
                className="ml-auto text-sm text-gray-500 hover:text-gray-900 underline"
              >
                Skip — I don&rsquo;t have it to hand
              </button>
            </div>
          </section>
        )}

        {/* ===== COMPASS ===== */}
        {stage === "compass" && question && (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
            <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-3">
              {question.dimension} · {qIndex + 1} of {COMPASS_QUESTIONS.length}
            </p>

            {/* The CV read runs while they answer, so surface it quietly here
                rather than making them wait on a spinner earlier. */}
            {resumeStatus === "reading" && (
              <p className="text-xs text-gray-500 flex items-center gap-2 mb-4">
                <Loader2 className="w-3 h-3 animate-spin" /> Reading {resumeName} in the background…
              </p>
            )}
            {resumeStatus === "done" && !questionIsCrossChecked && (
              <p className="text-xs text-gray-500 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-3 h-3 text-accent" /> CV read. We&rsquo;ll show you what we
                found at the end.
              </p>
            )}
            {/* The evidence itself is held back until the results, so the
                answer stays a self-rating and the comparison means something. */}
            {resumeStatus === "done" && questionIsCrossChecked && (
              <p className="text-xs text-gray-500 flex items-center gap-2 mb-4">
                <FileText className="w-3 h-3 text-accent" /> We&rsquo;ll check this answer against your CV.
              </p>
            )}
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">{question.questionText}</h2>
            <p className="text-gray-600 leading-relaxed mb-8 border-l-4 border-gray-200 pl-4">
              {question.helpText}
            </p>

            <div className="space-y-3">
              {question.options.map((o) => (
                <button
                  key={o.value}
                  onClick={() => answerQuestion(o.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                    answers[question.id] === o.value
                      ? "border-accent bg-cream"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="font-semibold text-gray-900 block mb-1">{o.label}</span>
                  <span className="text-sm text-gray-600 leading-relaxed">{o.description}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => (qIndex > 0 ? setQIndex((i) => i - 1) : setStage("resume"))}
                className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
          </section>
        )}

        {/* ===== CAPTURE ===== */}
        {stage === "capture" && (
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
            <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-3">Last step</p>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
              {prefilled.length > 0 ? "Is this right?" : "Where should we send your results?"}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {prefilled.length > 0 ? (
                <>
                  We took these off your CV so you don&rsquo;t have to type them again. Change
                  anything that&rsquo;s wrong or out of date, then carry on.
                </>
              ) : (
                <>
                  You&rsquo;ll see your score and plan on the next screen either way. We email a copy
                  so you still have it in a month, when it matters.
                </>
              )}
            </p>

            {resumeStatus === "done" && resumeExtraction && (
              <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-3">
                  What we found in your CV
                </p>
                {resumeExtraction.currentTitle && (
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>{resumeExtraction.currentTitle}</strong>
                    {resumeExtraction.yearsExperience != null && ` · ${resumeExtraction.yearsExperience} years`}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {(resumeExtraction.skillGroups ?? []).flatMap((g) =>
                    g.skills.map((sk) => (
                      <span
                        key={`${g.category}-${sk.value}`}
                        title={sk.evidence ? `From your CV: "${sk.evidence}"` : undefined}
                        className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-700"
                      >
                        {sk.value}
                      </span>
                    ))
                  )}
                </div>
                {flattenSkills(resumeExtraction).length === 0 && (
                  <p className="text-sm text-gray-600">
                    We couldn&rsquo;t find skills we could trace back to your document. Your results
                    still work.
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  Every one of these was found in your CV. Hover to see the words it came from.
                  {resumeVerification && resumeVerification.skillsDropped > 0 &&
                    ` We discarded ${resumeVerification.skillsDropped} we couldn't trace back to it.`}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
                  value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="firstName">First name{prefilled.includes("firstName") && (
                    <span className="ml-2 font-normal text-accent text-xs">from your CV</span>
                  )}</label>
                  <input id="firstName" required value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className={field} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="lastName">Last name{prefilled.includes("lastName") && (
                    <span className="ml-2 font-normal text-accent text-xs">from your CV</span>
                  )}</label>
                  <input id="lastName" required value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className={field} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="email">Email{prefilled.includes("email") && (
                    <span className="ml-2 font-normal text-accent text-xs">from your CV</span>
                  )}</label>
                <input id="email" type="email" required value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={field} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="phone">
                    Phone{" "}
                    {prefilled.includes("phone") ? (
                      <span className="font-normal text-accent text-xs">from your CV</span>
                    ) : (
                      <span className="font-normal text-gray-400">optional</span>
                    )}
                  </label>
                  <input id="phone" type="tel" value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={field} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="location">
                    City / country{" "}
                    {prefilled.includes("location") ? (
                      <span className="font-normal text-accent text-xs">from your CV</span>
                    ) : (
                      <span className="font-normal text-gray-400">optional</span>
                    )}
                  </label>
                  <input id="location" value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })} className={field} />
                </div>
              </div>

              {/* Founding place is earned by finishing, and confirmed here.
                  Never registered without this box being ticked. */}
              {complete && (
                <div className="bg-cream border border-accent rounded-xl p-5">
                  <label className="flex gap-3 items-start cursor-pointer">
                    <input type="checkbox" checked={joinFounding}
                      onChange={(e) => setJoinFounding(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#D97706]" />
                    <span className="text-sm text-gray-800 leading-relaxed">
                      <strong>Reserve my place in the {PROGRAM_NAME} founding cohort.</strong> You
                      finished every question, which is the bar for a free place in {COHORT.label} —
                      eight weeks, {SESSION_DAY}s at {SESSION_TIME}, eight real projects, no cost.
                      Jermaine will contact you personally.
                    </span>
                  </label>
                </div>
              )}

              <button type="submit" className="btn-primary w-full text-base">
                {prefilled.length > 0 ? "Confirm and see my results" : "See my results"}
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-500 text-center">
                We email you about your results and this programme. Nothing else.
              </p>
            </form>
          </section>
        )}

        {/* ===== ANALYZING ===== */}
        {stage === "analyzing" && (
          <section className="max-w-xl mx-auto px-4 sm:px-6 pt-40 pb-40 text-center">
            <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-8" />
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Reading your answers</h2>
            <div className="space-y-3 text-left max-w-sm mx-auto">
              {ANALYZING_STEPS.map((s, i) => (
                <div key={s} className={`flex items-center gap-3 transition-opacity ${i <= analyzingStep ? "opacity-100" : "opacity-30"}`}>
                  {i < analyzingStep ? (
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                  )}
                  <span className="text-sm text-gray-700">{s}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== RESULTS ===== */}
        {stage === "results" && (
          <>
            <section className="bg-gray-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-gray-900 to-gray-900" />
              <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
                <p className="text-accent text-sm tracking-widest uppercase font-semibold mb-4">
                  {profile.firstName ? `${profile.firstName}, here's where you stand` : "Your result"}
                </p>
                <div className="flex flex-wrap items-end gap-6 mb-6">
                  <span className="font-display text-7xl font-bold text-white leading-none">{score}</span>
                  <span className="text-gray-400 text-lg mb-2">/ 100</span>
                  <span className="font-display text-3xl text-accent italic mb-1">{band.label}</span>
                </div>
                <p className="text-lg text-gray-200 max-w-2xl leading-relaxed">{band.summary}</p>
                {submitError && (
                  <p className="text-sm text-amber-300 mt-6 border border-amber-400/40 rounded-lg p-4" role="alert">
                    {submitError}
                  </p>
                )}
              </div>
            </section>

            {/* founding cohort confirmation */}
            {registered && (
              <section className="bg-accent">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row sm:items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-white shrink-0" />
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-bold text-white mb-1">
                      Your place in the {PROGRAM_NAME} founding cohort is reserved
                    </h2>
                    <p className="text-white/90 text-sm leading-relaxed">
                      You finished every question. Jermaine will be in touch personally before {COHORT.label} starts.
                    </p>
                  </div>
                  <Link href="/program" className="btn-outline-white shrink-0 !border-white/60">
                    See the programme
                  </Link>
                </div>
              </section>
            )}

            {/* COMPASS breakdown */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-8">Your seven dimensions</h2>
              <div className="space-y-5">
                {(Object.keys(COMPASS_DIMENSIONS) as CompassDimension[]).map((dim) => {
                  const v = dimensionScores[dim] ?? 0;
                  const meta = COMPASS_DIMENSIONS[dim];
                  return (
                    <div key={dim}>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="font-semibold text-gray-900">
                          <span className="text-accent mr-2">{meta.letter}</span>
                          {dim}
                        </span>
                        <span className="text-sm text-gray-500">{v}/5</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${(v / 5) * 100}%`, backgroundColor: meta.color }} />
                      </div>
                      <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{meta.blurb}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* role match */}
            <section className="bg-gray-50 border-y border-gray-200">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
                  {roleMatch.verdict}
                </h2>
                <p className="text-gray-700 leading-relaxed max-w-2xl mb-8">{roleMatch.detail}</p>
                <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-3">
                  Also worth considering
                </p>
                <ul className="space-y-2">
                  {roleMatch.adjacent.map((a) => (
                    <li key={a} className="flex gap-3 text-gray-700 leading-relaxed">
                      <span className="text-accent">—</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* fix these two first */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">Fix these two first</h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mb-10">
                Not everything at once. These are your two weakest dimensions, and they&rsquo;re costing
                you more than the other five combined.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {ranked.slice(0, 2).map((dim) => (
                  <div key={dim} className="border border-gray-200 rounded-2xl p-7">
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{dim}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {DIMENSION_ACTIONS[dim]?.diagnosis}
                    </p>
                    <p className="text-gray-900 text-sm font-semibold mb-2">
                      {DIMENSION_ACTIONS[dim]?.action}
                    </p>
                    <div className="bg-cream rounded-lg p-4 mt-4">
                      <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-2">
                        This week
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {DIMENSION_ACTIONS[dim]?.week1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Answers vs CV */}
            {resumeExtraction && cvChecks.length > 0 && (
              <section className="bg-gray-50 border-y border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                  <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
                    What you said, against what your CV shows
                  </h2>
                  <p className="text-gray-600 leading-relaxed max-w-2xl mb-10">
                    {discrepancies.length > 0
                      ? `Four of the questions can be checked against your CV. On ${["one", "two", "three", "all four"][discrepancies.length - 1] ?? discrepancies.length} of them your answer and your CV disagree, and that gap is the most useful thing on this page.`
                      : "Four of the questions can be checked against your CV. Your answers and your CV agree on all of them, which is rarer than you would think."}
                  </p>
                  <div className="space-y-4">
                    {cvChecks.map((c) => {
                      const self = answers[c.questionId];
                      const gap = discrepancyFor(c.questionId);
                      const q = COMPASS_QUESTIONS.find((x) => x.id === c.questionId);
                      return (
                        <div
                          key={c.questionId}
                          className={`rounded-2xl border p-6 bg-white ${gap ? "border-accent" : "border-gray-200"}`}
                        >
                          <p className="text-xs tracking-widest uppercase text-gray-500 font-semibold mb-2">
                            {c.dimension}
                          </p>
                          <p className="font-semibold text-gray-900 mb-4">{q?.questionText}</p>
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">You said</p>
                              <p className="text-gray-900 font-medium">
                                {typeof self === "number" ? optionLabel(c.questionId, self) : "Not answered"}
                                {typeof self === "number" && (
                                  <span className="text-gray-400 font-normal"> · {self}/5</span>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Your CV reads as</p>
                              <p className="text-gray-900 font-medium">
                                {optionLabel(c.questionId, c.cvScore)}
                                <span className="text-gray-400 font-normal"> · {c.cvScore}/5</span>
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed mt-4">{c.evidence}</p>
                          {gap ? (
                            <div className="bg-cream rounded-lg p-4 mt-4">
                              <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-2">
                                {gap.direction === "cv-lower" ? "The CV is behind you" : "You are underselling"}
                              </p>
                              <p className="text-sm text-gray-800 leading-relaxed">{gap.advice}</p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 mt-4 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-accent" /> In line
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* AI-written read + 90 day plan */}
            {report && (
              <section className="bg-primary">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <p className="text-xs tracking-widest uppercase text-accent font-semibold">
                      Written for you
                    </p>
                  </div>
                  <p className="text-lg text-gray-200 leading-relaxed whitespace-pre-wrap mb-12">
                    {report.summary}
                  </p>
                  {report.phases && report.phases.length > 0 && (
                    <>
                      <h2 className="font-display text-3xl font-bold text-white mb-8">Your next 90 days</h2>
                      <div className="space-y-6">
                        {report.phases.map((p) => (
                          <div key={p.title} className="border-l-2 border-accent pl-6">
                            <h3 className="font-display text-xl font-bold text-white mb-2">{p.title}</h3>
                            <p className="text-gray-300 leading-relaxed">{p.body}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* Reformatted CV */}
            {report?.resume && (
              <section className="border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-accent" />
                    <p className="text-xs tracking-widest uppercase text-accent font-semibold">
                      Your CV, reformatted
                    </p>
                  </div>
                  <h2 className="font-display text-3xl font-bold text-gray-900 mb-8">
                    Copy this straight into your CV
                  </h2>

                  {report.resume.headline && (
                    <div className="mb-8">
                      <p className="text-xs tracking-widest uppercase text-gray-500 font-semibold mb-2">
                        Headline
                      </p>
                      <p className="font-display text-xl font-bold text-gray-900">
                        {report.resume.headline}
                      </p>
                    </div>
                  )}

                  {report.resume.summary && (
                    <div className="mb-8">
                      <p className="text-xs tracking-widest uppercase text-gray-500 font-semibold mb-2">
                        Professional summary
                      </p>
                      <p className="text-gray-700 leading-relaxed">{report.resume.summary}</p>
                    </div>
                  )}

                  {report.resume.skillsSection && report.resume.skillsSection.length > 0 && (
                    <div className="mb-8">
                      <p className="text-xs tracking-widest uppercase text-gray-500 font-semibold mb-3">
                        Skills section, ordered for your target
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {report.resume.skillsSection.map((sk) => (
                          <span key={sk} className="text-sm bg-cream border border-accent/30 rounded-full px-3 py-1 text-gray-800">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.resume.bulletRewrites && report.resume.bulletRewrites.length > 0 && (
                    <div className="mb-8">
                      <p className="text-xs tracking-widest uppercase text-gray-500 font-semibold mb-2">
                        Your lines, rewritten
                      </p>
                      {rewriteLinkLine(answers) && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{rewriteLinkLine(answers)}</p>
                      )}
                      <div className="space-y-5">
                        {report.resume.bulletRewrites.map((b, i) => (
                          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                            <p className="text-sm text-gray-500 line-through px-5 py-3 bg-gray-50 leading-relaxed">
                              {b.before}
                            </p>
                            <p className="text-gray-900 px-5 py-3 leading-relaxed font-medium">{b.after}</p>
                            {b.note && (
                              <p className="text-xs text-gray-600 px-5 py-3 bg-cream leading-relaxed border-t border-gray-100">
                                {b.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.resume.fixes && report.resume.fixes.length > 0 && (
                    <div>
                      <p className="text-xs tracking-widest uppercase text-gray-500 font-semibold mb-3">
                        Structural fixes
                      </p>
                      <ul className="space-y-2">
                        {report.resume.fixes.map((f) => (
                          <li key={f} className="flex gap-3 text-gray-700 leading-relaxed">
                            <span className="text-accent">—</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Training aimed at their gaps */}
            {report?.training && report.training.length > 0 && (
              <section className="bg-gray-50 border-y border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                  <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                    The training you actually need
                  </h2>
                  <p className="text-gray-700 leading-relaxed max-w-2xl mb-10">
                    {report.trainingWhy ??
                      `Based on your two weakest dimensions, these are the ${PROGRAM_NAME} weeks that matter most for you.`}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {report.training.map((t) => (
                      <div key={t.week} className="bg-white border border-gray-200 rounded-xl p-6">
                        <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-2">
                          Week {t.week}
                        </p>
                        <h3 className="font-display text-lg font-bold text-gray-900 mb-1">{t.theme}</h3>
                        <p className="text-sm text-gray-600">You ship: {t.project}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                {registered ? "You already have your place" : `Close these gaps in eight weeks`}
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
                {PROGRAM_NAME} is free, runs {SESSION_DAY}s at {SESSION_TIME}, and every project you
                build attaches to your own work. You finish with a published portfolio — which is
                exactly what the Proof dimension above is measuring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/program" className="btn-primary text-base">
                  {registered ? "See what you signed up for" : `Apply for ${COHORT.label}`}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/contact" className="btn-outline text-base">
                  Talk to Jermaine
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
