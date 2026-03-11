import { describe, expect, it } from "vitest";
import { buildSoulBondToneReplyHint, getSoulBondTone, getSoulBondToneFromState } from "./tone.js";
import { createDefaultSoulBondState } from "./types.js";

describe("soulbond tone", () => {
  it("maps tone from bond and stage when affectTone is enabled", () => {
    const state = createDefaultSoulBondState();
    state.bond = 52;
    state.stage = "trusted";

    expect(getSoulBondTone({ bond: state.bond, stage: state.stage })).toEqual({
      tone: "warm",
      stage: "trusted",
      note: "Can sound more familiar, caring, and naturally proactive.",
    });

    expect(getSoulBondToneFromState(state)).toEqual({
      tone: "warm",
      stage: "trusted",
      note: "Can sound more familiar, caring, and naturally proactive.",
    });
  });

  it("returns a stable default tone when affectTone is disabled", () => {
    const state = createDefaultSoulBondState();
    state.bond = 85;
    state.stage = "resonant";
    state.settings.affectTone = false;

    expect(getSoulBondToneFromState(state)).toEqual({
      tone: "reserved",
      stage: "resonant",
      note: "Tone mapping is disabled; stay polite, measured, and not too intimate yet.",
    });
  });

  it("builds a lightweight reply hint when SoulBond tone effects are enabled", () => {
    const state = createDefaultSoulBondState();
    state.bond = 52;
    state.stage = "trusted";

    expect(buildSoulBondToneReplyHint(state)).toBe(
      "Runtime SoulBond tone hint: warm (trusted). Let this subtly shape the warmth and familiarity of this reply. Can sound more familiar, caring, and naturally proactive.",
    );
  });

  it("omits the reply hint when SoulBond or tone effects are disabled", () => {
    const state = createDefaultSoulBondState();
    state.settings.enabled = false;

    expect(buildSoulBondToneReplyHint(state)).toBeUndefined();

    state.settings.enabled = true;
    state.settings.affectTone = false;
    expect(buildSoulBondToneReplyHint(state)).toBeUndefined();
  });
});
