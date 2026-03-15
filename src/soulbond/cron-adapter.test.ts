import { describe, expect, it } from "vitest";
import { createSoulBondResultSystemEventPayload, formatSoulBondRunAsSystemEvent } from "./cron-adapter.js";
import { evaluateDailySoulBond } from "./evaluate-daily.js";
import { createDefaultInteractionSummary, createDefaultSoulBondState } from "./types.js";

describe("soulbond cron adapter", () => {
  it("formats a completed daily run into readable system-event text", () => {
    const state = createDefaultSoulBondState();
    const summary = createDefaultInteractionSummary("2026-03-09");
    summary.greetings = 1;
    summary.meaningfulChats = 1;
    const result = evaluateDailySoulBond(state, summary, {
      evaluatedAt: new Date("2026-03-08T16:01:00.000Z"),
    });

    const payload = createSoulBondResultSystemEventPayload({
      status: "ran",
      dateKey: "2026-03-09",
      state: result.nextState,
      summaryText: "Score: 70 / 100",
      interactionSummary: summary,
    });

    expect(payload.kind).toBe("systemEvent");
    if (payload.kind !== "systemEvent") {
      throw new Error("Expected SoulBond cron adapter to create a systemEvent payload.");
    }
    expect(payload.text).toContain("SoulBond daily evaluation completed for 2026-03-09");
    expect(payload.text).toContain("Day 1, Bond: 1, Stage: stranger");
    expect(payload.text).toContain("Score: 70 / 100");
  });

  it("formats a skipped run without pretending work happened", () => {
    const text = formatSoulBondRunAsSystemEvent({
      status: "skipped",
      dateKey: "2026-03-09",
      state: createDefaultSoulBondState(),
    });

    expect(text).toBe("SoulBond daily evaluation skipped for 2026-03-09 (already completed)");
  });
});
