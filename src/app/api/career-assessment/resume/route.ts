import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { resumeExtractSchema, formatIssues } from "@/lib/validation";
import { logError, logWarn } from "@/lib/logger";
import { buildExtractionPrompt, normalizeExtraction, MAX_RESUME_BYTES } from "@/lib/resume";

// public endpoint: reads a job seeker's CV and returns a structured view of
// what they can evidence. Public by design (no accounts), so it is rate
// limited harder than the plain forms — every call costs a model request.
//
// The PDF goes to the Messages API as a document block, which is why this
// project needs no PDF-parsing dependency.
//
// STORAGE: the original is written to a PRIVATE Supabase bucket named
// `resumes`, which must be created manually (see docs/deployment.md). If the
// bucket is missing or the write fails, extraction still succeeds and returns
// resumePath: null — a missing bucket must never cost the applicant their
// results. Signed URLs are minted at submit time, never here.

export const maxDuration = 60;

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-5";
const RESUME_BUCKET = "resumes";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`resume-extract:${ip}`, 3, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many uploads, please wait a moment" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await request.json();
    const parsed = resumeExtractSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatIssues(parsed.error) }, { status: 400 });
    }
    const { pdfBase64, text, fileName, targetRole, targetTitle } = parsed.data;

    if (!process.env.ANTHROPIC_API_KEY) {
      // Without a key we can't read the CV at all. Say so plainly rather than
      // returning an empty extraction the UI would render as "no skills found".
      logWarn("resume-extract", "ANTHROPIC_API_KEY not configured");
      return NextResponse.json(
        { error: "CV reading is temporarily unavailable. You can carry on without it." },
        { status: 503 }
      );
    }

    // Base64 must be unbroken for the API, and re-checking the decoded size
    // guards against a client that skipped the browser-side check.
    const cleanB64 = pdfBase64 ? pdfBase64.replace(/\s/g, "") : null;
    if (cleanB64 && (cleanB64.length * 3) / 4 > MAX_RESUME_BYTES) {
      return NextResponse.json({ error: "That file is too large. Keep it under 2.5MB." }, { status: 400 });
    }

    const instruction = buildExtractionPrompt(targetRole || undefined, targetTitle || undefined);
    const content = cleanB64
      ? [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: cleanB64 },
          },
          { type: "text", text: instruction },
        ]
      : [{ type: "text", text: `${instruction}\n\nThe CV text:\n\n${text}` }];

    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        output_config: { effort: "medium" },
        messages: [{ role: "user", content }],
      }),
    });

    if (!res.ok) {
      logError("resume-extract", new Error(`Anthropic ${res.status}: ${await res.text()}`));
      return NextResponse.json(
        { error: "We couldn't read that file. Try pasting the text instead." },
        { status: 502 }
      );
    }

    const data = await res.json();

    // A safety refusal returns HTTP 200 — check before reading content.
    if (data.stop_reason === "refusal") {
      logWarn("resume-extract", "model declined to read the document");
      return NextResponse.json(
        { error: "We couldn't read that file. Try pasting the text instead." },
        { status: 422 }
      );
    }

    const raw = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let extraction;
    try {
      extraction = normalizeExtraction(JSON.parse(cleaned));
    } catch {
      logError("resume-extract", new Error("model returned unparseable JSON"));
      return NextResponse.json(
        { error: "We couldn't make sense of that file. Try pasting the text instead." },
        { status: 502 }
      );
    }

    // Store the original so Jermaine can read the real CV before he calls.
    // Non-fatal by design — see the STORAGE note above.
    let resumePath: string | null = null;
    if (cleanB64) {
      try {
        const supabase = createServerClient();
        const key = `cv-${randomUUID()}.pdf`;
        const { error } = await supabase.storage
          .from(RESUME_BUCKET)
          .upload(key, Buffer.from(cleanB64, "base64"), {
            contentType: "application/pdf",
            upsert: false,
          });
        if (error) logWarn("resume-extract", `storage write failed: ${error.message}`, { fileName });
        else resumePath = key;
      } catch (e) {
        logWarn("resume-extract", `storage unavailable: ${String(e)}`);
      }
    }

    return NextResponse.json({ extraction, resumePath });
  } catch (error) {
    logError("resume-extract", error);
    return NextResponse.json({ error: "Failed to read the CV" }, { status: 500 });
  }
}
