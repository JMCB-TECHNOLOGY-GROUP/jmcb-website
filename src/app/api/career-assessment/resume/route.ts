import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { resumeExtractSchema, formatIssues } from "@/lib/validation";
import { logError, logInfo, logWarn } from "@/lib/logger";
import {
  buildExtractionPrompt,
  normalizeExtraction,
  verifyExtraction,
  MAX_RESUME_BYTES,
  MAX_RESUME_TEXT,
} from "@/lib/resume";
import {
  extractDocumentText,
  kindForFileName,
  normalizeWhitespace,
  UnreadableDocumentError,
} from "@/lib/document-text";

// public endpoint: reads a job seeker's CV and returns a structured view of
// what they can evidence. Public by design (no accounts), so it is rate
// limited harder than the plain forms — every call costs a model request.
//
// The document is reduced to TEXT here, server-side, before the model sees
// it. That is what makes verification possible: we hold the real source, so
// every skill and achievement the model returns is checked against it and
// dropped when it isn't there. Nothing unverifiable reaches the applicant.
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
    const { fileBase64, fileName, text, targetRole, targetTitle } = parsed.data;

    if (!process.env.ANTHROPIC_API_KEY) {
      logWarn("resume-extract", "ANTHROPIC_API_KEY not configured");
      return NextResponse.json(
        { error: "CV reading is temporarily unavailable. You can carry on without it." },
        { status: 503 }
      );
    }

    // ── 1. Reduce whatever they sent to plain text ──
    let sourceText: string;
    let fileBuffer: Buffer | null = null;

    if (fileBase64 && fileName) {
      const kind = kindForFileName(fileName);
      if (!kind) {
        return NextResponse.json(
          { error: "We can read PDF, Word, OpenDocument, RTF and plain text files." },
          { status: 400 }
        );
      }
      const clean = fileBase64.replace(/\s/g, "");
      fileBuffer = Buffer.from(clean, "base64");
      if (fileBuffer.length > MAX_RESUME_BYTES) {
        return NextResponse.json({ error: "That file is too large. Keep it under 2.5MB." }, { status: 400 });
      }
      try {
        sourceText = await extractDocumentText(fileBuffer, kind);
      } catch (e) {
        // Log the real parser failure; return only the friendly message.
        const cause = String((e as { cause?: unknown })?.cause ?? e);
        logWarn("resume-extract", `could not read ${kind}: ${cause}`, { fileName });
        const message =
          e instanceof UnreadableDocumentError
            ? e.message
            : "We couldn't open that file. Try a PDF or Word version, or paste the text.";
        return NextResponse.json({ error: message }, { status: 422 });
      }
    } else {
      sourceText = normalizeWhitespace(String(text ?? ""));
    }

    sourceText = sourceText.slice(0, MAX_RESUME_TEXT);
    if (sourceText.trim().length < 50) {
      return NextResponse.json(
        { error: "There wasn't enough readable text in that. Try another file, or paste it." },
        { status: 422 }
      );
    }

    // ── 2. Ask the model to read it, with evidence for every claim ──
    const instruction = buildExtractionPrompt(targetRole || undefined, targetTitle || undefined);

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
        messages: [{ role: "user", content: `${instruction}\n\nThe CV:\n\n${sourceText}` }],
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

    // ── 3. Drop anything the CV does not actually support ──
    const { verified, report } = verifyExtraction(extraction, sourceText);
    if (report.skillsDropped || report.achievementsDropped) {
      logInfo("resume-extract", "dropped unverified items", { ...report });
    }

    // ── 4. Keep the original so Jermaine can read the real CV before calling.
    //      Non-fatal by design — see the STORAGE note above. ──
    let resumePath: string | null = null;
    if (fileBuffer && fileName) {
      try {
        const supabase = createServerClient();
        const ext = fileName.toLowerCase().split(".").pop() || "bin";
        const key = `cv-${randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from(RESUME_BUCKET).upload(key, fileBuffer, {
          contentType: request.headers.get("content-type") ?? "application/octet-stream",
          upsert: false,
        });
        if (error) logWarn("resume-extract", `storage write failed: ${error.message}`, { fileName });
        else resumePath = key;
      } catch (e) {
        logWarn("resume-extract", `storage unavailable: ${String(e)}`);
      }
    }

    // sourceText goes back to the browser so the report step can verify its
    // rewrites against the same document. It is the applicant's own CV, stays
    // in their own session, and is a few KB.
    return NextResponse.json({ extraction: verified, verification: report, sourceText, resumePath });
  } catch (error) {
    logError("resume-extract", error);
    return NextResponse.json({ error: "Failed to read the CV" }, { status: 500 });
  }
}
