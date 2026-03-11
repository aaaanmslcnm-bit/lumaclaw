import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { runSoulBondDaily } from "./run-daily.js";
import { createDefaultInteractionSummary, createDefaultSoulBondState } from "./types.js";

const tempDirs: string[] = [];

async function createTempStatePath() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "soulbond-run-"));
  tempDirs.push(dir);
  return path.join(dir, "state.json");
}

async function createTempTranscript(lines: string[]) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "soulbond-run-transcript-"));
  tempDirs.push(dir);
  const transcriptPath = path.join(dir, "session.jsonl");
  await fs.writeFile(transcriptPath, lines.join("\n"));
  return transcriptPath;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0, tempDirs.length).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe("runSoulBondDaily", () => {
  it("runs a daily evaluation, saves the next state, and returns summary text", async () => {
    const statePath = await createTempStatePath();
    const summary = createDefaultInteractionSummary("2026-03-09");
    summary.greetings = 1;
    summary.meaningfulChats = 1;

    const result = await runSoulBondDaily({
      statePath,
      now: new Date("2026-03-08T16:01:00.000Z"),
      timeZone: "Asia/Shanghai",
      interactionSummary: summary,
    });

    const raw = JSON.parse(await fs.readFile(statePath, "utf8")) as { bond: number; currentDay: number };

    expect(result.status).toBe("ran");
    expect(result.dateKey).toBe("2026-03-09");
    expect(result.state.bond).toBe(1);
    expect(result.state.currentDay).toBe(1);
    expect(result.summaryText).toContain("Score: 70 / 100");
    expect(result.summaryText).toContain("Tone Result:");
    expect(raw.bond).toBe(1);
    expect(raw.currentDay).toBe(1);
  });

  it("skips a second run on the same local day", async () => {
    const statePath = await createTempStatePath();
    const summary = createDefaultInteractionSummary("2026-03-09");
    summary.greetings = 1;
    summary.meaningfulChats = 1;

    await runSoulBondDaily({
      statePath,
      now: new Date("2026-03-08T16:01:00.000Z"),
      timeZone: "Asia/Shanghai",
      interactionSummary: summary,
    });

    const second = await runSoulBondDaily({
      statePath,
      now: new Date("2026-03-08T16:30:00.000Z"),
      timeZone: "Asia/Shanghai",
      interactionSummary: summary,
    });

    expect(second.status).toBe("skipped");
    expect(second.summaryText).toBeUndefined();
    expect(second.state.bond).toBe(1);
  });

  it("stays skipped when SoulBond is disabled in stored state", async () => {
    const statePath = await createTempStatePath();
    const state = createDefaultSoulBondState();
    state.settings.enabled = false;
    await fs.writeFile(statePath, JSON.stringify(state, null, 2));

    const result = await runSoulBondDaily({
      statePath,
      now: new Date("2026-03-08T16:01:00.000Z"),
      timeZone: "Asia/Shanghai",
    });

    expect(result.status).toBe("skipped");
    expect(result.state.settings.enabled).toBe(false);
  });

  it("rejects a supplied interaction summary when its date does not match the run date", async () => {
    const statePath = await createTempStatePath();
    const summary = createDefaultInteractionSummary("2026-03-08");

    await expect(
      runSoulBondDaily({
        statePath,
        now: new Date("2026-03-08T16:01:00.000Z"),
        timeZone: "Asia/Shanghai",
        interactionSummary: summary,
      }),
    ).rejects.toThrow(/does not match the requested run date 2026-03-09/i);
  });

  it("can build the interaction summary from a real session transcript", async () => {
    const statePath = await createTempStatePath();
    const transcriptPath = await createTempTranscript([
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T16:01:00.000Z",
        message: { role: "user", content: [{ type: "text", text: "早安安😘" }] },
      }),
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T16:03:00.000Z",
        message: {
          role: "user",
          content: [{ type: "text", text: "我打算今天继续推进 SoulClaw，谢谢你。" }],
        },
      }),
    ]);

    const result = await runSoulBondDaily({
      statePath,
      transcriptPath,
      now: new Date("2026-03-08T16:30:00.000Z"),
      timeZone: "Asia/Shanghai",
    });

    expect(result.status).toBe("ran");
    expect(result.interactionSummary?.greetings).toBe(1);
    expect(result.interactionSummary?.gratitudeMoments).toBe(1);
    expect(result.interactionSummary?.lifeShares).toBe(1);
    expect(result.interactionSummary?.meaningfulChats).toBe(1);
    expect(result.summaryText).toContain("Score: 88 / 100");
  });
});
