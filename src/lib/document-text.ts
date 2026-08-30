// ============================================================
// src/lib/document-text.ts — turn an uploaded CV into plain text.
//
// Every accepted format is reduced to text HERE, server-side, before the
// model sees it. That is deliberate and load-bearing: holding the real source
// text is what lets us verify the model's claims against the document instead
// of trusting them (see verifyAgainstSource in lib/resume.ts). If we passed a
// PDF straight to the model as a document block we would have nothing to
// check its answers against.
//
// Parsers are imported lazily so a route that never receives a given format
// never pays to load its parser.
//
// SERVER ONLY. Never import this from a client component — webpack will try
// to bundle Node's fs and the build will fail. Client code wants
// document-formats.ts instead.
// ============================================================

import {
  normalizeWhitespace,
  UnreadableDocumentError,
  type DocumentKind,
} from "./document-formats";

export {
  ACCEPTED_EXTENSIONS,
  kindForFileName,
  normalizeWhitespace,
  UnreadableDocumentError,
  type DocumentKind,
} from "./document-formats";


/** Strips RTF control words and groups. Good enough for a CV's prose. */
function rtfToText(raw: string): string {
  return normalizeWhitespace(
    raw
      .replace(/\\'([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\par[d]?\b/g, "\n")
      .replace(/\\tab\b/g, " ")
      .replace(/\\[a-zA-Z]+-?\d*\s?/g, "")
      .replace(/[{}]/g, "")
  );
}

/** Pulls the text nodes out of an OpenDocument content.xml. */
function odfXmlToText(xml: string): string {
  return normalizeWhitespace(
    xml
      .replace(/<text:(p|h)[^>]*>/g, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
  );
}

/**
 * Extracts plain text from a CV buffer. Throws UnreadableDocumentError with a
 * message written for the applicant when the file cannot be read.
 */
export async function extractDocumentText(buffer: Buffer, kind: DocumentKind): Promise<string> {
  try {
    switch (kind) {
      case "pdf": {
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: new Uint8Array(buffer) });
        try {
          const result = await parser.getText();
          // A scanned CV is an image with no text layer — say so specifically,
          // because "we couldn't read it" sends people round in circles.
          const text = normalizeWhitespace(result.text ?? "");
          if (text.replace(/--\s*\d+\s*of\s*\d+\s*--/g, "").trim().length < 40) {
            throw new UnreadableDocumentError(
              "That PDF has no readable text in it, which usually means it's a scan. Please upload a Word file, or paste the text."
            );
          }
          return text;
        } finally {
          await parser.destroy?.();
        }
      }
      case "docx": {
        const mammoth = (await import("mammoth")).default;
        const { value } = await mammoth.extractRawText({ buffer });
        return normalizeWhitespace(value ?? "");
      }
      case "doc": {
        const WordExtractor = (await import("word-extractor")).default;
        const doc = await new WordExtractor().extract(buffer);
        return normalizeWhitespace(doc.getBody() ?? "");
      }
      case "odt": {
        const JSZip = (await import("jszip")).default;
        const zip = await JSZip.loadAsync(buffer);
        const entry = zip.file("content.xml");
        if (!entry) throw new UnreadableDocumentError("That OpenDocument file looks damaged.");
        return odfXmlToText(await entry.async("string"));
      }
      case "rtf":
        return rtfToText(buffer.toString("utf8"));
      case "text":
        return normalizeWhitespace(buffer.toString("utf8"));
    }
  } catch (e) {
    if (e instanceof UnreadableDocumentError) throw e;
    // Keep the underlying parser error as `cause` — the applicant sees the
    // friendly message, but without this a parser failure is undiagnosable.
    throw new UnreadableDocumentError(
      "We couldn't open that file. Try a PDF or Word version, or paste the text.",
      { cause: e }
    );
  }
}
