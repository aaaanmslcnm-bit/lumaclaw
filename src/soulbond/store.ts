import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  loadAndNormalizeSoulBondState,
  validateSoulBondStateForSave,
} from "./state-schema.js";
import { createDefaultSoulBondState, type SoulBondState } from "./types.js";

const DEFAULT_SOUL_BOND_STATE_PATH_SEGMENTS = [".artifacts", "soulbond", "state.json"] as const;

function isMissingFileError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

export function resolveDefaultSoulBondStatePath(workspaceDir: string | undefined): string | undefined {
  if (!workspaceDir?.trim()) {
    return undefined;
  }
  return resolve(workspaceDir, ...DEFAULT_SOUL_BOND_STATE_PATH_SEGMENTS);
}

// The caller decides where SoulBond state should live.
// For the first version we keep storage boring: one JSON file in one known location.
export async function loadSoulBondState(filePath: string): Promise<SoulBondState> {
  try {
    const raw = await readFile(filePath, "utf8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch (error) {
      throw new Error(`Failed to parse SoulBond state at ${filePath}: ${String(error)}`, {
        cause: error,
      });
    }

    let normalized;
    try {
      normalized = loadAndNormalizeSoulBondState(parsed);
    } catch (error) {
      throw new Error(`Failed to validate SoulBond state at ${filePath}: ${String(error)}`, {
        cause: error,
      });
    }
    if (normalized.changed) {
      await saveSoulBondState(filePath, normalized.state);
    }
    return normalized.state;
  } catch (error) {
    if (isMissingFileError(error)) {
      return createDefaultSoulBondState();
    }
    throw error;
  }
}

// Reply-boundary integrations should treat SoulBond as opportunistic runtime context:
// read the current state if it exists, but never create or rewrite state as a side effect.
export async function loadOptionalSoulBondState(filePath: string | undefined): Promise<SoulBondState | undefined> {
  if (!filePath) {
    return undefined;
  }
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return loadAndNormalizeSoulBondState(parsed).state;
  } catch (error) {
    if (isMissingFileError(error)) {
      return undefined;
    }
    return undefined;
  }
}

export async function saveSoulBondState(filePath: string, state: SoulBondState): Promise<void> {
  let validatedState: SoulBondState;
  try {
    validatedState = validateSoulBondStateForSave(state);
  } catch (error) {
    throw new Error(`Failed to validate SoulBond state before saving ${filePath}: ${String(error)}`, {
      cause: error,
    });
  }
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(validatedState, null, 2) + "\n", "utf8");
}
