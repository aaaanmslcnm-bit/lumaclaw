import {
  resolveSoulBondStage,
  type SoulBondStage,
  type SoulBondState,
  type SoulBondTone,
} from "./types.js";

export interface ToneProfile {
  tone: SoulBondTone;
  stage: SoulBondStage;
  note: string;
}

const DEFAULT_SOUL_BOND_TONE = {
  tone: "reserved" as const,
  note: "Tone mapping is disabled; stay polite, measured, and not too intimate yet.",
};

// The tone system is intentionally tiny for now.
// First we prove the relationship system works, then we can make the persona mapping richer.
export function getSoulBondTone(input: {
  bond: number;
  stage?: SoulBondStage;
}): ToneProfile {
  const stage = input.stage ?? resolveSoulBondStage(input.bond);

  if (stage === "trusted" || stage === "resonant") {
    return {
      tone: "warm",
      stage,
      note: "Can sound more familiar, caring, and naturally proactive.",
    };
  }

  if (stage === "close" || stage === "familiar") {
    return {
      tone: "natural",
      stage,
      note: "Can speak in a relaxed and steady way without being too distant.",
    };
  }

  return {
    tone: "reserved",
    stage,
    note: "Should stay polite, measured, and not too intimate yet.",
  };
}

export function getSoulBondToneFromState(state: SoulBondState): ToneProfile {
  if (!state.settings.affectTone) {
    return {
      ...DEFAULT_SOUL_BOND_TONE,
      stage: state.stage,
    };
  }

  return getSoulBondTone({
    bond: state.bond,
    stage: state.stage,
  });
}

export function buildSoulBondToneReplyHint(state: SoulBondState): string | undefined {
  if (!state.settings.enabled || !state.settings.affectTone) {
    return undefined;
  }
  const tone = getSoulBondToneFromState(state);
  return `Runtime SoulBond tone hint: ${tone.tone} (${tone.stage}). Let this subtly shape the warmth and familiarity of this reply. ${tone.note}`;
}
