import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadOptionalSoulBondState, loadSoulBondState, resolveDefaultSoulBondStatePath, saveSoulBondState } from "./store.js";
import { SOUL_BOND_STATE_VERSION, createDefaultSoulBondState } from "./types.js";

const tempDirs: string[] = [];

async function createTempStatePath() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "soulbond-store-"));
  tempDirs.push(dir);
  return path.join(dir, "state.json");
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0, tempDirs.length).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe("soulbond store", () => {
  it("resolves the default workspace artifact path for runtime state lookup", () => {
    expect(resolveDefaultSoulBondStatePath("/tmp/workspace")).toBe(
      path.resolve("/tmp/workspace", ".artifacts", "soulbond", "state.json"),
    );
    expect(resolveDefaultSoulBondStatePath(undefined)).toBeUndefined();
  });

  it("returns the default state when no file exists", async () => {
    const statePath = await createTempStatePath();

    const state = await loadSoulBondState(statePath);

    expect(state).toEqual(createDefaultSoulBondState());
  });

  it("returns undefined for missing optional runtime state", async () => {
    const statePath = await createTempStatePath();

    await expect(loadOptionalSoulBondState(statePath)).resolves.toBeUndefined();
  });

  it("returns undefined for invalid optional runtime state", async () => {
    const statePath = await createTempStatePath();
    await fs.writeFile(statePath, "{not json", "utf8");

    await expect(loadOptionalSoulBondState(statePath)).resolves.toBeUndefined();
  });

  it("migrates unversioned legacy state and persists the canonical version", async () => {
    const statePath = await createTempStatePath();
    await fs.writeFile(
      statePath,
      JSON.stringify({
        currentDay: 3,
        bond: 12,
        dailyHistory: [],
        settings: {
          enabled: false,
          affectVoice: true,
        },
      }),
    );

    const state = await loadSoulBondState(statePath);
    const persisted = JSON.parse(await fs.readFile(statePath, "utf8")) as Record<string, unknown>;

    expect(state.version).toBe(SOUL_BOND_STATE_VERSION);
    expect(state.currentDay).toBe(3);
    expect(state.bond).toBe(12);
    expect(state.stage).toBe("familiar");
    expect(state.settings.enabled).toBe(false);
    expect(state.settings.mode).toBe("100-day");
    expect(state.settings.affectVoice).toBe(true);
    expect(persisted).toEqual(state);
  });

  it("normalizes a drifted stage back to the bond-derived stage", async () => {
    const statePath = await createTempStatePath();
    const state = createDefaultSoulBondState();
    state.bond = 55;
    state.stage = "stranger";
    await fs.writeFile(statePath, JSON.stringify(state, null, 2));

    const loaded = await loadSoulBondState(statePath);
    const persisted = JSON.parse(await fs.readFile(statePath, "utf8")) as { stage: string };

    expect(loaded.stage).toBe("trusted");
    expect(persisted.stage).toBe("trusted");
  });

  it("normalizes optional runtime state without rewriting the file", async () => {
    const statePath = await createTempStatePath();
    const state = createDefaultSoulBondState();
    state.bond = 55;
    state.stage = "stranger";
    await fs.writeFile(statePath, JSON.stringify(state, null, 2));

    const loaded = await loadOptionalSoulBondState(statePath);
    const persisted = JSON.parse(await fs.readFile(statePath, "utf8")) as { stage: string };

    expect(loaded?.stage).toBe("trusted");
    expect(persisted.stage).toBe("stranger");
  });

  it("raises currentDay when persisted history already contains more recorded days", async () => {
    const statePath = await createTempStatePath();
    const state = createDefaultSoulBondState();
    state.bond = 1;
    state.dailyHistory.push({
      date: "2026-03-08",
      dailyScore: 70,
      bondDelta: 1,
      stage: "stranger",
      reasons: [],
    });
    await fs.writeFile(statePath, JSON.stringify(state, null, 2));

    const loaded = await loadSoulBondState(statePath);

    expect(loaded.currentDay).toBe(1);
  });

  it("rejects invalid persisted state with field-level validation details", async () => {
    const statePath = await createTempStatePath();
    await fs.writeFile(
      statePath,
      JSON.stringify({
        version: SOUL_BOND_STATE_VERSION,
        currentDay: "nope",
      }),
    );

    await expect(loadSoulBondState(statePath)).rejects.toThrow(/currentDay/i);
  });

  it("rejects out-of-order dailyHistory dates", async () => {
    const statePath = await createTempStatePath();
    await fs.writeFile(
      statePath,
      JSON.stringify({
        ...createDefaultSoulBondState(),
        currentDay: 2,
        bond: 2,
        dailyHistory: [
          {
            date: "2026-03-09",
            dailyScore: 70,
            bondDelta: 1,
            stage: "stranger",
            reasons: [],
          },
          {
            date: "2026-03-08",
            dailyScore: 70,
            bondDelta: 1,
            stage: "stranger",
            reasons: [],
          },
        ],
      }),
    );

    await expect(loadSoulBondState(statePath)).rejects.toThrow(/strictly increasing/i);
  });

  it("rejects impossible bond totals that fall below accumulated history", async () => {
    const statePath = await createTempStatePath();
    await fs.writeFile(
      statePath,
      JSON.stringify({
        ...createDefaultSoulBondState(),
        currentDay: 2,
        bond: 1,
        dailyHistory: [
          {
            date: "2026-03-08",
            dailyScore: 70,
            bondDelta: 1,
            stage: "stranger",
            reasons: [],
          },
          {
            date: "2026-03-09",
            dailyScore: 70,
            bondDelta: 1,
            stage: "familiar",
            reasons: [],
          },
        ],
      }),
    );

    await expect(loadSoulBondState(statePath)).rejects.toThrow(/accumulated dailyHistory bondDelta/i);
  });

  it("rejects negative bondDelta history when allowNegative is disabled", async () => {
    const statePath = await createTempStatePath();
    await fs.writeFile(
      statePath,
      JSON.stringify({
        ...createDefaultSoulBondState(),
        currentDay: 1,
        dailyHistory: [
          {
            date: "2026-03-08",
            dailyScore: 40,
            bondDelta: -1,
            stage: "stranger",
            reasons: [],
          },
        ],
      }),
    );

    await expect(loadSoulBondState(statePath)).rejects.toThrow(/allowNegative/i);
  });

  it("rejects unsupported future state versions", async () => {
    const statePath = await createTempStatePath();
    const state = {
      ...createDefaultSoulBondState(),
      version: SOUL_BOND_STATE_VERSION + 1,
    };
    await fs.writeFile(statePath, JSON.stringify(state, null, 2));

    await expect(loadSoulBondState(statePath)).rejects.toThrow(/Unsupported SoulBond state version/i);
  });

  it("validates state before saving", async () => {
    const statePath = await createTempStatePath();
    const invalidState = {
      ...createDefaultSoulBondState(),
      currentDay: -1,
    } as unknown as Parameters<typeof saveSoulBondState>[1];

    await expect(saveSoulBondState(statePath, invalidState)).rejects.toThrow(/currentDay/i);
  });
});
