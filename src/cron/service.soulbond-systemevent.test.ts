import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createCronServiceState } from "./service/state.js";
import { executeJobCore } from "./service/timer.js";
import { createSoulBondDailySystemEventPayload } from "../soulbond/cron-job.js";

const tempDirs: string[] = [];

async function createTempStatePath() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "soulbond-cron-"));
  tempDirs.push(dir);
  return path.join(dir, "state.json");
}

describe("cron soulbond systemEvent integration", () => {
  afterEach(async () => {
    await Promise.all(tempDirs.splice(0, tempDirs.length).map((dir) => fs.rm(dir, { recursive: true, force: true })));
  });

  it("runs SoulBond daily evaluation when a matching main systemEvent job executes", async () => {
    const statePath = await createTempStatePath();
    const enqueueSystemEvent = vi.fn();
    const requestHeartbeatNow = vi.fn();
    const nowMs = Date.parse("2025-12-13T00:00:01.000Z");

    const state = createCronServiceState({
      cronEnabled: true,
      storePath: path.join(path.dirname(statePath), "cron.json"),
      log: { debug() {}, info() {}, warn() {}, error() {} },
      nowMs: () => nowMs,
      enqueueSystemEvent,
      requestHeartbeatNow,
      runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
    });

    const job = {
      id: "job-soulbond",
      name: "soulbond integration",
      enabled: true,
      createdAtMs: nowMs,
      updatedAtMs: nowMs,
      schedule: { kind: "at" as const, at: new Date(nowMs).toISOString() },
      sessionTarget: "main" as const,
      wakeMode: "next-heartbeat" as const,
      payload: createSoulBondDailySystemEventPayload(statePath),
      state: {},
    };

    const result = await executeJobCore(state, job);
    const saved = JSON.parse(await fs.readFile(statePath, "utf8")) as { currentDay: number };

    expect(result.status).toBe("ok");
    expect(saved.currentDay).toBe(1);
    expect(enqueueSystemEvent).toHaveBeenCalled();
    expect(enqueueSystemEvent.mock.calls[0]?.[0]).toContain("SoulBond daily evaluation completed");
    expect(requestHeartbeatNow).toHaveBeenCalled();
  });
});
