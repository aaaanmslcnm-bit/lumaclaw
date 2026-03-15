# LumaClaw Reset Draft

This draft is a non-invasive placeholder for a minimal LumaClaw 2.0 mainline.

It exists so Yukino can review a concrete reset shape without overwriting the current upstream top-level files in this repo.

## Draft intent

- keep the default identity pointed at `LumaClaw`
- keep the future default entrypoint pointed at `lumaclaw`
- keep the dependency story narrow enough for a SoulBond-first reset
- avoid carrying `apps/`, `extensions/`, `skills/`, or compatibility entrypoints into phase one by default

## What this draft is not

- not the live repo `README.md`
- not a claim that the reset has already migrated `src/soulbond`
- not approval to overwrite upstream OpenClaw files yet

## Minimal reset shape under review

- `reset-drafts/package.reset-draft.json`
- `reset-drafts/lumaclaw.reset-draft.mjs`
- `reset-drafts/README.reset-draft.md`
- `reset-drafts/CURRENT_STATE.reset-draft.md`
- `reset-drafts/ROADMAP.reset-draft.md`
- `reset-drafts/VISION.reset-draft.md`
- `docs/reset-bootstrap/minimal-skeleton-draft-v1.md`

## Dependency direction

The package draft is intentionally much smaller than the inherited upstream package.

Current keep direction from the whitelist:

- `zod` as the only hard runtime dependency for the SoulBond core
- `lit` only as an optional dependency if the minimum UI slice is retained later
- `typescript`
- `tsx`
- `vitest`
- `@types/node`

Everything else needs to earn its way back in a later reset pass.
