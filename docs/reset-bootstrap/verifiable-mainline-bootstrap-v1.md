# Verifiable Mainline Bootstrap v1

_Drafted by Yukino: 2026-03-15_

## Summary

This pass promoted the clean reset repo from a draft-only scaffold into its first truly verifiable SoulBond-first mainline stage.

The goal was not full productization. The goal was to establish a minimal top-level technical shape that can install, typecheck, run tests, and expose a basic `lumaclaw` entrypoint without widening scope into UI or broad inherited surfaces.

## Files changed

### Top-level technical promotion
- `package.json`
- `lumaclaw.mjs`
- `tsconfig.json`
- `vitest.config.ts`

### Supporting carried files already in place from earlier pass
- `src/soulbond/**`
- `scripts/soulbond-*.ts`
- `src/auto-reply/reply/strip-inbound-meta.ts`
- `src/soulbond/cron-types.ts`

## Chosen validation path

The repo was validated with the smallest meaningful sequence for the current SoulBond-first reset:

1. `npm install --no-package-lock`
2. `npm run typecheck`
3. `npm test`
4. `node .\\lumaclaw.mjs`

## Validation results

### Install
- `npm install --no-package-lock`
- Result: success

### Typecheck
- `npm run typecheck`
- Result: success

### Tests
- `npm test`
- Result: success
- Test files passed: 12
- Test cases passed: 71

### CLI entrypoint
- `node .\\lumaclaw.mjs`
- Result: success
- Current behavior: prints reset-mainline help text and available SoulBond-first commands

## What was intentionally deferred

This pass did **not** do any of the following:
- modify top-level `README.md`
- modify top-level `CURRENT_STATE.md`
- modify top-level `ROADMAP.md`
- modify top-level `VISION.md`
- carry UI files or the UI support ring
- restore `openclaw` / `soulclaw` compatibility entrypoints
- touch apps/extensions/skills/workflow breadth

## Package/dependency shape chosen

The top-level package was reduced to a minimal reset-local shape:

### Runtime dependency
- `zod`

### Dev/tooling dependencies
- `@types/node`
- `tsx`
- `typescript`
- `vitest`

This is intentionally much smaller than the inherited upstream OpenClaw package surface.

## Risks / Notes

- The repo is now technically verifiable for the SoulBond-first slice, but it is not yet a finished public-facing LumaClaw top-level identity repo.
- Top-level project-truth docs still need a later promotion pass.
- UI carry remains deferred.
- The current `lumaclaw.mjs` is a minimal dispatcher, not the final long-term CLI design.

## Current judgment

### Status
`pass`

### Meaning
The clean reset repo has successfully crossed the threshold from:
- draft-only scaffold

to:
- a minimally verifiable SoulBond-first mainline

That is enough to continue into the next bounded phase without going back to the old frozen repo as the default development surface.

## Recommended next step

Proceed to the next bounded promotion pass:
- promote the top-level identity/docs layer deliberately
- then decide whether UI carry should happen before or after that documentation promotion
