import { calculateDailyScore } from "./scoring.js";
import { validateSoulBondStateForSave } from "./state-schema.js";
import {
  resolveSoulBondStage,
  type DailyEvaluationResult,
  type InteractionSummary,
  type SoulBondRecord,
  type SoulBondState,
} from "./types.js";
import { isValidSoulBondDateKey, isValidSoulBondTimestamp } from "./validation.js";

export interface EvaluateDailyOptions {
  passThreshold?: number;
  maxBondPerDay?: number;
  evaluatedAt?: Date | string;
}

const SUMMARY_COUNT_FIELDS = [
  "greetings",
  "meaningfulChats",
  "completedTasks",
  "gratitudeMoments",
  "lifeShares",
  "rudeEvents",
  "teasingEvents",
  "ignoredFollowUps",
  "streakDays",
  "specialEventBonus",
] as const;

function validateInteractionSummary(summary: InteractionSummary): InteractionSummary {
  if (!isValidSoulBondDateKey(summary.date)) {
    throw new Error(`SoulBond interaction summary date must be a YYYY-MM-DD key; received ${summary.date}.`);
  }

  for (const field of SUMMARY_COUNT_FIELDS) {
    const value = summary[field];
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`SoulBond interaction summary ${field} must be a non-negative integer.`);
    }
  }

  return summary;
}

function resolvePassThreshold(value: number | undefined): number {
  const passThreshold = value ?? 70;
  if (!Number.isInteger(passThreshold) || passThreshold < 0 || passThreshold > 100) {
    throw new Error("SoulBond passThreshold must be an integer between 0 and 100.");
  }
  return passThreshold;
}

function resolveMaxBondPerDay(value: number | undefined): number {
  const maxBondPerDay = value ?? 1;
  if (!Number.isInteger(maxBondPerDay) || maxBondPerDay < 0) {
    throw new Error("SoulBond maxBondPerDay must be a non-negative integer.");
  }
  return maxBondPerDay;
}

function resolveEvaluatedAt(value: Date | string | undefined): string {
  if (typeof value === "string") {
    if (!isValidSoulBondTimestamp(value)) {
      throw new Error("SoulBond evaluatedAt must be a valid ISO 8601 timestamp.");
    }
    return value;
  }

  const evaluatedAt = value ?? new Date();
  if (!Number.isFinite(evaluatedAt.getTime())) {
    throw new Error("SoulBond evaluatedAt must be a valid Date.");
  }
  return evaluatedAt.toISOString();
}

function assertSoulBondStateCanAdvance(currentState: SoulBondState, nextDateKey: string) {
  const lastDateKey = currentState.dailyHistory.at(-1)?.date;
  if (lastDateKey && nextDateKey <= lastDateKey) {
    throw new Error(
      `SoulBond summary date ${nextDateKey} must be later than the latest recorded day ${lastDateKey}.`,
    );
  }
}

// This is the "midnight worker" for the future SoulBond system.
// It takes today's interaction summary, calculates a score, decides whether bond grows,
// and returns the next state without touching any outside system.
export function evaluateDailySoulBond(
  currentState: SoulBondState,
  summary: InteractionSummary,
  options: EvaluateDailyOptions = {},
): DailyEvaluationResult {
  const normalizedState = validateSoulBondStateForSave(currentState);
  const normalizedSummary = validateInteractionSummary(summary);
  const passThreshold = resolvePassThreshold(options.passThreshold);
  const maxBondPerDay = resolveMaxBondPerDay(options.maxBondPerDay);
  const evaluatedAt = resolveEvaluatedAt(options.evaluatedAt);
  assertSoulBondStateCanAdvance(normalizedState, normalizedSummary.date);
  const breakdown = calculateDailyScore(normalizedSummary);

  const rawDelta = breakdown.totalScore >= passThreshold ? 1 : 0;
  const bondDelta = Math.min(maxBondPerDay, rawDelta);
  const nextBond = normalizedState.bond + bondDelta;
  const nextStage = resolveSoulBondStage(nextBond);

  const record: SoulBondRecord = {
    date: normalizedSummary.date,
    dailyScore: breakdown.totalScore,
    bondDelta,
    stage: nextStage,
    reasons: breakdown.reasons,
  };

  const nextState: SoulBondState = {
    ...normalizedState,
    currentDay: normalizedState.currentDay + 1,
    bond: nextBond,
    stage: nextStage,
    lastEvaluationAt: evaluatedAt,
    dailyHistory: [...normalizedState.dailyHistory, record],
  };
  const validatedNextState = validateSoulBondStateForSave(nextState);
  const validatedRecord = validatedNextState.dailyHistory.at(-1);
  if (!validatedRecord) {
    throw new Error("SoulBond evaluation failed to append a daily history record.");
  }

  return {
    record: validatedRecord,
    nextState: validatedNextState,
  };
}
