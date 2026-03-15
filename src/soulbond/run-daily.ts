import { evaluateDailySoulBond } from "./evaluate-daily.js";
import {
  createTodayInteractionSummary,
  DEFAULT_SOUL_BOND_TIMEZONE,
  getSoulBondDateKey,
  shouldRunSoulBondDailyEvaluation,
} from "./schedule.js";
import { formatSoulBondDailySummaryFromEvaluation } from "./summary.js";
import { loadSoulBondState, saveSoulBondState } from "./store.js";
import { buildInteractionSummaryFromTranscript } from "./transcript.js";
import type { InteractionSummary, SoulBondState } from "./types.js";

export type SoulBondDailyRunStatus = "ran" | "skipped";

export interface SoulBondDailyRunResult {
  status: SoulBondDailyRunStatus;
  dateKey: string;
  state: SoulBondState;
  summaryText?: string;
  interactionSummary?: InteractionSummary;
}

export interface RunSoulBondDailyOptions {
  statePath: string;
  now?: Date;
  timeZone?: string;
  interactionSummary?: InteractionSummary;
  transcriptPath?: string;
}

// This is the thin execution layer that future cron/heartbeat integration can call.
// It loads state, checks whether today's run is still due, performs the evaluation,
// saves the next state, and returns a ready-to-display summary text.
export async function runSoulBondDaily(options: RunSoulBondDailyOptions): Promise<SoulBondDailyRunResult> {
  const now = options.now ?? new Date();
  const timeZone = options.timeZone ?? DEFAULT_SOUL_BOND_TIMEZONE;
  const dateKey = getSoulBondDateKey(now, timeZone);
  const state = await loadSoulBondState(options.statePath);

  if (!shouldRunSoulBondDailyEvaluation(state, now, timeZone)) {
    return {
      status: "skipped",
      dateKey,
      state,
    };
  }

  const interactionSummary = options.interactionSummary
    ?? (options.transcriptPath
      ? await buildInteractionSummaryFromTranscript({
          transcriptPath: options.transcriptPath,
          now,
          timeZone,
        })
      : createTodayInteractionSummary(now, timeZone));
  if (interactionSummary.date && interactionSummary.date !== dateKey) {
    throw new Error(
      `SoulBond interaction summary date ${interactionSummary.date} does not match the requested run date ${dateKey}.`,
    );
  }
  const normalizedSummary: InteractionSummary = {
    ...interactionSummary,
    date: interactionSummary.date || dateKey,
  };

  const evaluation = evaluateDailySoulBond(state, normalizedSummary, {
    evaluatedAt: now,
  });
  await saveSoulBondState(options.statePath, evaluation.nextState);

  return {
    status: "ran",
    dateKey,
    state: evaluation.nextState,
    summaryText: formatSoulBondDailySummaryFromEvaluation(evaluation),
    interactionSummary: normalizedSummary,
  };
}
