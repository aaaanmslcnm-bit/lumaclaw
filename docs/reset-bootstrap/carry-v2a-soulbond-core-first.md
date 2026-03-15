# Carry v2A — SoulBond Core First

_Drafted by Yukino after worker carry recovery: 2026-03-15_

## Summary

Second Carry v2A moved the approved SoulBond-first scope from the frozen archive repo into the clean reset repo.

The worker failed to close the task cleanly, but the actual carry work largely landed before the failure. This note records the recovered implementation state and the validation that was completed afterward.

## Files added / modified

### Carried into the reset repo
- `src/soulbond/**`
- `scripts/soulbond-*.ts`
- `src/auto-reply/reply/strip-inbound-meta.ts`

### New reset-local file
- `src/soulbond/cron-types.ts`

### Updated carry files to use reset-local cron types
- `src/soulbond/cron-adapter.ts`
- `src/soulbond/cron-job.ts`
- `src/soulbond/schedule.ts`

## How cron types were handled

The carry did **not** keep the old dependency on `../cron/types.js`.

Instead, the reset repo now uses a local file:
- `src/soulbond/cron-types.ts`

The carried cron-facing SoulBond files now import from:
- `./cron-types.js`

This keeps the SoulBond carry from depending on the broader old cron subsystem during phase one.

## Validation attempted

### Manual validation completed
- Verified `src/auto-reply/reply/strip-inbound-meta.ts` exists in the reset repo.
- Verified `src/soulbond/cron-types.ts` exists in the reset repo.
- Verified the reset repo now contains the carried `src/soulbond/` tree.
- Verified all 5 `scripts/soulbond-*.ts` files exist in the reset repo.
- Verified these files no longer import `../cron/types.js`:
  - `src/soulbond/cron-adapter.ts`
  - `src/soulbond/cron-job.ts`
  - `src/soulbond/schedule.ts`
- Verified forbidden top-level files were **not** modified in this pass:
  - `README.md`
  - `CURRENT_STATE.md`
  - `ROADMAP.md`
  - `VISION.md`
  - `package.json`
  - `lumaclaw.mjs`

### Validation limitations
- A full TypeScript / test validation was **not** completed in this pass.
- The reset repo has not yet been converted to the reset-local package/dependency shape, so dependency-sensitive validation remains a follow-up step.

## Blockers / remaining risks

- The worker failed while trying to finish its verification/reporting phase, so this note was recovered manually.
- The carry should still be treated as needing a follow-up validation pass after the reset-local package/dependency skeleton is finalized.
- UI carry is still deferred and was not part of this pass.

## Why the worker failed

The worker failure appears to be caused by brittle verification commands rather than by the core carry itself.

Observed failure pattern:
- verification commands using `rg` exited with code `1` when no matches were found
- some PowerShell command strings also showed quoting/parser issues during verification
- the implementation note required by the task was never written before the run terminated

Interpretation:
- the implementation carry mostly landed
- the run failed during narrow validation/reporting cleanup, not during the main copy/import rewrite itself

## Current judgment

### Status
`landed-with-manual-recovery`

### Meaning
- the approved v2A carry content is present in the reset repo
- the worker did not complete the task cleanly enough to accept the raw worker run as-is
- Yukino manually recovered the missing implementation note and validation summary

## Next recommended step

Proceed to the next bounded review/validation step before expanding scope again:
- confirm the reset-local package/dependency shape
- run a focused SoulBond-first validation pass
- only then decide whether to move into the UI carry round
