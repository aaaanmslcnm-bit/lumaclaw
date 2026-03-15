import { describe, expect, it } from "vitest";
import {
  loadAndNormalizeSoulBondState,
  validateSoulBondStateForSave,
} from "./state-schema.js";
import { SOUL_BOND_STATE_VERSION, createDefaultSoulBondState } from "./types.js";

describe("soulbond state schema", () => {
  it("migrates legacy version-0 state into the canonical version-1 shape", () => {
    const result = loadAndNormalizeSoulBondState({
      bond: 12,
      currentDay: 1,
      dailyHistory: [
        {
          date: "2026-03-08",
          dailyScore: 70,
          bondDelta: 1,
          stage: "stranger",
          reasons: [],
        },
      ],
      settings: {
        enabled: false,
        affectVoice: true,
      },
      lastEvaluationAt: "2026-03-08T16:01:00.000Z",
    });

    expect(result.changed).toBe(true);
    expect(result.state.version).toBe(SOUL_BOND_STATE_VERSION);
    expect(result.state.bond).toBe(12);
    expect(result.state.stage).toBe("familiar");
    expect(result.state.currentDay).toBe(1);
    expect(result.state.lastEvaluationAt).toBe("2026-03-08T16:01:00.000Z");
    expect(result.state.settings.enabled).toBe(false);
    expect(result.state.settings.mode).toBe("100-day");
    expect(result.state.settings.affectVoice).toBe(true);
    expect(result.changes).toContain("Migrated SoulBond state from legacy version 0 to version 1.");
  });

  it("normalizes drifted stage fields in both the state and the latest history record", () => {
    const state = createDefaultSoulBondState();
    state.currentDay = 1;
    state.bond = 55;
    state.stage = "stranger";
    state.dailyHistory.push({
      date: "2026-03-08",
      dailyScore: 72,
      bondDelta: 1,
      stage: "stranger",
      reasons: [],
    });

    const result = loadAndNormalizeSoulBondState(state);

    expect(result.changed).toBe(true);
    expect(result.state.stage).toBe("trusted");
    expect(result.state.dailyHistory.at(-1)?.stage).toBe("trusted");
    expect(result.changes).toContain("Normalized SoulBond stage from stranger to trusted.");
    expect(result.changes).toContain("Normalized SoulBond latest record stage from stranger to trusted.");
  });

  it("raises currentDay during save validation when history already covers more days", () => {
    const state = createDefaultSoulBondState();
    state.bond = 1;
    state.dailyHistory.push({
      date: "2026-03-08",
      dailyScore: 70,
      bondDelta: 1,
      stage: "stranger",
      reasons: [],
    });

    const normalized = validateSoulBondStateForSave(state);

    expect(normalized.currentDay).toBe(1);
    expect(normalized.stage).toBe("stranger");
  });

  it("rejects malformed state version metadata", () => {
    expect(() =>
      loadAndNormalizeSoulBondState({
        ...createDefaultSoulBondState(),
        version: -1,
      }),
    ).toThrow(/state version/i);
  });
});
