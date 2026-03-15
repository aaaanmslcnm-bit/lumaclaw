# SoulBond State Evolution Contract

This document defines the storage-version contract for `src/soulbond` state files.
It is the source of truth for how persisted SoulBond state evolves across releases.

## 1. Current Canonical Version

- **Canonical persisted version:** `1`
- **Source constant:** `SOUL_BOND_STATE_VERSION` in `types.ts`
- **Canonical validator/normalizer:** `loadAndNormalizeSoulBondState(...)` in `state-schema.ts`
- **Canonical save gate:** `validateSoulBondStateForSave(...)` in `state-schema.ts`

A version-1 SoulBond state must have this shape:

```ts
{
  version: 1;
  currentDay: number; // integer >= 0
  bond: number; // integer >= 0
  stage: "stranger" | "familiar" | "close" | "trusted" | "resonant";
  lastEvaluationAt?: string; // ISO 8601 timestamp
  dailyHistory: Array<{
    date: string; // YYYY-MM-DD
    dailyScore: number; // integer 0..100
    bondDelta: number; // integer, negative only if settings.allowNegative=true
    stage: SoulBondStage;
    reasons: Array<{
      key: string;
      label: string;
      delta: number; // integer
    }>;
  }>;
  settings: {
    enabled: boolean;
    mode: "simple" | "100-day";
    allowNegative: boolean;
    notifyDaily: boolean;
    affectTone: boolean;
    affectAvatar: boolean;
    affectVoice: boolean;
  };
}
```

Version 1 is not just a field-level schema. It also includes these derived invariants:

- `stage` must match `resolveSoulBondStage(bond)`
- `dailyHistory` dates must be strictly increasing
- `currentDay >= dailyHistory.length`
- if `currentDay === dailyHistory.length` and history is non-empty, the latest record stage must match the state stage
- `bond >= sum(dailyHistory[*].bondDelta)`
- negative `bondDelta` is forbidden unless `settings.allowNegative === true`

## 2. Legacy State Handling When `version` Is Missing

If a persisted state object has no `version` field, load it as **legacy version 0**.

### Required behavior

- Missing `version` is interpreted as `0`, not as corruption by itself.
- Legacy state must be migrated during load through `migrateSoulBondStateV0ToV1(...)`.
- The loader must return a fully canonical version-1 state.
- If migration or normalization changes the state, the loader must persist the upgraded version back to disk.

### Version-0 to version-1 migration rules

When migrating an unversioned state:

- set `version` to `1`
- preserve `currentDay` if present, otherwise default to `0`
- preserve `bond` if present, otherwise default to `0`
- preserve `dailyHistory` if it is an array, otherwise default to `[]`
- preserve `lastEvaluationAt` only if it is a non-empty string
- normalize `settings` field-by-field using defaults for missing/invalid entries
- preserve `stage` only if it is a valid SoulBond stage; otherwise derive it from `bond`

### Important distinction

- **Missing file** (`ENOENT`) is not a legacy migration case. It returns `createDefaultSoulBondState()` and does not need an on-disk upgrade step.
- **Existing file with missing `version`** is a legacy migration case and should be rewritten in canonical form after successful load.

## 3. Future Version Handling

If a state file declares a version greater than `SOUL_BOND_STATE_VERSION`, the current build must reject it.

### Required behavior

- Do **not** guess how to interpret newer versions.
- Do **not** silently drop unknown fields and continue.
- Do **not** auto-downgrade a future state.
- Throw an explicit error:
  - `Unsupported SoulBond state version X; this build supports up to Y.`

This is intentionally fail-fast. A future-version file means a newer writer has already changed the contract. Loading it with an older build would risk silent data loss or semantic corruption.

## 4. Load Responsibilities

`loadSoulBondState(filePath)` owns the following responsibilities:

1. Read the JSON file from disk.
2. If the file does not exist, return `createDefaultSoulBondState()`.
3. Parse JSON and fail immediately on malformed content.
4. Pass the parsed object into `loadAndNormalizeSoulBondState(...)`.
5. Detect legacy version-0 state when `version` is missing.
6. Reject malformed version metadata.
7. Reject unsupported future versions.
8. Validate the full canonical schema and derived invariants.
9. Normalize allowed drift:
   - recompute `stage` from `bond`
   - raise `currentDay` to cover existing history if needed
   - normalize the latest history record stage when it should match the state stage
