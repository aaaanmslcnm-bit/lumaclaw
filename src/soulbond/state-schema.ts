import { z } from "zod";
import {
  SOUL_BOND_SETTINGS_MODES,
  SOUL_BOND_STAGES,
  SOUL_BOND_STATE_VERSION,
  createDefaultSoulBondState,
  resolveSoulBondStage,
  type SoulBondSettings,
  type SoulBondState,
} from "./types.js";
import { isValidSoulBondDateKey, isValidSoulBondTimestamp } from "./validation.js";

const SoulBondDateKeySchema = z.string().refine(isValidSoulBondDateKey, {
  message: "Expected a YYYY-MM-DD date key.",
});

const SoulBondTimestampSchema = z.string().refine(isValidSoulBondTimestamp, {
  message: "Expected an ISO 8601 timestamp.",
});

const SoulBondSettingsSchema = z
  .object({
    enabled: z.boolean(),
    mode: z.enum(SOUL_BOND_SETTINGS_MODES),
    allowNegative: z.boolean(),
    notifyDaily: z.boolean(),
    affectTone: z.boolean(),
    affectAvatar: z.boolean(),
    affectVoice: z.boolean(),
  })
  .strict();

const ScoreReasonSchema = z
  .object({
    key: z.string().min(1),
    label: z.string().min(1),
    delta: z.number().int(),
  })
  .strict();

const SoulBondRecordSchema = z
  .object({
    date: SoulBondDateKeySchema,
    dailyScore: z.number().int().min(0).max(100),
    bondDelta: z.number().int(),
    stage: z.enum(SOUL_BOND_STAGES),
    reasons: z.array(ScoreReasonSchema),
  })
  .strict();

export const SoulBondStateSchema = z
  .object({
    version: z.literal(SOUL_BOND_STATE_VERSION),
    currentDay: z.number().int().min(0),
    bond: z.number().int().min(0),
    stage: z.enum(SOUL_BOND_STAGES),
    lastEvaluationAt: SoulBondTimestampSchema.optional(),
    dailyHistory: z.array(SoulBondRecordSchema),
    settings: SoulBondSettingsSchema,
  })
  .strict()
  .superRefine((state, ctx) => {
    let previousDate: string | undefined;
    let accumulatedHistoryDelta = 0;

    for (const [index, record] of state.dailyHistory.entries()) {
      if (previousDate && record.date <= previousDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dailyHistory", index, "date"],
          message: `SoulBond dailyHistory dates must be strictly increasing; ${record.date} cannot follow ${previousDate}.`,
        });
      }
      if (!state.settings.allowNegative && record.bondDelta < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dailyHistory", index, "bondDelta"],
          message: "Negative bondDelta requires settings.allowNegative=true.",
        });
      }
      previousDate = record.date;
      accumulatedHistoryDelta += record.bondDelta;
    }

    if (state.bond < accumulatedHistoryDelta) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bond"],
        message: `Bond cannot be lower than accumulated dailyHistory bondDelta total (${accumulatedHistoryDelta}).`,
      });
    }
  });

type MutableJsonObject = Record<string, unknown>;

export interface SoulBondStateLoadResult {
  state: SoulBondState;
  changed: boolean;
  changes: string[];
}

function isRecord(value: unknown): value is MutableJsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSoulBondStage(value: unknown): value is SoulBondState["stage"] {
  return typeof value === "string" && SOUL_BOND_STAGES.includes(value as SoulBondState["stage"]);
}

function formatIssuePath(path: PropertyKey[]): string {
  let formatted = "";
  for (const segment of path) {
    if (typeof segment === "number") {
      formatted += `[${segment}]`;
      continue;
    }
    const key = String(segment);
    formatted += formatted ? `.${key}` : key;
  }
  return formatted;
}

