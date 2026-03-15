# Minimal Skeleton Draft v1

_Drafted: 2026-03-15_

## Files created

- `reset-drafts/package.reset-draft.json`
- `reset-drafts/README.reset-draft.md`
- `reset-drafts/CURRENT_STATE.reset-draft.md`
- `reset-drafts/ROADMAP.reset-draft.md`
- `reset-drafts/VISION.reset-draft.md`
- `reset-drafts/lumaclaw.reset-draft.mjs`
- `docs/reset-bootstrap/minimal-skeleton-draft-v1.md`

## Why they were created

- `package.reset-draft.json` gives Yukino a concrete minimal dependency direction based on the reset dependency whitelist instead of the inherited upstream package surface.
- `README.reset-draft.md` states the reset intent without replacing the live top-level README.
- `CURRENT_STATE.reset-draft.md` records that this repo is still an upstream base and that the reset remains scaffold-only.
- `ROADMAP.reset-draft.md` narrows the next steps to whitelist-sized review gates.
- `VISION.reset-draft.md` captures the smallest-credible-mainline thesis for the reset.
- `lumaclaw.reset-draft.mjs` gives the future default binary name a harmless review-only placeholder.
- this bootstrap note gives Yukino one place to review the draft outputs and decision points.

## Open questions for Yukino

- Should `lit` remain in the phase-one package direction, or should phase one avoid any UI dependency until after `src/soulbond` is carried?
- Should the future live package keep the current OpenClaw metadata placeholders temporarily, or should repo/homepage metadata be rewritten at the same time as the top-level identity files?
- Is the next approved carry step limited to identity files plus `src/soulbond/**`, or should the minimum governance docs move in the same pass?

## Blockers

- No hard blocker for this draft step.
- The next pass is blocked on Yukino review of the package shape, entrypoint shape, and phase-one carry order.
