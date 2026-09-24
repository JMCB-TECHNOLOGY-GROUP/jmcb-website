import { describe, expect, it } from "vitest";
import { certificationIntakeSchema, programApplicationSchema } from "./validation";
import { EXAMS } from "./certification";

const valid = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "+1 301 555 0123",
  smsOk: true,
  preferredContact: "text",
  location: "Bowie, MD",
  timezone: "ET (US Eastern)",
  path: "associate",
  exam: "ccdv_f",
  experience: "builder",
  hoursPerWeek: 6,
  addressRequest: "ada.lovelace",
  goal: "Get certified and build on real client work.",
  acknowledgeFee: true,
};

describe("certificationIntakeSchema", () => {
  it("accepts a complete intake", () => {
    expect(certificationIntakeSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a cell phone", () => {
    expect(certificationIntakeSchema.safeParse({ ...valid, phone: undefined }).success).toBe(false);
    expect(certificationIntakeSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false);
  });

  it("requires the exam-fee acknowledgement", () => {
    expect(certificationIntakeSchema.safeParse({ ...valid, acknowledgeFee: false }).success).toBe(false);
  });

  it("rejects an address request that is not a mailbox local part", () => {
    expect(certificationIntakeSchema.safeParse({ ...valid, addressRequest: "ada@gmail.com" }).success).toBe(false);
  });

  it("never offers the Associate certification, which does not count toward partner tiers", () => {
    expect(EXAMS.map((e) => e.value)).not.toContain("associate");
  });
});

describe("programApplicationSchema", () => {
  it("now requires a phone number", () => {
    const base = {
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      realTask: "Update the weekly fund report, about an hour each Monday.",
    };
    expect(programApplicationSchema.safeParse(base).success).toBe(false);
    expect(programApplicationSchema.safeParse({ ...base, phone: "301 555 0123" }).success).toBe(true);
  });
});
