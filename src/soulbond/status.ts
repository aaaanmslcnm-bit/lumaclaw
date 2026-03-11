import { loadSoulBondState } from "./store.js";
import { getSoulBondToneFromState } from "./tone.js";
import type { SoulBondRecord, SoulBondState } from "./types.js";

function formatBondDelta(delta: number): string {
  return delta >= 0 ? `+${delta}` : `${delta}`;
}

function formatToneMode(state: SoulBondState): string {
  return state.settings.affectTone ? "mapped from bond/stage" : "fixed default (tone mapping off)";
}

function formatLastRecord(record: SoulBondRecord | undefined): string[] {
  if (!record) {
    return [
      "Latest Daily Result",
      "- No daily evaluation has been recorded yet.",
    ];
  }

  return [
    "Latest Daily Result",
    `- Date: ${record.date}`,
    `- Score: ${record.dailyScore} / 100`,
    `- Bond Change: ${formatBondDelta(record.bondDelta)}`,
    `- Stage After Update: ${record.stage}`,
  ];
}

// Minimal human-readable state view for SoulBond.
// This is intentionally plain text so it can be used in CLI output now and UI later.
export function formatSoulBondStatus(state: SoulBondState): string {
  const latestRecord = state.dailyHistory.at(-1);
  const tone = getSoulBondToneFromState(state);
  const lines = [
    `SoulBond Status`,
    "",
    "Relationship",
    `- Bond: ${state.bond}`,
    `- Stage: ${state.stage}`,
    `- Tone: ${tone.tone}`,
    `- Tone behavior: ${formatToneMode(state)}`,
    `- Tone guidance: ${tone.note}`,
    "",
    "Tracking",
    `- Days tracked: ${state.currentDay}`,
    `- SoulBond enabled: ${state.settings.enabled ? "yes" : "no"}`,
  ];

  if (state.lastEvaluationAt) {
    lines.push(`- Last evaluated: ${state.lastEvaluationAt}`);
  }

  lines.push("", ...formatLastRecord(latestRecord));
  return lines.join("\n");
}

export async function getFormattedSoulBondStatus(statePath: string): Promise<string> {
  const state = await loadSoulBondState(statePath);
  return formatSoulBondStatus(state);
}
