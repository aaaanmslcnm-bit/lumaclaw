import { describe, expect, it } from "vitest";
import {
  createSoulBondDailySchedule,
  createTodayInteractionSummary,
  DEFAULT_SOUL_BOND_TIMEZONE,
  getLastSoulBondEvaluationDateKey,
  getSoulBondDateKey,
  shouldRunSoulBondDailyEvaluation,
  SOUL_BOND_DAILY_CRON_EXPR,
} from "./schedule.js";
import { createDefaultSoulBondState } from "./types.js";

describe("soulbond schedule", () => {
  it("creates a once-per-day midnight cron schedule", () => {
    expect(createSoulBondDailySchedule()).toEqual({
      kind: "cron",
      expr: SOUL_BOND_DAILY_CRON_EXPR,
      tz: DEFAULT_SOUL_BOND_TIMEZONE,
    });
  });

  it("formats date keys in the chosen timezone", () => {
    const now = new Date("2026-03-08T16:01:00.000Z");
    expect(getSoulBondDateKey(now, "Asia/Shanghai")).toBe("2026-03-09");
    expect(getSoulBondDateKey(now, "UTC")).toBe("2026-03-08");
  });

  it("does not rerun on the same local day", () => {
    const state = createDefaultSoulBondState();
    state.lastEvaluationAt = "2026-03-08T00:05:00+08:00";

    const shouldRun = shouldRunSoulBondDailyEvaluation(
      state,
      new Date("2026-03-08T15:59:00.000Z"),
      "Asia/Shanghai",
    );

    expect(getLastSoulBondEvaluationDateKey(state, "Asia/Shanghai")).toBe("2026-03-08");
    expect(shouldRun).toBe(false);
  });

  it("runs again after the local date rolls over", () => {
    const state = createDefaultSoulBondState();
    state.lastEvaluationAt = "2026-03-08T23:55:00+08:00";

    const shouldRun = shouldRunSoulBondDailyEvaluation(
      state,
      new Date("2026-03-08T16:01:00.000Z"),
      "Asia/Shanghai",
    );

    expect(shouldRun).toBe(true);
  });

  it("stays disabled when SoulBond is turned off", () => {
    const state = createDefaultSoulBondState();
    state.settings.enabled = false;

    expect(shouldRunSoulBondDailyEvaluation(state, new Date("2026-03-08T16:01:00.000Z"))).toBe(false);
  });

  it("creates an interaction summary for the current local day", () => {
    const summary = createTodayInteractionSummary(new Date("2026-03-08T16:01:00.000Z"), "Asia/Shanghai");
    expect(summary.date).toBe("2026-03-09");
    expect(summary.greetings).toBe(0);
  });
});
