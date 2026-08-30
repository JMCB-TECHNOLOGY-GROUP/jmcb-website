import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import {
  extractDocumentText,
  kindForFileName,
  normalizeWhitespace,
  UnreadableDocumentError,
} from "./document-text";

// Fixtures are built in memory rather than committed as binaries, so the test
// proves the real parsers run against real files of each format.

async function makeDocx(paragraphs: string[]): Promise<Buffer> {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`
  );
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`
  );
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs
      .map((p) => `<w:p><w:r><w:t>${p}</w:t></w:r></w:p>`)
      .join("")}</w:body></w:document>`
  );
  return zip.generateAsync({ type: "nodebuffer" });
}

async function makeOdt(paragraphs: string[]): Promise<Buffer> {
  const zip = new JSZip();
  zip.file("mimetype", "application/vnd.oasis.opendocument.text");
  zip.file(
    "content.xml",
    `<?xml version="1.0" encoding="UTF-8"?><office:document-content xmlns:office="urn:oasis" xmlns:text="urn:text"><office:body><office:text>${paragraphs
      .map((p) => `<text:p>${p}</text:p>`)
      .join("")}</office:text></office:body></office:document-content>`
  );
  return zip.generateAsync({ type: "nodebuffer" });
}

/** A minimal single-page PDF with a real text layer. */
function makePdf(line: string): Buffer {
  const stream = Buffer.from(`BT /F1 12 Tf 72 720 Td (${line}) Tj ET`);
  const objs = [
    Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"),
    Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    Buffer.from(
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>"
    ),
    Buffer.concat([Buffer.from(`<< /Length ${stream.length} >>\nstream\n`), stream, Buffer.from("\nendstream")]),
    Buffer.from("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
  ];
  let out = Buffer.from("%PDF-1.4\n");
  const offsets: number[] = [];
  objs.forEach((o, i) => {
    offsets.push(out.length);
    out = Buffer.concat([out, Buffer.from(`${i + 1} 0 obj\n`), o, Buffer.from("\nendobj\n")]);
  });
  const xref = out.length;
  let table = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => (table += `${String(o).padStart(10, "0")} 00000 n \n`));
  table += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.concat([out, Buffer.from(table)]);
}

describe("format detection", () => {
  it.each([
    ["resume.pdf", "pdf"],
    ["resume.docx", "docx"],
    ["resume.doc", "doc"],
    ["resume.odt", "odt"],
    ["resume.rtf", "rtf"],
    ["resume.txt", "text"],
    ["resume.md", "text"],
    ["RESUME.DOCX", "docx"],
    ["my.cv.final.docx", "docx"],
  ])("maps %s", (name, expected) => {
    expect(kindForFileName(name)).toBe(expected);
  });

  it("returns null for formats we cannot read", () => {
    for (const n of ["cv.pages", "cv.png", "cv", "cv.zip"]) {
      expect(kindForFileName(n), n).toBeNull();
    }
  });
});

describe("text extraction", () => {
  it("reads a real .docx", async () => {
    const buf = await makeDocx(["Jane Doe", "Cut rota conflicts by 60%."]);
    const text = await extractDocumentText(buf, "docx");
    expect(text).toContain("Jane Doe");
    expect(text).toContain("Cut rota conflicts by 60%.");
  });

  it("reads a real .odt", async () => {
    const buf = await makeOdt(["Jane Doe", "Managed a team of 12."]);
    const text = await extractDocumentText(buf, "odt");
    expect(text).toContain("Jane Doe");
    expect(text).toContain("Managed a team of 12.");
  });

  it("reads a real .pdf with a text layer", async () => {
    // Realistic length: the scan check below rejects anything under 40
    // characters, and a real CV never is.
    const text = await extractDocumentText(
      makePdf("Jane Doe Operations Manager at Riverside Health 2018 to 2026"),
      "pdf"
    );
    expect(text).toContain("Jane Doe");
    expect(text).toContain("Operations Manager");
    expect(text).toContain("Riverside Health");
  });

  it("tells the applicant when a PDF is a scan with no text layer", async () => {
    await expect(extractDocumentText(makePdf(" "), "pdf")).rejects.toThrow(UnreadableDocumentError);
    await expect(extractDocumentText(makePdf(" "), "pdf")).rejects.toThrow(/scan/i);
  });

  it("reads .rtf, stripping control words", async () => {
    const rtf = Buffer.from(
      String.raw`{\rtf1\ansi\deff0 {\fonttbl{\f0 Times;}}\f0\fs24 Jane Doe\par Cut conflicts by 60\par}`
    );
    const text = await extractDocumentText(rtf, "rtf");
    expect(text).toContain("Jane Doe");
    expect(text).toContain("Cut conflicts by 60");
    expect(text).not.toContain("rtf1");
    expect(text).not.toContain("fonttbl");
  });

  it("reads plain text", async () => {
    const text = await extractDocumentText(Buffer.from("Jane Doe\nOperations Manager"), "text");
    expect(text).toBe("Jane Doe\nOperations Manager");
  });

  it("raises a readable error for a corrupt file rather than throwing raw", async () => {
    await expect(extractDocumentText(Buffer.from("not a docx"), "docx")).rejects.toThrow(
      UnreadableDocumentError
    );
    await expect(extractDocumentText(Buffer.from("not an odt"), "odt")).rejects.toThrow(
      /couldn't open|damaged/i
    );
  });
});

describe("normalizeWhitespace", () => {
  it("collapses the line-break noise PDF renderers produce", () => {
    expect(normalizeWhitespace("a  \r\n\r\n\r\n  b   c")).toBe("a\n\nb c");
  });

  it("strips indentation hanging off a line break", () => {
    expect(normalizeWhitespace("Skills:\n    Excel,   Power BI")).toBe("Skills:\nExcel, Power BI");
  });

  it("leaves already-clean text alone", () => {
    expect(normalizeWhitespace("Jane Doe\n\nOperations Manager")).toBe("Jane Doe\n\nOperations Manager");
  });
});
