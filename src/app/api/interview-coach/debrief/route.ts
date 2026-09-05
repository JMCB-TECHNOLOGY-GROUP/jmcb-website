import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/send-email";
import { isLikelyBot } from "@/lib/bot-check";
import { logError, logWarn } from "@/lib/logger";
import { formatIssues } from "@/lib/validation";
import { extractJsonObject } from "@/lib/model-json";
import { coachSessionSchema, coachTurnSchema } from "@/lib/interview-coach-schemas";
import {
  COACH_NAME,
  RUBRIC,
  debriefFrom,
  groundBetterAnswer,
  buildDebriefPrompt,
  type CoachSession,
  type Turn,
} from "@/lib/interview-coach";

// public endpoint: ends an Interview Coach session. Computes the debrief
// deterministically, asks the model for the written read, the three fixes,
// two rewritten answers and a coach-facing paragraph, and, when the candidate
// gives an email, records the session as a lead and alerts Jermaine.
//
// The rewritten answers are grounded against the candidate's own words and
// the CV before they are returned; a rewrite carrying a figure they never
// gave is dropped.

export const maxDuration = 90;

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-5";
const JERMAINE_EMAIL = process.env.JERMAINE_EMAIL || "jermaine@jmcbtech.com";

const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const bodySchema = z.object({
  session: coachSessionSchema,
  turns: z.array(coachTurnSchema).min(1).max(12),
  contact: z
    .object({
      firstName: z.string().trim().max(120).optional().nullable(),
      lastName: z.string().trim().max(120).optional().nullable(),
      email: z.string().trim().email().max(254).optional().nullable(),
    })
    .optional()
    .nullable(),
  /** Set when the candidate is practising for a coach or employer. Goes in the notes. */
  coachRef: z.string().trim().max(120).optional().nullable(),
  website: z.string().max(200).optional().nullable(),
  formStartedAt: z.union([z.number(), z.string()]).optional().nullable(),
});

