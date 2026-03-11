import { describe, expect, it } from "vitest";
import { calculateDailyScore } from "./scoring.js";
import { createDefaultInteractionSummary } from "./types.js";

describe("soulbond scoring", () => {
  it("reaches the daily growth line with a greeting and one meaningful chat", () => {
    const summary = createDefaultInteractionSummary("2026-03-08");
    summary.greetings = 1;
    summary.meaningfulChats = 1;

    const result = calculateDailyScore(summary);

    expect(result.baseScore).toBe(50);
    expect(result.totalScore).toBe(70);
    expect(result.reasons).toEqual([
      { key: "greeting", label: "Started the day with a greeting", delta: 10 },
      { key: "meaningful-chat", label: "Had a meaningful interaction", delta: 10 },
    ]);
  });

  it("caps repeatable signals at the MVP limits", () => {
    const summary = createDefaultInteractionSummary("2026-03-08");
    summary.greetings = 3;
    summary.meaningfulChats = 5;
    summary.completedTasks = 4;
    summary.gratitudeMoments = 3;
    summary.lifeShares = 2;
    summary.rudeEvents = 3;
    summary.teasingEvents = 2;
    summary.ignoredFollowUps = 9;
    summary.streakDays = 8;
    summary.specialEventBonus = 40;

    const result = calculateDailyScore(summary);

    expect(result.totalScore).toBe(100);
    expect(result.reasons).toEqual([
      { key: "greeting", label: "Started the day with a greeting", delta: 10 },
      { key: "meaningful-chat", label: "Had a meaningful interaction", delta: 20 },
      { key: "task-complete", label: "Asked for help and completed something", delta: 30 },
      { key: "gratitude", label: "Showed appreciation", delta: 16 },
      { key: "life-share", label: "Shared daily life or mood", delta: 10 },
      { key: "streak", label: "Maintained an interaction streak", delta: 15 },
      { key: "special-event", label: "Special event bonus", delta: 20 },
      { key: "rude", label: "Negative interaction penalty", delta: -10 },
      { key: "teasing", label: "Repeatedly toyed with the system in bad faith", delta: -8 },
      { key: "ignored-follow-up", label: "Dropped a follow-up after asking for help", delta: -5 },
    ]);
  });

  it("keeps a quiet day neutral instead of punitive", () => {
    const summary = createDefaultInteractionSummary("2026-03-08");

    const result = calculateDailyScore(summary);

    expect(result.totalScore).toBe(50);
    expect(result.reasons).toEqual([]);
  });

  it("sanitizes malformed numeric counters instead of producing NaN score output", () => {
    const summary = createDefaultInteractionSummary("2026-03-08");
    summary.greetings = Number.POSITIVE_INFINITY;
    summary.meaningfulChats = 1.9 as unknown as number;
    summary.specialEventBonus = Number.NaN;

    const result = calculateDailyScore(summary);

    expect(result.totalScore).toBe(60);
    expect(result.reasons).toEqual([
      { key: "meaningful-chat", label: "Had a meaningful interaction", delta: 10 },
    ]);
  });
});
