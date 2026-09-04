// ============================================================
// src/lib/document-formats.ts — which CV formats we accept, and the text
// tidying both sides share.
//
// Deliberately free of parser imports so the browser can use it. The actual
// parsing lives in document-text.ts, which is server-only: pulling that into
// a client component drags Node's fs into the bundle and the build fails.
// ============================================================

export type DocumentKind = "pdf" | "docx" | "doc" | "odt" | "rtf" | "text";

/** Extensions we accept, for the file input's accept attribute. */
export const ACCEPTED_EXTENSIONS = ".pdf,.docx,.doc,.odt,.rtf,.txt,.md";

const EXTENSION_KIND: Record<string, DocumentKind> = {
  pdf: "pdf",
  docx: "docx",
  doc: "doc",
  odt: "odt",
  rtf: "rtf",
  txt: "text",
  md: "text",
  // Word's other variants carry the same containers as their common siblings.
  dot: "doc",
  dotx: "docx",
  docm: "docx",
};

/**
 * MIME type per extension, used when storing the original upload. Keyed by
 * extension rather than by DocumentKind because several extensions share a
 * kind but not a MIME type (.docm and .dotx both parse as docx).
 *
 * Must stay in step with the bucket's allowed_mime_types in
 * supabase/migrations/0002_resumes_bucket.sql — a type missing there is
 * rejected at upload.
 */
const EXTENSION_MIME: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  docm: "application/vnd.ms-word.document.macroEnabled.12",
  dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  doc: "application/msword",
  dot: "application/msword",
  odt: "application/vnd.oasis.opendocument.text",
  rtf: "application/rtf",
  txt: "text/plain",
  md: "text/markdown",
};

export function mimeForFileName(name: string): string {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return EXTENSION_MIME[ext] ?? "application/octet-stream";
}

export function kindForFileName(name: string): DocumentKind | null {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return EXTENSION_KIND[ext] ?? null;
}

/** Collapses runaway whitespace so quote matching is stable. */
export function normalizeWhitespace(s: string): string {
  return (
    s
      .replace(/\r\n?/g, "\n")
      .replace(/[^\S\n]+/g, " ")
      // Collapse the indentation renderers leave hanging off a line break,
      // otherwise every quote match has to tolerate a stray leading space.
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

export class UnreadableDocumentError extends Error {}
