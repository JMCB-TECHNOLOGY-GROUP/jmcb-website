"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Circle, ExternalLink, Loader2 } from "lucide-react";
import {
  ASSOCIATE_TERMS,
  ROUTES,
  ROUTE_QUESTIONS,
  STEP_META,
  isStepDone,
  progress,
  recommendRoute,
  type LabStudentView,
  type LabSubmissionView,
} from "@/lib/lab-shared";
import { ONBOARDING_STEPS, type OnboardingStep, type RouteKey, type TrackKey } from "@/lib/lab-types";
import { lessonFor } from "@/lib/lab-curriculum";
import { formatSessionDate } from "@/lib/program";

interface LabState {
  student: LabStudentView;
  submissions: LabSubmissionView[];
  classmates: { first_name: string; last_name: string; intro: string; target_role: string | null; route: string | null }[];
  feeCents: number | null;
}

const field =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent bg-white";
const btn = "btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed";
const WEEKS = [1, 2, 3, 4, 5, 6];

export default function LabPortal({ token }: { token: string }) {
  const [state, setState] = useState<LabState | null>(null);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ key: string; msg: string } | null>(null);
  const [week, setWeek] = useState(1);

  const act = useCallback(
    async (key: string, payload: Record<string, unknown>): Promise<LabState | { url: string } | null> => {
      setBusy(key);
      setError(null);
      try {
        const res = await fetch(`/api/lab/${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Something went wrong.");
        if ("student" in data) setState(data);
        return data;
      } catch (e) {
        setError({ key, msg: e instanceof Error ? e.message : "Something went wrong." });
        return null;
      } finally {
        setBusy(null);
      }
    },
    [token]
  );

  useEffect(() => {
    fetch(`/api/lab/${token}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("This link is not recognised. Ask Jermaine for a new one.");
        return r.json();
      })
      .then(async (data: LabState) => {
        setState(data);
        // Back from Stripe Checkout: confirm the payment, then clean the URL.
        const sessionId = new URLSearchParams(window.location.search).get("paid");
        if (sessionId && !data.student.paid_at) {
          await act("payment", { action: "verify_payment", sessionId });
        }
        if (sessionId) window.history.replaceState(null, "", window.location.pathname);
      })
      .catch((e) => setLoadError(e.message));
  }, [token, act]);

  if (loadError) return <p className="text-red-600 bg-white p-6 rounded-xl border">{loadError}</p>;
  if (!state) return <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />;

  const s = state.student;
  const p = progress(s);
  const errFor = (key: string) =>
    error?.key === key ? <p className="text-sm text-red-600 mt-2" role="alert">{error.msg}</p> : null;

  return (
    <div className="space-y-10">
      <header>
        <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">Proof of Work Lab</p>
        <h1 className="font-display text-3xl font-bold text-gray-900">Hi {s.first_name}.</h1>
        <p className="text-gray-600 mt-2">
          Setup: {p.done} of {p.total} steps done.
          {s.route && <> Route: <strong>{ROUTES[s.route].exam}</strong>.</>}
          {s.jmcb_address && <> Your JMCB address: <strong>{s.jmcb_address}</strong>.</>}
        </p>
        <div className="h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-accent" style={{ width: `${(p.done / p.total) * 100}%` }} />
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-gray-900">Setup</h2>
        {ONBOARDING_STEPS.map((step, i) => (
          <StepCard key={step} n={i + 1} step={step} done={isStepDone(s, step)} open={p.next === step}>
            <StepBody step={step} state={state} act={act} busy={busy} errFor={errFor} />
          </StepCard>
        ))}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Weekly lessons</h2>
        <div className="flex gap-2 flex-wrap mb-4">
          {WEEKS.map((w) => (
            <button key={w} onClick={() => setWeek(w)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${week === w ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-700"}`}>
              Week {w}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <LessonCard week={week} track="core" state={state} act={act} busy={busy} errFor={errFor} />
          {s.route ? (
            <LessonCard week={week} track={s.route} state={state} act={act} busy={busy} errFor={errFor} />
          ) : (
            <p className="text-sm text-gray-500 bg-white border rounded-xl p-4">Choose your route in setup to see your certification lessons.</p>
          )}
        </div>
      </section>

      {state.classmates.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Your cohort</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {state.classmates.map((c, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="font-semibold text-gray-900">{c.first_name} {c.last_name}</p>
                {c.target_role && <p className="text-xs text-gray-500 mb-2">Aiming at: {c.target_role}</p>}
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.intro}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StepCard({ n, step, done, open, children }: { n: number; step: OnboardingStep; done: boolean; open: boolean; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(open);
  useEffect(() => setExpanded(open), [open]);
  return (
    <div className={`bg-white rounded-xl border ${open ? "border-accent" : "border-gray-200"}`}>
      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setExpanded(!expanded)}>
        {done ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 shrink-0" />}
        <span className="font-semibold text-gray-900">{n}. {STEP_META[step].title}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pl-12">
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{STEP_META[step].blurb}</p>
          {children}
        </div>
      )}
    </div>
  );
}

type Act = (key: string, payload: Record<string, unknown>) => Promise<unknown>;
type ErrFor = (key: string) => React.ReactNode;

function StepBody({ step, state, act, busy, errFor }: { step: OnboardingStep; state: LabState; act: Act; busy: string | null; errFor: ErrFor }) {
  const s = state.student;
  const [v, setV] = useState<Record<string, string>>({});
  const val = (k: string, d = "") => v[k] ?? d;
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });
  const [answers, setAnswers] = useState<(RouteKey | null)[]>(ROUTE_QUESTIONS.map(() => null));
  const [route, setRoute] = useState<RouteKey | "">(s.route ?? "");

  switch (step) {
    case "github":
      return (
        <div>
          <a href="https://github.com/signup" target="_blank" rel="noreferrer" className="text-sm text-accent font-semibold inline-flex items-center gap-1 mb-3">
            Create a free GitHub account <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <div className="flex gap-2">
            <input className={field} placeholder="your-github-username" value={val("gh", s.github_username ?? "")} onChange={set("gh")} />
            <button className={btn} disabled={busy === step} onClick={() => act(step, { action: "github", username: val("gh", s.github_username ?? "") })}>
              {s.github_verified_at ? "Update" : "Verify"}
            </button>
          </div>
          {s.github_verified_at && <p className="text-sm text-green-700 mt-2">Verified: github.com/{s.github_username}</p>}
          {errFor(step)}
        </div>
      );
    case "intro":
      return (
        <div className="space-y-3">
          <textarea className={field} rows={5} placeholder="I'm… I'm bringing… In a year I want to…" value={val("intro", s.intro ?? "")} onChange={set("intro")} />
          <input className={field} placeholder="LinkedIn URL (optional)" value={val("li", s.linkedin ?? "")} onChange={set("li")} />
          <button className={btn} disabled={busy === step}
            onClick={() => act(step, { action: "intro", intro: val("intro", s.intro ?? ""), linkedin: val("li", s.linkedin ?? "") || null })}>
            Save introduction
          </button>
          {errFor(step)}
        </div>
      );
    case "target_role": {
      const posts = [0, 1, 2].map((i) => s.role_postings[i] ?? { url: "", title: "", company: "" });
      return (
        <div className="space-y-3">
          <input className={field} placeholder="Target role, e.g. Power Platform Developer" value={val("role", s.target_role ?? "")} onChange={set("role")} />
          <p className="text-xs text-gray-500">
            Search LinkedIn Jobs, Indeed or USAJOBS for that title. Paste three current postings.
          </p>
          {posts.map((pp, i) => (
            <div key={i} className="grid sm:grid-cols-3 gap-2">
              <input className={field} placeholder={`Posting ${i + 1} link`} value={val(`u${i}`, pp.url)} onChange={set(`u${i}`)} />
              <input className={field} placeholder="Job title" value={val(`t${i}`, pp.title)} onChange={set(`t${i}`)} />
              <input className={field} placeholder="Company" value={val(`c${i}`, pp.company)} onChange={set(`c${i}`)} />
            </div>
          ))}
          <textarea className={field} rows={3} placeholder="Skills that appear in all three postings" value={val("skills", s.role_skills ?? "")} onChange={set("skills")} />
          <button className={btn} disabled={busy === step}
            onClick={() =>
              act(step, {
                action: "target_role",
                targetRole: val("role", s.target_role ?? ""),
                postings: posts.map((pp, i) => ({ url: val(`u${i}`, pp.url), title: val(`t${i}`, pp.title), company: val(`c${i}`, pp.company) })),
                skills: val("skills", s.role_skills ?? ""),
              })
            }>
            Save target role
          </button>
          {errFor(step)}
        </div>
      );
    }
    case "route": {
      const rec = recommendRoute(answers);
      return (
        <div className="space-y-4">
          {ROUTE_QUESTIONS.map((q, qi) => (
            <fieldset key={qi}>
              <legend className="text-sm font-semibold text-gray-900 mb-1">{q.q}</legend>
              {q.options.map((o) => (
                <label key={o.label} className="flex gap-2 items-center text-sm text-gray-700">
                  <input type="radio" name={`q${qi}`} checked={answers[qi] === o.lean}
                    onChange={() => setAnswers(answers.map((a, j) => (j === qi ? o.lean : a)))} className="accent-[#D97706]" />
                  {o.label}
                </label>
              ))}
            </fieldset>
          ))}
          {rec && <p className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">Your answers lean toward <strong>{ROUTES[rec].name} ({ROUTES[rec].exam})</strong>. The choice is yours.</p>}
          <div className="grid sm:grid-cols-2 gap-3">
            {(Object.keys(ROUTES) as RouteKey[]).map((k) => (
              <label key={k} className={`block p-3 rounded-lg border cursor-pointer ${route === k ? "border-accent bg-amber-50" : "border-gray-200"}`}>
                <input type="radio" name="route" className="sr-only" checked={route === k} onChange={() => setRoute(k)} />
                <span className="block font-semibold text-sm">{ROUTES[k].exam}: {ROUTES[k].name}</span>
                <span className="block text-xs text-gray-600 mt-1">{ROUTES[k].fits}</span>
                <span className="block text-xs text-gray-500 mt-1">Exam fee: {ROUTES[k].examFee}</span>
              </label>
            ))}
          </div>
          <textarea className={field} rows={2} placeholder="Why this route, in a sentence or two" value={val("why", s.route_reason ?? "")} onChange={set("why")} />
          <button className={btn} disabled={busy === step || !route}
            onClick={() => act(step, { action: "route", route, reason: val("why", s.route_reason ?? "") })}>
            {s.route ? "Update route" : "Choose this route"}
          </button>
          {errFor(step)}
        </div>
      );
    }
    case "payment":
      if (s.paid_at) return <p className="text-sm text-green-700">Paid {new Date(s.paid_at).toLocaleDateString()}. Thank you.</p>;
      if (!s.route) return <p className="text-sm text-gray-500">Choose your route first.</p>;
      if (!state.feeCents) return <p className="text-sm text-gray-500">The track fee is being finalised. Jermaine will email you when payment opens.</p>;
      return (
        <div>
          <button className={btn} disabled={busy === step}
            onClick={async () => {
              const r = (await act(step, { action: "checkout" })) as { url?: string } | null;
              if (r?.url) window.location.href = r.url;
            }}>
            Pay ${(state.feeCents / 100).toFixed(0)} securely
          </button>
          {errFor(step)}
        </div>
      );
    case "agreement":
      if (s.agreement_signed_at) return <p className="text-sm text-green-700">Accepted {new Date(s.agreement_signed_at).toLocaleDateString()}.</p>;
      if (!s.paid_at) return <p className="text-sm text-gray-500">Complete the payment step first.</p>;
      return (
        <div className="space-y-3">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {ASSOCIATE_TERMS.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <input className={field} placeholder="Type your full legal name to accept" value={val("sig")} onChange={set("sig")} />
          <button className={btn} disabled={busy === step} onClick={() => act(step, { action: "agreement", signature: val("sig") })}>
            I accept these terms
          </button>
          {errFor(step)}
        </div>
      );
    case "jmcb_address":
      if (s.jmcb_address) return <p className="text-sm text-green-700">Issued: <strong>{s.jmcb_address}</strong>. Use it to register for your exam.</p>;
      if (!s.agreement_signed_at) return <p className="text-sm text-gray-500">Accept the associate terms first.</p>;
      return (
        <div>
          {s.address_request && <p className="text-sm text-gray-700 mb-2">Requested: {s.address_request}@jmcbtech.com. Jermaine will confirm when it is live.</p>}
          <div className="flex gap-2 items-center">
            <input className={field} placeholder="first.last" value={val("addr", s.address_request ?? "")} onChange={set("addr")} />
            <span className="text-sm text-gray-500 whitespace-nowrap">@jmcbtech.com</span>
            <button className={btn} disabled={busy === step} onClick={() => act(step, { action: "address_request", local: val("addr", s.address_request ?? "") })}>
              Request
            </button>
          </div>
          {errFor(step)}
        </div>
      );
  }
}

function LessonCard({ week, track, state, act, busy, errFor }: { week: number; track: TrackKey; state: LabState; act: Act; busy: string | null; errFor: ErrFor }) {
  const lesson = lessonFor(week, track);
  const sub = state.submissions.find((x) => x.week === week && x.track === track);
  const key = `sub-${week}-${track}`;
  const [url, setUrl] = useState(sub?.url ?? "");
  const [body, setBody] = useState(sub?.body ?? "");
  useEffect(() => {
    setUrl(sub?.url ?? "");
    setBody(sub?.body ?? "");
  }, [sub?.id, sub?.url, sub?.body, week, track]);

  if (!lesson) return null;
  const label = track === "core" ? "Proof of Work" : ROUTES[track].exam;
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-semibold tracking-widest uppercase text-accent">{label} · Week {week} · {formatSessionDate(lesson.date)}</p>
      <h3 className="font-display text-lg font-bold text-gray-900 mt-1 mb-3">{lesson.title}</h3>
      <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <p className="font-semibold text-gray-900 mb-1">You will be able to</p>
          <ul className="list-disc pl-5 space-y-1">{lesson.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
        <div>
          <p className="font-semibold text-gray-900 mb-1">Before the session</p>
          <ul className="list-disc pl-5 space-y-1">{lesson.prep.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-4"><strong>Exercise:</strong> {lesson.exercise}</p>
      <p className="text-sm text-gray-700 mt-2"><strong>Hand in:</strong> {lesson.deliverable}</p>
      {lesson.examDomains && <p className="text-xs text-gray-500 mt-2">Exam areas: {lesson.examDomains.join(" · ")}</p>}
      <ul className="mt-3 space-y-1">
        {lesson.resources.map((r) => (
          <li key={r.url}><a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-accent inline-flex items-center gap-1">{r.label} <ExternalLink className="w-3 h-3" /></a></li>
        ))}
      </ul>
      <div className="mt-4 border-t pt-4 space-y-2">
        <input className={field} placeholder="Link to your work (GitHub, doc, video)" value={url} onChange={(e) => setUrl(e.target.value)} />
        <textarea className={field} rows={3} placeholder="Or a short write-up" value={body} onChange={(e) => setBody(e.target.value)} />
        <button className={btn} disabled={busy === key}
          onClick={() => act(key, { action: "submit", week, track, url: url || null, body: body || null })}>
          {sub ? "Update submission" : "Submit"}
        </button>
        {sub && <p className="text-xs text-gray-500">Submitted {new Date(sub.created_at).toLocaleDateString()}</p>}
        {sub?.feedback && <p className="text-sm bg-green-50 border border-green-200 rounded-lg p-3"><strong>Feedback:</strong> {sub.feedback}</p>}
        {errFor(key)}
      </div>
    </article>
  );
}
