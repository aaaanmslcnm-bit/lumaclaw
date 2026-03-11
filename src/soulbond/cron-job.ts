import type { CronJobCreate, CronPayload } from "../cron/types.js";
import { createSoulBondDailySchedule, DEFAULT_SOUL_BOND_TIMEZONE } from "./schedule.js";

export const SOUL_BOND_DAILY_SYSTEM_EVENT_PREFIX = "soulbond:daily:";

export interface CreateSoulBondCronJobOptions {
  name?: string;
  timeZone?: string;
  statePath: string;
  enabled?: boolean;
}

// This text is the bridge between SoulBond and the existing scheduler.
// The current scheduler already knows how to carry plain system-event text safely.
export function createSoulBondDailySystemEventText(statePath: string): string {
  return `${SOUL_BOND_DAILY_SYSTEM_EVENT_PREFIX}${statePath}`;
}

export function parseSoulBondDailySystemEventText(text: string): string | undefined {
  const trimmed = text.trim();
  if (!trimmed.startsWith(SOUL_BOND_DAILY_SYSTEM_EVENT_PREFIX)) {
    return undefined;
  }
  const statePath = trimmed.slice(SOUL_BOND_DAILY_SYSTEM_EVENT_PREFIX.length).trim();
  return statePath || undefined;
}

export function createSoulBondDailySystemEventPayload(statePath: string): CronPayload {
  return {
    kind: "systemEvent",
    text: createSoulBondDailySystemEventText(statePath),
  };
}

// Builds a minimal cron job definition for SoulBond daily evaluation.
// We keep it on the existing main/systemEvent path so the future runtime hookup
// only needs to interpret this event text and call the SoulBond runner.
export function createSoulBondDailyCronJob(options: CreateSoulBondCronJobOptions): CronJobCreate {
  const timeZone = options.timeZone ?? DEFAULT_SOUL_BOND_TIMEZONE;
  const name = options.name ?? "soulbond-daily";
  const enabled = options.enabled ?? true;

  return {
    name,
    enabled,
    description: "Daily SoulBond evaluation at midnight",
    schedule: createSoulBondDailySchedule(timeZone),
    sessionTarget: "main",
    wakeMode: "next-heartbeat",
    payload: createSoulBondDailySystemEventPayload(options.statePath),
  };
}
