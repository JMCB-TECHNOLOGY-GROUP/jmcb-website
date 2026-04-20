import { describe, it, expect } from "vitest";
import {
  emailDay0,
  emailDay1,
  emailDay3,
  emailDay7,
  emailPartialRecovery,
  emailLeadNotification,
  emailHotLeadAlert,
} from "./email-renderer";

describe("emailDay0 - Immediate results email", () => {
  const baseData = {
    firstName: "Marcus",
    organization: "TechCorp",
    overallScore: 65,
    dimensionScores: {
      "Data Foundation": 3.5,
      "AI Strategy": 2.0,
      "Team Literacy": 4.0,
    },
    weakestDimension: "AI Strategy",
    strongestDimension: "Team Literacy",
    priorityAction: "Schedule an AI strategy workshop with leadership.",
  };

  it("includes the recipient name and score in subject", () => {
    const { subject } = emailDay0(baseData);
    expect(subject).toContain("Marcus");
    expect(subject).toContain("65");
  });

  it("generates valid HTML with score box", () => {
    const { html } = emailDay0(baseData);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("65");
    expect(html).toContain("TechCorp");
  });

  it("classifies score level correctly", () => {
    const { html } = emailDay0({ ...baseData, overallScore: 85 });
    expect(html).toContain("AI Leader");
  });

  it("includes report link when provided", () => {
    const { html } = emailDay0({
      ...baseData,
      reportUrl: "https://example.com/report.pdf",
    });
    expect(html).toContain("https://example.com/report.pdf");
    expect(html).toContain("View");
  });

  it("shows weakest dimension as priority", () => {
    const { html } = emailDay0(baseData);
    expect(html).toContain("AI Strategy");
    expect(html).toContain("Priority");
  });

  it("includes Calendly booking link", () => {
    const { html } = emailDay0(baseData);
    expect(html).toContain("calendly.com");
  });
});

describe("emailDay1 - Weakest dimension deep dive", () => {
  it("mentions the weakest dimension in subject", () => {
    const { subject } = emailDay1({
      firstName: "Sarah",
      organization: "HealthCo",
      weakestDimension: "Data Foundation",
      weakestScore: 1.5,
      priorityAction: "Audit all data sources.",
      service: "Data Readiness Assessment",
      serviceDesc: "We audit your data landscape.",
    });
    expect(subject).toContain("Sarah");
    expect(subject).toContain("HealthCo");
  });

  it("includes the score in the body", () => {
    const { html } = emailDay1({
      firstName: "Sarah",
      organization: "HealthCo",
      weakestDimension: "Data Foundation",
      weakestScore: 1.5,
      priorityAction: "Audit all data sources.",
      service: "Data Readiness Assessment",
      serviceDesc: "We audit your data landscape.",
    });
    expect(html).toContain("1.5");
    expect(html).toContain("Data Foundation");
  });
});

describe("emailDay3 - Social proof", () => {
  it("includes company size and score in context", () => {
    const { html } = emailDay3({
      firstName: "James",
      organization: "ScaleCo",
      overallScore: 45,
      companySize: "51-200",
    });
    expect(html).toContain("51-200");
    expect(html).toContain("AI Emerging");
  });

  it("uses correct tier label for high scorers", () => {
    const { html } = emailDay3({
      firstName: "James",
      organization: "ScaleCo",
      overallScore: 72,
      companySize: "200+",
    });
    expect(html).toContain("AI Ready");
  });
});

describe("emailDay7 - Final urgency", () => {
  it("includes action-oriented subject line", () => {
    const { subject } = emailDay7({
      firstName: "Alex",
      organization: "InnovateCo",
      weakestDimension: "Process Automation",
      overallScore: 38,
    });
    expect(subject).toContain("Alex");
    expect(subject).toContain("act");
  });
});

describe("emailPartialRecovery - Abandoned assessment", () => {
  it("shows questions remaining", () => {
    const { subject, html } = emailPartialRecovery({
      firstName: "Dana",
      resumeToken: "abc123",
      questionsAnswered: 6,
    });
    expect(subject).toContain("6/10");
    expect(html).toContain("4 questions left");
    expect(html).toContain("resume=abc123");
  });
});

describe("emailLeadNotification", () => {
  it("includes lead score badge and all details", () => {
    const { subject, html } = emailLeadNotification({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      organization: "BigCorp",
      role: "c-suite",
      companySize: "200+",
      overallScore: 35,
      leadScore: "hot",
      weakestDimension: "Data Foundation",
      strongestDimension: "Leadership Alignment",
      reason: "Executive with critical gaps",
      reportUrl: "https://example.com/report",
      dimensionScores: { "Data Foundation": 1.5, "Leadership Alignment": 4.0 },
    });
    expect(subject).toContain("HOT");
    expect(subject).toContain("John Doe");
    expect(html).toContain("HOT");
    expect(html).toContain("john@example.com");
  });
});

describe("emailHotLeadAlert", () => {
  it("generates urgent alert email", () => {
    const { subject, html } = emailHotLeadAlert({
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria@enterprise.com",
      organization: "Enterprise Inc",
      role: "vp",
      companySize: "200+",
      overallScore: 28,
      leadScore: "hot",
      weakestDimension: "AI Strategy & Vision",
      strongestDimension: "Team AI Literacy",
      reason: "VP at large company with critical gaps",
    });
    expect(subject).toContain("HOT LEAD");
    expect(subject).toContain("Maria Garcia");
    expect(html).toContain("Hot Lead Alert");
    expect(html).toContain("24 hours");
  });
});
