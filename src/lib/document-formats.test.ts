import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { mimeForFileName, kindForFileName, ACCEPTED_EXTENSIONS } from "./document-formats";

describe("MIME types", () => {
  it.each([
    ["cv.pdf", "application/pdf"],
    ["cv.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    ["cv.doc", "application/msword"],
    ["cv.odt", "application/vnd.oasis.opendocument.text"],
    ["cv.rtf", "application/rtf"],
    ["cv.txt", "text/plain"],
    ["CV.PDF", "application/pdf"],
    ["my.cv.final.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ])("maps %s", (name, expected) => {
    expect(mimeForFileName(name)).toBe(expected);
  });

  it("falls back rather than guessing for an unknown extension", () => {
    expect(mimeForFileName("cv.pages")).toBe("application/octet-stream");
  });

  it("gives a distinct MIME type to extensions that share a parser", () => {
    // .docm and .dotx both parse as docx but are not the same file type.
    expect(mimeForFileName("cv.docm")).not.toBe(mimeForFileName("cv.docx"));
    expect(kindForFileName("cv.docm")).toBe(kindForFileName("cv.docx"));
  });
});

describe("accepted extensions", () => {
  it("lists exactly the extensions the parser recognises", () => {
    for (const ext of ACCEPTED_EXTENSIONS.split(",")) {
      expect(kindForFileName(`cv${ext}`), ext).not.toBeNull();
    }
  });

  it("gives every accepted extension a real MIME type", () => {
    for (const ext of ACCEPTED_EXTENSIONS.split(",")) {
      expect(mimeForFileName(`cv${ext}`), ext).not.toBe("application/octet-stream");
    }
  });
});

// The bucket rejects an upload whose MIME type it does not allow, and that
// failure is non-fatal and easy to miss — it just silently stops retaining
// CVs. This test is what stops the two lists drifting apart.
describe("storage bucket stays in step with the code", () => {
  const migration = readFileSync(
    join(process.cwd(), "supabase/migrations/0002_resumes_bucket.sql"),
    "utf8"
  );

  it("allows every MIME type we can upload", () => {
    for (const ext of ACCEPTED_EXTENSIONS.split(",")) {
      const mime = mimeForFileName(`cv${ext}`);
      expect(migration, `${ext} (${mime}) missing from the bucket's allowed_mime_types`).toContain(
        mime
      );
    }
  });

  it("keeps the bucket private", () => {
    expect(migration).toMatch(/'resumes',\s*\n?\s*false/);
    expect(migration).not.toMatch(/public\s*=\s*true/);
  });

  it("matches the size ceiling the application enforces", async () => {
    const { MAX_RESUME_BYTES } = await import("./resume");
    expect(migration).toContain(String(MAX_RESUME_BYTES));
  });
});
