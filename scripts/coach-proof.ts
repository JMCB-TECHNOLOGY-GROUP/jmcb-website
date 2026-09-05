// One-off production proof for the Interview Coach. Builds a session from a
// real extraction (saved by the resume probe), runs two model-scored turns
// and the debrief against the live routes, and prints what came back.
// Run: npx vite-node scripts/coach-proof.ts <extraction.json> <email>
import { readFileSync } from "fs";
import { buildPersona, buildQuestionPlan, buildCvFacts, type CoachSession, type Turn } from "../src/lib/interview-coach";

const BASE = process.env.COACH_BASE ?? "https://www.jmcbtech.com";
const [extractionPath, email] = process.argv.slice(2);
const probe = JSON.parse(readFileSync(extractionPath, "utf8"));
const extraction = probe.extraction;

const session: CoachSession = {
  targetTitle: "AI Solutions Architect",
  firstName: "Jermaine",
  persona: buildPersona("AI Solutions Architect", extraction.industries ?? []),
  cvFacts: buildCvFacts(extraction),
  cvText: String(probe.sourceText ?? "").slice(0, 60_000),
  questions: buildQuestionPlan({ targetTitle: "AI Solutions Architect", extraction, answers: { a1: 4, o1: 4 } }),
};

console.log("QUESTION PLAN");
for (const q of session.questions) console.log(`  [${q.kind}] ${q.text}`);

const answers: Record<string, string> = {
  opener:
    "I'm a technology director who has spent the last decade running delivery for federal programmes, most recently at the Department of Justice where I led the intranet mobile rollout across 40K devices. I want the AI Solutions Architect role because for the past year I've been building agentic systems on Claude for my own clients and I want to do that at programme scale.",
  figure:
    "The 40K figure is the number of government issued mobile devices in the DOJ estate that received the DOJNet application. We measured it from the MDM enrolment count before and after the rollout. My part was the architecture and the phased release plan; the rollout went from zero to full estate over about nine months.",
};

async function post(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  const turns: Turn[] = [];
  for (const q of session.questions) {
    const answer = answers[q.id];
    if (!answer) continue;
    const t0 = Date.now();
    const { status, data } = await post("/api/interview-coach/turn", { session, turns, questionId: q.id, answer });
    console.log(`\nTURN ${q.id} -> HTTP ${status} in ${((Date.now() - t0) / 1000).toFixed(1)}s generated=${data.generated}`);
    if (status !== 200) { console.log(data); continue; }
    console.log("  scores:", JSON.stringify({ s: data.score.structure, e: data.score.evidence, r: data.score.relevance, c: data.score.concision }));
    console.log("  note:", data.score.note);
    console.log("  betterAnswer:", data.score.betterAnswer ? data.score.betterAnswer.slice(0, 220) + "…" : "(dropped or none)");
    console.log("  followUp:", data.followUp ?? "(none)");
    turns.push({ questionId: q.id, question: q.text, answer, score: data.score, followUp: data.followUp ?? undefined });
  }

  const t0 = Date.now();
  const { status, data } = await post("/api/interview-coach/debrief", {
    session,
    turns,
    contact: { firstName: "Jermaine", lastName: "Barker", email },
    coachRef: "production proof",
    formStartedAt: Date.now() - 5 * 60_000,
  });
  console.log(`\nDEBRIEF -> HTTP ${status} in ${((Date.now() - t0) / 1000).toFixed(1)}s generated=${data.generated} recorded=${data.recorded}`);
  if (status !== 200) { console.log(data); return; }
  console.log(`  overall ${data.overall}/100 ${data.band?.label} | strongest ${data.strongest} | weakest ${data.weakest}`);
  console.log("  averages:", JSON.stringify(data.averages));
  console.log("  summary:", String(data.summary).slice(0, 400).replace(/\s+/g, " "), "…");
  console.log("  fixes:", data.fixes);
  console.log("  rewrittenAnswers:", data.rewrittenAnswers?.length ?? 0);
  console.log("  coachNotes:", String(data.coachNotes).slice(0, 400).replace(/\s+/g, " "), "…");
}

main().catch((e) => { console.error(e); process.exit(1); });
