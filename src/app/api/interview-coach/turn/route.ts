import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logError, logWarn } from "@/lib/logger";
import { formatIssues } from "@/lib/validation";
import { extractJsonObject } from "@/lib/model-json";
import { coachSessionSchema, coachTurnSchema } from "@/lib/interview-coach-schemas";
import {
  answerSignals,
  heuristicScore,
  normalizeScore,
  groundBetterAnswer,
  buildTurnPrompt,
  type CoachSession,
  type Turn,
} from "@/lib/interview-coach";

// public endpoint: scores one interview answer and returns the next question.
//
// The question plan lives in the session the browser holds, built
// deterministically by lib/interview-coach.ts, so the server never has to
// remember anything between turns and a refresh loses only the transcript.
// The model scores and writes the note; the rubric floors and the grounding
// of any suggested answer are applied here, after the model, every time.
//
// Public by design (no accounts yet), so rate limited per IP. Each call is a
// model request; the limit is set for one person practising, not a script.

export const maxDuration = 60;

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-5";

const bodySchema = z.object({
  session: coachSessionSchema,
  turns: z.array(coachTurnSchema).max(12),
  questionId: z.string().trim().max(40),
  answer: z.string().trim().min(1).max(6000),
  /** True when `answer` already includes the reply to a follow-up. */
  isFollowUp: z.boolean().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`coach-turn:${ip}`, 40, 10 * 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "That's a lot of practice. Take a short break and come back." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: formatIssues(parsed.error) }, { status: 400 });
    }
    const { session, questionId, answer, isFollowUp } = parsed.data;
    const turns = parsed.data.turns as Turn[];

    const index = session.questions.findIndex((q) => q.id === questionId);
    if (index === -1) {
      return NextResponse.json({ error: "That question isn't in this interview." }, { status: 400 });
    }
    const question = session.questions[index];
    const nextQuestion = session.questions[index + 1] ?? null;

    const signals = answerSignals(answer);
    // One follow-up per question, and only when the answer left the key
    // thing unproven. A strong answer moves on.
    const alreadyFollowedUp = Boolean(isFollowUp) || turns.some((t) => t.questionId === questionId && t.followUp);
    const allowFollowUp = !alreadyFollowedUp && (!signals.hasFigure || signals.words < 25 || signals.ownership < 0.5);

    const fallback = {
      score: heuristicScore(answer, signals),
      followUp: null as string | null,
      nextQuestion,
      generated: false,
    };

    if (!process.env.ANTHROPIC_API_KEY) {
      logWarn("coach-turn", "ANTHROPIC_API_KEY not configured");
      return NextResponse.json(fallback);
    }

    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        // Thinking counts against this. The reply itself is a few hundred tokens.
        max_tokens: 6000,
        // Low effort: someone is waiting on every turn, and the rubric floors
        // in normalizeScore catch a generous score.
        output_config: { effort: "low" },
        messages: [
          {
            role: "user",
            content: buildTurnPrompt(session as CoachSession, turns, question, answer, signals, allowFollowUp),
          },
        ],
      }),
    });

    if (!res.ok) {
      logError("coach-turn", new Error(`Anthropic ${res.status}: ${await res.text()}`));
      return NextResponse.json(fallback);
    }
    const data = await res.json();
    if (data.stop_reason === "refusal" || data.stop_reason === "max_tokens") {
      logError("coach-turn", new Error(`model stopped: ${data.stop_reason}`));
      return NextResponse.json(fallback);
    }

    const text = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
    let raw: Record<string, unknown>;
    try {
      raw = extractJsonObject(text) as Record<string, unknown>;
    } catch {
      logError("coach-turn", new Error("model returned unparseable JSON"), { head: text.slice(0, 200) });
      return NextResponse.json(fallback);
    }

    const score = normalizeScore(raw, answer);
    score.betterAnswer = groundBetterAnswer(score.betterAnswer, answer, session.cvText ?? "", session.cvFacts);

    const followUpText = typeof raw.followUp === "string" ? raw.followUp.trim().slice(0, 300) : "";
    const followUp = allowFollowUp && followUpText ? followUpText : null;

    return NextResponse.json({ score, followUp, nextQuestion, generated: true });
  } catch (error) {
    logError("coach-turn", error);
    return NextResponse.json({ error: "Something went wrong scoring that answer." }, { status: 500 });
  }
}
