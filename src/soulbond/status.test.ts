import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getFormattedSoulBondStatus, formatSoulBondStatus } from "./status.js";
import { createDefaultSoulBondState } from "./types.js";

const tempDirs: string[] = [];

async function createTempStatePath() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "soulbond-status-"));
  tempDirs.push(dir);
  return path.join(dir, "state.json");
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0, tempDirs.length).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe("soulbond status", () => {
  it("formats the current state and latest daily result", () => {
    const state = createDefaultSoulBondState();
    state.currentDay = 3;
    state.bond = 55;
    state.stage = "trusted";
    state.lastEvaluationAt = "2026-03-09T00:00:00.000Z";
    state.dailyHistory.push({
      date: "2026-03-09",
      dailyScore: 70,
      bondDelta: 1,
      stage: "trusted",
      reasons: [],
    });

    const text = formatSoulBondStatus(state);

    expect(text).toContain("Relationship");
    expect(text).toContain("- Bond: 55");
    expect(text).toContain("- Tone: warm");
    expect(text).toContain("- Tone behavior: mapped from bond/stage");
    expect(text).toContain("Tracking");
    expect(text).toContain("- Days tracked: 3");
    expect(text).toContain("Latest Daily Result");
    expect(text).toContain("- Score: 70 / 100");
    expect(text).toContain("- Bond Change: +1");
  });

  it("shows the stable default tone when affectTone is disabled", () => {
    const state = createDefaultSoulBondState();
    state.bond = 85;
    state.stage = "resonant";
    state.settings.affectTone = false;

    const text = formatSoulBondStatus(state);

    expect(text).toContain("- Tone: reserved");
    expect(text).toContain("- Tone behavior: fixed default (tone mapping off)");
    expect(text).toContain("- Tone guidance: Tone mapping is disabled; stay polite, measured, and not too intimate yet.");
  });

  it("loads and formats status from disk", async () => {
    const statePath = await createTempStatePath();
    const state = createDefaultSoulBondState();
    state.bond = 5;
    await fs.writeFile(statePath, JSON.stringify(state, null, 2));

    const text = await getFormattedSoulBondStatus(statePath);

    expect(text).toContain("- Bond: 5");
    expect(text).toContain("- Tone: reserved");
    expect(text).toContain("- No daily evaluation has been recorded yet.");
  });
});
