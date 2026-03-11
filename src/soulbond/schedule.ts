import type { CronSchedule } from "../cron/types.js";
import { createDefaultInteractionSummary, type InteractionSummary, type SoulBondState } from "./types.js";

export const SOUL_BOND_DAILY_CRON_EXPR = "0 0 * * *";
export const DEFAULT_SOUL_BOND_TIMEZONE = "Asia/Shanghai";

function formatDateKeyInTimezone(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error(`could not format date key for timezone: ${timeZone}`);
  }

  return `${year}-${month}-${day}`;
}

// This creates the future cron schedule definition that SoulBond can plug into.
// We keep it tiny and explicit: once per day, at midnight, in the chosen timezone.
export function createSoulBondDailySchedule(timeZone = DEFAULT_SOUL_BOND_TIMEZONE): CronSchedule {
  return {
    kind: "cron",
    expr: SOUL_BOND_DAILY_CRON_EXPR,
    tz: timeZone,
  };
}

export function getSoulBondDateKey(date: Date, timeZone = DEFAULT_SOUL_BOND_TIMEZONE): string {
  return formatDateKeyInTimezone(date, timeZone);
}

export function getLastSoulBondEvaluationDateKey(
  state: SoulBondState,
  timeZone = DEFAULT_SOUL_BOND_TIMEZONE,
): string | undefined {
  if (!state.lastEvaluationAt) {
    return undefined;
  }
  return getSoulBondDateKey(new Date(state.lastEvaluationAt), timeZone);
}

// The future cron hook can call this guard before running the daily evaluation.
// Its job is simple: if SoulBond already ran for the current local day, do not run it again.
export function shouldRunSoulBondDailyEvaluation(
  state: SoulBondState,
  now = new Date(),
  timeZone = DEFAULT_SOUL_BOND_TIMEZONE,
): boolean {
  if (!state.settings.enabled) {
    return false;
  }

  const todayKey = getSoulBondDateKey(now, timeZone);
  const lastKey = getLastSoulBondEvaluationDateKey(state, timeZone);
  return todayKey !== lastKey;
}

export function createTodayInteractionSummary(
  now = new Date(),
  timeZone = DEFAULT_SOUL_BOND_TIMEZONE,
): InteractionSummary {
  return createDefaultInteractionSummary(getSoulBondDateKey(now, timeZone));
}