function formatValidationError(issues: z.ZodIssue[], context: string): Error {
  const message = issues
    .map((issue) => {
      const path = formatIssuePath(issue.path);
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join("; ");
  return new Error(`${context}: ${message}`);
}

function parseSoulBondStateOrThrow(value: unknown, context: string): SoulBondState {
  const parsed = SoulBondStateSchema.safeParse(value);
  if (!parsed.success) {
    throw formatValidationError(parsed.error.issues, context);
  }
  return parsed.data;
}

function detectSoulBondStateVersion(state: MutableJsonObject): number {
  if (!("version" in state) || state.version === undefined) {
    return 0;
  }
  if (typeof state.version !== "number" || !Number.isInteger(state.version) || state.version < 0) {
    throw new Error("Invalid SoulBond state version: expected a non-negative integer.");
  }
  return state.version;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function normalizeLegacySettings(value: unknown): SoulBondSettings {
  const defaults = createDefaultSoulBondState().settings;
  if (!isRecord(value)) {
    return defaults;
  }
  return {
    enabled: typeof value.enabled === "boolean" ? value.enabled : defaults.enabled,
    mode:
      value.mode === "simple" || value.mode === "100-day"
        ? value.mode
        : defaults.mode,
    allowNegative: typeof value.allowNegative === "boolean" ? value.allowNegative : defaults.allowNegative,
    notifyDaily: typeof value.notifyDaily === "boolean" ? value.notifyDaily : defaults.notifyDaily,
    affectTone: typeof value.affectTone === "boolean" ? value.affectTone : defaults.affectTone,
    affectAvatar: typeof value.affectAvatar === "boolean" ? value.affectAvatar : defaults.affectAvatar,
    affectVoice: typeof value.affectVoice === "boolean" ? value.affectVoice : defaults.affectVoice,
  };
}

function migrateSoulBondStateV0ToV1(state: MutableJsonObject): SoulBondStateLoadResult {
  const defaults = createDefaultSoulBondState();
  const bond = "bond" in state ? state.bond : defaults.bond;
  const derivedStage = resolveSoulBondStage(isNonNegativeInteger(bond) ? bond : defaults.bond);
  const next: MutableJsonObject = {
    version: SOUL_BOND_STATE_VERSION,
    currentDay: "currentDay" in state ? state.currentDay : defaults.currentDay,
    bond,
    stage: isSoulBondStage(state.stage) ? state.stage : derivedStage,
    dailyHistory: Array.isArray(state.dailyHistory) ? state.dailyHistory : defaults.dailyHistory,
    settings: normalizeLegacySettings(state.settings),
  };
  const changes = ["Migrated SoulBond state from legacy version 0 to version 1."];

  if (!("currentDay" in state)) {
    changes.push("Initialized missing SoulBond currentDay to 0.");
  }
  if (!("bond" in state)) {
    changes.push("Initialized missing SoulBond bond to 0.");
  }
  if (!Array.isArray(state.dailyHistory)) {
    changes.push("Initialized missing SoulBond dailyHistory to an empty list.");
  }
  if (!isRecord(state.settings)) {
    changes.push("Initialized missing SoulBond settings with defaults.");
  }
  if (!isSoulBondStage(state.stage)) {
    changes.push(`Derived SoulBond stage from bond as ${derivedStage}.`);
  }
  if (typeof state.lastEvaluationAt === "string" && state.lastEvaluationAt.trim().length > 0) {
    next.lastEvaluationAt = state.lastEvaluationAt;
  }

  const validated = parseSoulBondStateOrThrow(next, "Invalid migrated SoulBond state");
  const normalized = normalizeDerivedSoulBondFields(validated);
  return {
    state: normalized.state,
    changed: true,
    changes: normalized.changed ? [...changes, ...normalized.changes] : changes,
  };
}

function normalizeDerivedSoulBondFields(state: SoulBondState): SoulBondStateLoadResult {
  let nextState = state;
  const changes: string[] = [];
  const expectedStage = resolveSoulBondStage(nextState.bond);

  if (nextState.stage !== expectedStage) {
    nextState = {
      ...nextState,
      stage: expectedStage,
    };
    changes.push(`Normalized SoulBond stage from ${state.stage} to ${expectedStage}.`);
  }

  if (nextState.currentDay < nextState.dailyHistory.length) {
    nextState = {
      ...nextState,
      currentDay: nextState.dailyHistory.length,
    };
    changes.push(
      `Raised SoulBond currentDay from ${state.currentDay} to ${nextState.dailyHistory.length} to cover recorded history.`,
    );
  }

  if (nextState.currentDay === nextState.dailyHistory.length && nextState.dailyHistory.length > 0) {
    const lastIndex = nextState.dailyHistory.length - 1;
    const lastRecord = nextState.dailyHistory[lastIndex];
    if (lastRecord && lastRecord.stage !== nextState.stage) {
      const dailyHistory = [...nextState.dailyHistory];
      dailyHistory[lastIndex] = {
        ...lastRecord,
        stage: nextState.stage,
      };
      nextState = {
        ...nextState,
        dailyHistory,
      };
      changes.push(
        `Normalized SoulBond latest record stage from ${lastRecord.stage} to ${nextState.stage}.`,
      );
    }
  }

  return {
    state: nextState,
    changed: changes.length > 0,
    changes,
  };
}

export function loadAndNormalizeSoulBondState(raw: unknown): SoulBondStateLoadResult {
  if (!isRecord(raw)) {
    throw new Error("Invalid SoulBond state: expected a JSON object.");
  }

  const version = detectSoulBondStateVersion(raw);
  if (version > SOUL_BOND_STATE_VERSION) {
    throw new Error(
      `Unsupported SoulBond state version ${version}; this build supports up to ${SOUL_BOND_STATE_VERSION}.`,
    );
  }

  if (version === 0) {
    return migrateSoulBondStateV0ToV1(raw);
  }

  const state = parseSoulBondStateOrThrow(raw, "Invalid SoulBond state");
  return normalizeDerivedSoulBondFields(state);
}

export function validateSoulBondStateForSave(state: SoulBondState): SoulBondState {
  const parsed = parseSoulBondStateOrThrow(state, "Invalid SoulBond state before save");
  return normalizeDerivedSoulBondFields(parsed).state;
}
