import { getSoulBondTone, getSoulBondToneFromState } from "./tone.js";
import {
  resolveSoulBondStage,
  type DailyEvaluationResult,
  type ScoreReason,
  type SoulBondRecord,
  type SoulBondState,
} from "./types.js";

function formatReason(reason: ScoreReason) {
  const sign = reason.delta > 0 ? "+" : "";
  return `- ${reason.label} (${sign}${reason.delta})`;
}

function formatBondDelta(delta: number): string {
  return delta >= 0 ? `+${delta}` : `${delta}`;
}

function formatStageChange(previousStage: string, nextStage: string): string {
  if (previousStage === nextStage) {
    return `${nextStage} (unchanged)`;
  }
  return `${previousStage} -> ${nextStage}`;
}

function formatToneMode(state: SoulBondState): string {
  return state.settings.affectTone ? "mapped from bond/stage" : "fixed default (tone mapping off)";
}

// This helper turns a daily SoulBond result into a user-facing summary.
// The first version is intentionally plain text so it can be reused in CLI, UI, or chat later.
export function formatSoulBondDailySummary(input: {
  record: SoulBondRecord;
  currentBond?: number;
  state?: SoulBondState;
}): string {
  const { record, state } = input;
  const currentBond = state?.bond ?? input.currentBond;
  const currentStage = state?.stage ?? record.stage;
  const previousBond = typeof currentBond === "number" ? currentBond - record.bondDelta : undefined;
  const previousStage = typeof previousBond === "number" ? resolveSoulBondStage(previousBond) : undefined;
  const tone = state
    ? getSoulBondToneFromState(state)
    : typeof currentBond === "number"
      ? getSoulBondTone({
          bond: currentBond,
          stage: currentStage,
        })
      : undefined;
  const lines = [
    `Score: ${record.dailyScore} / 100`,
    `Result: Bond ${formatBondDelta(record.bondDelta)}`,
    "",
  ];

  if (typeof currentBond === "number" && typeof previousBond === "number") {
    lines.push(
      "State Change:",
      `- Bond: ${previousBond} -> ${currentBond}`,
      `- Stage: ${formatStageChange(previousStage ?? currentStage, currentStage)}`,
      "",
    );
  } else {
    lines.push(`Stage Now: ${currentStage}`, "");
  }

  if (tone) {
    lines.push("Tone Result:", `- Tone: ${tone.tone}`);
    if (state) {
      lines.push(`- Tone behavior: ${formatToneMode(state)}`);
    }
    lines.push(`- Guidance: ${tone.note}`, "");
  }

  if (record.reasons.length > 0) {
    lines.push("Why it changed:");
    lines.push(...record.reasons.map(formatReason));
  } else {
    lines.push("Why it changed:");
    lines.push("- No major interaction signals were recorded today.");
  }

  return lines.join("\n");
}

export function formatSoulBondDailySummaryFromEvaluation(
  result: DailyEvaluationResult,
): string {
  return formatSoulBondDailySummary({
    record: result.record,
    currentBond: result.nextState.bond,
    state: result.nextState,
  });
}
