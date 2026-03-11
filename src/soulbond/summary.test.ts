import { describe, expect, it } from "vitest";
import { evaluateDailySoulBond } from "./evaluate-daily.js";
import { formatSoulBondDailySummary, formatSoulBondDailySummaryFromEvaluation } from "./summary.js";
import { createDefaultInteractionSummary, createDefaultSoulBondState } from "./types.js";

describe("soulbond daily summary", () => {
  it("formats a readable summary from a finished daily evaluation", () => {
    const state = createDefaultSoulBondState();
    const summary = createDefaultInteractionSummary("2026-03-08");
    summary.greetings = 1;
    summary.meaningfulChats = 1;

    const result = evaluateDailySoulBond(state, summary);
    const text = formatSoulBondDailySummaryFromEvaluation(result);

    expect(text).toContain("Score: 70 / 100");
    expect(text).toContain("Result: Bond +1");
    expect(text).toContain("State Change:");
    expect(text).toContain("Bond: 0 -> 1");
    expect(text).toContain("Tone Result:");
    expect(text).toContain("Tone: reserved");
    expect(text).toContain("Started the day with a greeting (+10)");
  });

  it("explains a quiet day without inventing fake reasons", () => {
    const text = formatSoulBondDailySummary({
      record: {
        date: "2026-03-08",
        dailyScore: 50,
        bondDelta: 0,
        stage: "stranger",
        reasons: [],
      },
      currentBond: 0,
    });

    expect(text).toContain("Score: 50 / 100");
    expect(text).toContain("Result: Bond +0");
    expect(text).toContain("Bond: 0 -> 0");
    expect(text).toContain("No major interaction signals were recorded today.");
  });
});
