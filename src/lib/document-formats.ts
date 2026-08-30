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
