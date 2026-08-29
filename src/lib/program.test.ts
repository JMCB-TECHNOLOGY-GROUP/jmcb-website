import { describe, it, expect } from "vitest";
import {
  COHORT,
  SESSION_DATES,
  WEEKS,
  SESSION_DAY,
  formatSessionDate,
  formatShortDate,
} from "./program";

// The schedule is the one part of the programme data that can silently go
// wrong: a mistyped date lands a "Thursday" session on a Tuesday and nobody
// notices until the invitations are out. These tests are the safety net for
// editing COHORT and SESSION_DATES between cohorts.
describe("programme schedule", () => {
  const dayIndex: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
  };

  it("runs every session on the advertised day of the week", () => {
    for (const date of SESSION_DATES) {
      expect(new Date(`${date}T12:00:00Z`).getUTCDay(), `${date} is not a ${SESSION_DAY}`).toBe(
        dayIndex[SESSION_DAY]
      );
    }
  });

  it("schedules sessions exactly one week apart, in order", () => {
    for (let i = 1; i < SESSION_DATES.length; i++) {
      const prev = Date.parse(`${SESSION_DATES[i - 1]}T12:00:00Z`);
      const curr = Date.parse(`${SESSION_DATES[i]}T12:00:00Z`);
      expect(curr - prev).toBe(7 * 24 * 60 * 60 * 1000);
    }
  });

  it("closes applications and holds the info session before the cohort starts", () => {
    expect(Date.parse(COHORT.infoSession)).toBeLessThan(Date.parse(COHORT.applicationsClose));
    expect(Date.parse(COHORT.applicationsClose)).toBeLessThan(Date.parse(COHORT.startDate));
  });

  it("matches the cohort start and end dates to the first and last session", () => {
    expect(COHORT.startDate).toBe(SESSION_DATES[0]);
    expect(COHORT.endDate).toBe(SESSION_DATES[SESSION_DATES.length - 1]);
  });
});

describe("weekly curriculum", () => {
  it("has one week per session date, numbered from one", () => {
    expect(WEEKS).toHaveLength(SESSION_DATES.length);
    WEEKS.forEach((w, i) => {
      expect(w.week).toBe(i + 1);
      expect(w.date).toBe(SESSION_DATES[i]);
    });
  });

  it("gives every week a distinct named project with a rubric", () => {
    const names = WEEKS.map((w) => w.project);
    expect(new Set(names).size).toBe(names.length);
    for (const w of WEEKS) {
      expect(w.brief.length).toBeGreaterThan(80);
      expect(w.rubric.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("date formatting", () => {
  it("formats in UTC so the displayed weekday cannot drift by timezone", () => {
    expect(formatSessionDate("2026-10-01")).toBe("Thursday, October 1, 2026");
    expect(formatShortDate("2026-10-01")).toBe("Thu, Oct 1");
  });
});
