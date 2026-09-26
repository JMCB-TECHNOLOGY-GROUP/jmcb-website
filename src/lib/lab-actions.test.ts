import { describe, expect, it } from "vitest";
import { parseLabAction } from "./lab-actions";

describe("parseLabAction", () => {
  it("requires a cell phone and time zone for the contact step", () => {
    const r = parseLabAction({ action: "contact", preferredContact: "text", timezone: "ET (US Eastern)" });
    expect(r).toEqual({ ok: false, error: "Your cell phone is required." });
    const tz = parseLabAction({ action: "contact", phone: "301 555 0123", preferredContact: "text" });
    expect(tz).toEqual({ ok: false, error: "Choose your time zone." });
    const ok = parseLabAction({ action: "contact", phone: "301 555 0123", preferredContact: "text", timezone: "ET (US Eastern)", smsOk: true });
    expect(ok.ok).toBe(true);
  });

  it("explains a short introduction instead of saying 'Invalid input'", () => {
    expect(parseLabAction({ action: "intro", intro: "hi" })).toEqual({
      ok: false,
      error: "Your introduction needs a few sentences (at least 40 characters).",
    });
  });

  it("asks for three postings when only two are given", () => {
    const p = { url: "https://example.com/1", title: "AI Engineer", company: "A" };
    expect(parseLabAction({ action: "target_role", targetRole: "AI Engineer", postings: [p, p], skills: "Python and evals" })).toEqual({
      ok: false,
      error: "Add three job postings: a link, title and company for each.",
    });
  });

  it("explains a bad posting link", () => {
    const p = { url: "example.com", title: "AI Engineer", company: "A" };
    const r = parseLabAction({ action: "target_role", targetRole: "AI Engineer", postings: [p, p, p], skills: "Python and evals" });
    expect(r).toEqual({ ok: false, error: "Each posting link must be a full link starting with https://" });
  });

  it("rejects an unknown action", () => {
    expect(parseLabAction({ action: "drop_tables" })).toEqual({ ok: false, error: "Unknown action." });
    expect(parseLabAction(null)).toEqual({ ok: false, error: "Unknown action." });
  });
});
