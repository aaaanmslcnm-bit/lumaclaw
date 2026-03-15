import { describe, expect, it } from "vitest";
import { evaluateDailySoulBond } from "./evaluate-daily.js";
import { createDefaultInteractionSummary, createDefaultSoulBondState } from "./types.js";

describe("daily soulbond evaluation", () => {
  it("adds one bond point when the daily score meets the default threshold", () => {
    const state = createDefaultSoulBondState();
    const summary = createDefaultInteractionSummary("2026-03-08");
    summary.greetings = 1;
    summary.meaningfulChats = 1;

    const result = evaluateDailySoulBond(state, summary);

    expect(result.record.dailyScore).toBe(70);
    expect(result.record.bondDelta).toBe(1);
    expect(result.nextState.bond).toBe(1);
    expect(result.nextState.currentDay).toBe(1);
    expect(result.nextState.dailyHistory).toHaveLength(1);
    expect(result.nextState.lastEvaluationAt).toBeTruthy();
  });

  it("does not add bond when the day stays below the threshold", () => {
    const state = createDefaultSoulBondState();
    const summary = createDefaultInteractionSummary("2026-03-08");
    summary.greetings = 1;

    const result = evaluateDailySoulBond(state, summary);

    expect(result.record.dailyScore).toBe(60);
    expect(result.record.bondDelta).toBe(0);
    expect(result.nextState.bond).toBe(0);
    expect(result.nextState.stage).toBe("stranger");
  });

  it("respects a stricter custom threshold", () => {
    const state = createDefaultSoulBondState();
    const summary = createDefaultInteractionSummary("2026-03-08");
    summary.greetings = 1;
    summary.meaningfulChats = 1;
    summary.lifeShares = 1;

    const result = evaluateDailySoulBond(state, summary, { passThreshold: 90 });

    expect(result.record.dailyScore).toBe(80);
    expect(result.record.bondDelta).toBe(0);
    expect(result.nextState.bond).toBe(0);
  });

  it("stores the logical evaluation time when one is provided", () => {
    const state = createDefaultSoulBondState();
    const summary = createDefaultInteractionSummary("2026-03-09");
    summary.greetings = 1;
    summary.meaningfulChats = 1;

    const result = evaluateDailySoulBond(state, summary, {
      evaluatedAt: new Date("2026-03-08T16:01:00.000Z"),
    });

    expect(result.nextState.lastEvaluationAt).toBe("2026-03-08T16:01:00.000Z");
  });

  it("rejects duplicate or out-of-order daily summary dates", () => {
    const state = createDefaultSoulBondState();
    state.currentDay = 1;
    state.bond = 1;
    state.dailyHistory.push({
      date: "2026-03-09",
      dailyScore: 70,
      bondDelta: 1,
      stage: "stranger",
      reasons: [],
    });
    const summary = createDefaultInteractionSummary("2026-03-09");

    expect(() => evaluateDailySoulBond(state, summary)).toThrow(/later than the latest recorded day/i);
  });

  it("rejects malformed interaction summary counters", () => {
    const state = createDefaultSoulBondState();
    const summary = createDefaultInteractionSummary("2026-03-09");
    summary.greetings = 1.5 as unknown as number;

    expect(() => evaluateDailySoulBond(state, summary)).toThrow(/greetings/i);
  });

  it("rejects invalid evaluator options before mutating state", () => {
    const state = createDefaultSoulBondState();
    const summary = createDefaultInteractionSummary("2026-03-09");

    expect(() => evaluateDailySoulBond(state, summary, { maxBondPerDay: -1 })).toThrow(/maxBondPerDay/i);
    expect(() => evaluateDailySoulBond(state, summary, { passThreshold: 101 })).toThrow(/passThreshold/i);
    expect(() => evaluateDailySoulBond(state, summary, { evaluatedAt: "2026-03-09" })).toThrow(/evaluatedAt/i);
  });
});
