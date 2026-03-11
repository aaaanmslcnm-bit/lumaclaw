import type { CronPayload } from "../cron/types.js";
import type { SoulBondDailyRunResult } from "./run-daily.js";

// Converts a SoulBond daily run result into plain text the scheduler can log,
// deliver, or reuse as a later system event.
export function formatSoulBondRunAsSystemEvent(result: SoulBondDailyRunResult): string {
  if (result.status === "skipped") {
    return `SoulBond daily evaluation skipped for ${result.dateKey} (already completed)`;
  }

  const { state, dateKey } = result;
  const parts = [
    `SoulBond daily evaluation completed for ${dateKey}`,
    `Day ${state.currentDay}, Bond: ${state.bond}, Stage: ${state.stage}`,
  ];

  if (result.summaryText) {
    parts.push("", result.summaryText);
  }

  return parts.join("\n");
}

export function createSoulBondResultSystemEventPayload(result: SoulBondDailyRunResult): CronPayload {
  return {
    kind: "systemEvent",
    text: formatSoulBondRunAsSystemEvent(result),
  };
}
