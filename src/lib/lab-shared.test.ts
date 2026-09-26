import { describe, expect, it } from "vitest";
import { ROUTE_QUESTIONS, isStepDone, progress, recommendRoute, type LabStudentView } from "./lab-shared";

const blank: LabStudentView = {
  id: "x",
  first_name: "Ada",
  last_name: "L",
  email: "a@example.com",
  phone: null,
  sms_ok: false,
  preferred_contact: null,
  timezone: null,
  contact_confirmed_at: null,
  real_task: null,
  status: "active",
  github_username: null,
  github_verified_at: null,
  intro: null,
  linkedin: null,
  target_role: null,
  role_postings: [],
  role_skills: null,
  route: null,
  route_reason: null,
  paid_at: null,
  agreement_signed_at: null,
  address_request: null,
  jmcb_address: null,
};

describe("lab progress", () => {
  it("starts at GitHub with nothing done", () => {
    expect(progress(blank)).toEqual({ done: 0, total: 8, next: "contact" });
  });

  it("needs three postings and the skills list for the target-role step", () => {
    const two = { ...blank, target_role: "AI engineer", role_skills: "Python", role_postings: [{ url: "u", title: "t", company: "c" }, { url: "u2", title: "t", company: "c" }] };
    expect(isStepDone(two, "target_role")).toBe(false);
    const three = { ...two, role_postings: [...two.role_postings, { url: "u3", title: "t", company: "c" }] };
    expect(isStepDone(three, "target_role")).toBe(true);
  });

  it("is complete only once the address is issued", () => {
    const all = {
      ...blank,
      phone: "301 555 0123",
      timezone: "ET (US Eastern)",
      contact_confirmed_at: "t",
      github_verified_at: "t",
      intro: "hi",
      target_role: "r",
      role_skills: "s",
      role_postings: [1, 2, 3].map((i) => ({ url: `u${i}`, title: "t", company: "c" })),
      route: "pl400" as const,
      paid_at: "t",
      agreement_signed_at: "t",
    };
    expect(progress(all).next).toBe("jmcb_address");
    expect(progress({ ...all, jmcb_address: "a@jmcbtech.com" })).toEqual({ done: 8, total: 8, next: null });
  });
});

describe("contact step", () => {
  it("is required even when the application already had a phone", () => {
    expect(isStepDone({ ...blank, phone: "301 555 0123" }, "contact")).toBe(false);
    expect(isStepDone({ ...blank, phone: "301 555 0123", timezone: "ET (US Eastern)", contact_confirmed_at: "t" }, "contact")).toBe(true);
  });
});

describe("recommendRoute", () => {
  it("waits for every question", () => {
    expect(recommendRoute(["pl400", null, null, null, null])).toBeNull();
  });
  it("follows the majority", () => {
    expect(recommendRoute(["pl400", "pl400", "pl400", "claude_arch", "claude_arch"])).toBe("pl400");
    expect(recommendRoute(["claude_arch", "claude_arch", "claude_arch", "pl400", "pl400"])).toBe("claude_arch");
  });
  it("has an odd number of questions so there is never a tie", () => {
    expect(ROUTE_QUESTIONS.length % 2).toBe(1);
  });
});