type Generated = {
  summary?: string;
  fixes?: string[];
  rewrittenAnswers?: { questionId: string; answer: string }[];
  coachNotes?: string;
};

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`coach-debrief:${ip}`, 6, 10 * 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests, slow down" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatIssues(parsed.error) }, { status: 400 });
    }
    const { session, contact, coachRef } = parsed.data;
    const turns = parsed.data.turns as Turn[];
    const debrief = debriefFrom(turns);
    const weakest = RUBRIC.find((r) => r.key === debrief.weakest);

    const fallback: Required<Generated> = {
      summary: `${session.firstName || "You"} scored ${debrief.overall} out of 100, which we call "${debrief.band.label}". ${debrief.band.summary} The line costing you most is ${weakest?.label ?? debrief.weakest}: ${weakest?.blurb ?? ""}`,
      fixes: [
        "Rewrite your weakest answer with a situation, what you did, and a figure, then say it out loud three times.",
        "Go through your CV and attach a number to every line that claims an improvement.",
        "Prepare two questions to ask them about the role's first project and the pay range.",
      ],
      rewrittenAnswers: [],
      coachNotes: `Overall ${debrief.overall}/100. Strongest: ${debrief.strongest}. Weakest: ${debrief.weakest}. Practise turning duties into measured results.`,
    };

    let generated: Generated = {};
    let wasGenerated = false;

    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 12000,
          output_config: { effort: "medium" },
          messages: [{ role: "user", content: buildDebriefPrompt(session as CoachSession, turns, debrief) }],
        }),
      });
      if (!res.ok) {
        logError("coach-debrief", new Error(`Anthropic ${res.status}: ${await res.text()}`));
      } else {
        const data = await res.json();
        if (data.stop_reason === "refusal" || data.stop_reason === "max_tokens") {
          logError("coach-debrief", new Error(`model stopped: ${data.stop_reason}`));
        } else {
          const text = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
          try {
            generated = extractJsonObject(text) as Generated;
            wasGenerated = typeof generated.summary === "string" && generated.summary.trim() !== "";
          } catch {
            logError("coach-debrief", new Error("model returned unparseable JSON"), { head: text.slice(0, 200) });
          }
        }
      }
    } else {
      logWarn("coach-debrief", "ANTHROPIC_API_KEY not configured");
    }

    // The model does not always honour the exact shape: fixes arrive as
    // objects or one numbered string, coach notes as an object, rewrites
    // under a different key. Coerce what can be coerced and log what fell
    // back, so a shape drift shows up in the logs rather than as canned text
    // on the applicant's screen (which is how the first production run
    // surfaced it).
    const asText = (v: unknown): string => {
      if (typeof v === "string") return v.trim();
      if (Array.isArray(v)) return v.map(asText).filter(Boolean).join(" ");
      if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        for (const k of ["text", "fix", "note", "value", "answer", "body", "content"]) {
          if (typeof o[k] === "string") return (o[k] as string).trim();
        }
        return Object.values(o).map(asText).filter(Boolean).join(" ");
      }
      return "";
    };
    const asList = (v: unknown): string[] => {
      if (Array.isArray(v)) return v.map(asText).filter(Boolean);
      if (typeof v === "string") {
        return v
          .split(/\n+/)
          .map((l) => l.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, "").trim())
          .filter(Boolean);
      }
      return [];
    };

    const g = generated as Record<string, unknown>;
    const fixes = asList(g.fixes ?? g.actions ?? g.nextSteps).slice(0, 3);
    const coachNotes = asText(g.coachNotes ?? g.coach_notes ?? g.notesForCoach);
    const rawRewrites = g.rewrittenAnswers ?? g.rewrites ?? g.rewritten_answers;

    // Ground every rewritten answer against what the candidate said for that
    // question, plus the CV. Drop, don't soften.
    let rewritesDropped = 0;
    const rewrittenAnswers = (Array.isArray(rawRewrites) ? rawRewrites : [])
      .map((r) => {
        const o = (r ?? {}) as Record<string, unknown>;
        const answerText = asText(o.answer ?? o.rewrite ?? o.rewrittenAnswer ?? o.text);
        const turn =
          turns.find((t) => t.questionId === o.questionId) ??
          turns.find((t) => typeof o.question === "string" && t.question === o.question);
        if (!turn || !answerText) return null;
        const grounded = groundBetterAnswer(answerText, `${turn.answer}\n${turn.followUpAnswer ?? ""}`, session.cvText ?? "", session.cvFacts);
        if (!grounded) rewritesDropped++;
        return grounded ? { questionId: turn.questionId, question: turn.question, answer: grounded } : null;
      })
      .filter((r): r is { questionId: string; question: string; answer: string } => Boolean(r))
      .slice(0, 2);

    if (wasGenerated && (!fixes.length || !coachNotes || (!rewrittenAnswers.length && !rewritesDropped))) {
      logWarn("coach-debrief", "model reply missed fields, fell back", {
        keys: Object.keys(g),
        fixesType: typeof g.fixes,
        coachNotesType: typeof g.coachNotes,
        rewritesType: Array.isArray(rawRewrites) ? `array(${rawRewrites.length})` : typeof rawRewrites,
      });
    }
    if (rewritesDropped) logWarn("coach-debrief", `dropped ${rewritesDropped} ungrounded rewrites`);

    const result = {
      ...debrief,
      summary: wasGenerated ? generated.summary! : fallback.summary,
      fixes: fixes.length ? fixes : fallback.fixes,
      rewrittenAnswers,
      coachNotes: coachNotes || fallback.coachNotes,
      generated: wasGenerated,
    };

    // ── Record it, when they told us who they are. Non-fatal. ──
    let recorded = false;
    if (contact?.email && !isLikelyBot(body)) {
      try {
        const email = contact.email.toLowerCase();
        const note = [
          `[${COACH_NAME} — ${new Date().toISOString()}]`,
          `Target: ${session.targetTitle}`,
          coachRef ? `Practising for: ${coachRef}` : null,
          `Overall: ${result.overall}/100 (${result.band.label}) · strongest ${result.strongest} · weakest ${result.weakest}`,
          ...RUBRIC.map((r) => `  ${r.label}: ${result.averages[r.key]}/5`),
          "",
          "COACH NOTES",
          `  ${result.coachNotes}`,
          "",
          "TRANSCRIPT",
          ...turns.flatMap((t, i) => [
            `  Q${i + 1}: ${t.question}`,
            `  A: ${t.answer.slice(0, 600)}`,
            `  (s${t.score.structure} e${t.score.evidence} r${t.score.relevance} c${t.score.concision}) ${t.score.note}`,
          ]),
        ]
          .filter((l) => l !== null)
          .join("\n");

        const supabase = createServerClient();
        const { data: existing } = await supabase.from("leads").select("id, notes").eq("email", email).single();
        if (existing) {
          await supabase
            .from("leads")
            .update({ notes: existing.notes ? `${existing.notes}\n\n${note}` : note, updated_at: new Date().toISOString() })
            .eq("id", existing.id);
        } else {
          await supabase.from("leads").insert({
            email,
            first_name: contact.firstName || session.firstName || "",
            last_name: contact.lastName || "",
            source: "interview_coach",
            status: "new",
            notes: note,
          });
        }
        recorded = true;

        await sendEmail(
          JERMAINE_EMAIL,
          `${COACH_NAME} — ${esc(contact.firstName || session.firstName || "Candidate")} for ${esc(session.targetTitle)} (${result.overall}/100)`,
          `<p><strong>${esc(contact.firstName || "")} ${esc(contact.lastName || "")}</strong> &lt;${esc(email)}&gt;</p>
           <p><strong>Target:</strong> ${esc(session.targetTitle)}<br>
              ${coachRef ? `<strong>Practising for:</strong> ${esc(coachRef)}<br>` : ""}
              <strong>Overall:</strong> ${result.overall}/100 (${esc(result.band.label)})<br>
              <strong>Strongest:</strong> ${esc(result.strongest)} · <strong>Weakest:</strong> ${esc(result.weakest)}</p>
           <h3 style="margin-bottom:4px">Coach notes</h3>
           <p style="margin-top:0">${esc(result.coachNotes)}</p>
           <h3 style="margin-bottom:4px">Rubric</h3>
           <ul style="margin-top:0">${RUBRIC.map((r) => `<li>${esc(r.label)}: ${result.averages[r.key]}/5</li>`).join("")}</ul>`,
          email
        );
      } catch (e) {
        logWarn("coach-debrief", `could not record session: ${String(e)}`);
      }
    }

    return NextResponse.json({ ...result, recorded });
  } catch (error) {
    logError("coach-debrief", error);
    return NextResponse.json({ error: "Failed to build the debrief" }, { status: 500 });
  }
}