10. If migration/normalization changed the state, write the canonical result back to the same file.
11. Return only canonical version-1 state to callers.

### Load-time normalization boundary

Load may fix **derived drift**, but it must not invent business data beyond the defined migration defaults.

Allowed examples:

- fixing `stage` when `bond` already implies the correct stage
- raising `currentDay` to match existing history length
- filling missing legacy settings from defaults

Not allowed examples:

- synthesizing missing history records
- inferring arbitrary scores or reasons
- rewriting an unsupported future version into the current schema

## 5. Save Responsibilities

`saveSoulBondState(filePath, state)` owns the following responsibilities:

1. Validate the provided state through `validateSoulBondStateForSave(...)` before any write.
2. Normalize derived fields into canonical form before serialization.
3. Refuse to write invalid or semantically inconsistent state.
4. Create parent directories with `mkdir(..., { recursive: true })`.
5. Write JSON using pretty-printed canonical output.
6. Persist a trailing newline.

### Save contract

Any state written by `saveSoulBondState(...)` must already be:

- version `1`
- schema-valid
- invariant-valid
- stage-normalized
- `currentDay`-normalized
- safe for the next load to accept without additional business-level repair

Writers should treat `saveSoulBondState(...)` as the only supported persistence entrypoint.
Direct raw JSON writes are outside the contract and can create states that later fail load.

## 6. Fail-Fast Cases

The following cases must fail immediately instead of being tolerated:

### File/content failures

- malformed JSON
- parsed root value is not an object

### Version failures

- `version` is not a non-negative integer
- `version` is greater than `SOUL_BOND_STATE_VERSION`

### Schema failures

- missing required version-1 fields after migration
- wrong primitive types (for example `currentDay: "nope"`)
- invalid enum values
- invalid date key or timestamp formats
- non-integer counters where integers are required

### Semantic/invariant failures

- `dailyHistory` dates are not strictly increasing
- `bond` is lower than accumulated `dailyHistory.bondDelta`
- negative `bondDelta` exists while `settings.allowNegative === false`
- any save-time state that cannot be normalized into a valid canonical version-1 state

### Why these fail instead of normalize

These cases indicate corrupted or incompatible data, not harmless drift. Normalizing them would hide real state damage and make debugging worse.

## 7. Version Bump Checklist

When introducing `version = N + 1`, complete all of the following before merging:

1. **Bump the constant**
   - Update `SOUL_BOND_STATE_VERSION`.

2. **Define the new canonical schema**
   - Extend `SoulBondState` types.
   - Update `SoulBondStateSchema` and related sub-schemas.
   - Document any new invariants.

3. **Add an explicit migration path**
   - Create `migrateSoulBondStateV<N>ToV<N+1>(...)`.
   - Preserve existing data where semantics still hold.
   - Default only fields that truly have safe defaults.

4. **Update version dispatch**
   - Extend `loadAndNormalizeSoulBondState(...)` to route:
     - `0` -> latest through the required migration chain
     - existing supported versions -> appropriate migration/normalization path
     - future versions -> reject

5. **Re-check normalization boundaries**
   - Decide what drift is safe to auto-fix.
   - Keep corruption/incompatibility as fail-fast.

6. **Update save validation**
   - Ensure `validateSoulBondStateForSave(...)` outputs the new canonical version.
   - Ensure all writers save only the latest version.

7. **Add/adjust tests**
   - legacy migration tests
   - future-version rejection tests
   - save validation tests
   - load normalization tests
   - regression tests for any new invariants

8. **Update this document**
   - Change the canonical version section.
   - Describe the new migration behavior and any new fail-fast rules.

9. **Review caller assumptions**
   - Check `store.ts`, `evaluate-daily.ts`, CLI/demo scripts, and any status/summary readers for assumptions about field presence or semantics.

10. **Do not ship partial support**
   - A version bump is incomplete if the code can write the new version but cannot read/migrate older supported states cleanly.

## Practical Rule of Thumb

- **Load:** be strict, migrate known legacy, normalize safe drift, reject unknown future.
- **Save:** always write the latest canonical form.
- **Never:** silently reinterpret data whose meaning this build does not understand.
