import { describe, expect, it } from "vitest";
import {
  createSoulBondDailyCronJob,
  createSoulBondDailySystemEventPayload,
  createSoulBondDailySystemEventText,
  parseSoulBondDailySystemEventText,
  SOUL_BOND_DAILY_SYSTEM_EVENT_PREFIX,
} from "./cron-job.js";

describe("soulbond cron job helper", () => {
  it("builds a valid main-session system event cron job", () => {
    const job = createSoulBondDailyCronJob({
      statePath: "C:/tmp/soulbond-state.json",
    });

    expect(job.name).toBe("soulbond-daily");
    expect(job.enabled).toBe(true);
    expect(job.sessionTarget).toBe("main");
    expect(job.wakeMode).toBe("next-heartbeat");
    expect(job.schedule).toEqual({
      kind: "cron",
      expr: "0 0 * * *",
      tz: "Asia/Shanghai",
    });
    expect(job.payload).toEqual({
      kind: "systemEvent",
      text: "soulbond:daily:C:/tmp/soulbond-state.json",
    });
  });

  it("creates a stable system event text bridge", () => {
    expect(createSoulBondDailySystemEventText("abc.json")).toBe(`${SOUL_BOND_DAILY_SYSTEM_EVENT_PREFIX}abc.json`);
    expect(createSoulBondDailySystemEventPayload("abc.json")).toEqual({
      kind: "systemEvent",
      text: `${SOUL_BOND_DAILY_SYSTEM_EVENT_PREFIX}abc.json`,
    });
  });

  it("parses only valid SoulBond daily system-event text", () => {
    expect(parseSoulBondDailySystemEventText("soulbond:daily:C:/tmp/state.json")).toBe("C:/tmp/state.json");
    expect(parseSoulBondDailySystemEventText("  soulbond:daily:C:/tmp/state.json  ")).toBe("C:/tmp/state.json");
    expect(parseSoulBondDailySystemEventText("soulbond:daily:   ")).toBeUndefined();
    expect(parseSoulBondDailySystemEventText("hello")).toBeUndefined();
  });
});
