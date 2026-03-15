# LumaClaw

**A SoulBond-first clean reset mainline for a companion-oriented desktop AI.**

LumaClaw is the current public identity of a project that originally evolved through earlier forms including SoulClaw and a heavier fork-stage repository. This repo is the **clean reset mainline**: a deliberately reduced technical surface built to preserve the real differentiator first, then grow back the rest intentionally.

Right now, that differentiator is **SoulBond**.

## What this repo is

This repo is currently:

- a **clean-reset LumaClaw mainline**
- built on a **reduced OpenClaw-derived technical base**
- centered on the **SoulBond core loop**
- verified by a **minimal install / typecheck / test / CLI path**

This repo is **not** trying to carry the full old repository surface forward all at once.

## What is already real here

The current mainline already includes:

- `src/soulbond/**`
- `scripts/soulbond-*.ts`
- a reset-local SoulBond cron type layer
- transcript metadata stripping support for SoulBond transcript handling
- a minimal `lumaclaw` CLI entrypoint
- a passing SoulBond-first validation path

Current technical validation baseline:

- `npm install --no-package-lock`
- `npm run typecheck`
- `npm test`
- `node .\\lumaclaw.mjs`

## Current project direction

LumaClaw is trying to become a companion-oriented desktop AI that keeps a real technical spine.

That means:

- preserve a real agent/runtime core
- preserve continuity and relationship-layer logic through SoulBond
- grow product surface deliberately instead of inheriting migration residue blindly
- prefer one clear public identity over a pile of compatibility ghosts

## What is intentionally deferred

The following are intentionally **not** part of the current reset mainline yet:

- broad UI carry
- apps / extensions / skills breadth
- old compatibility entrypoints like `openclaw` / `soulclaw`
- broad workflow / release / packaging surface
- the full inherited upstream runtime tree

Those can return later only if they earn their way back in.

## Quick start

Runtime: **Node >= 22**

```bash
npm install --no-package-lock
npm run typecheck
npm test
node .\lumaclaw.mjs
```

Current CLI surface:

```bash
lumaclaw status
lumaclaw demo
lumaclaw run-daily
lumaclaw cron-spec
lumaclaw build-summary
```

Or directly through Node during reset-stage development:

```bash
node .\lumaclaw.mjs status
node .\lumaclaw.mjs demo
```

## Current docs

- [Current State](CURRENT_STATE.md)
- [Roadmap](ROADMAP.md)
- [Vision](VISION.md)
- [Reset bootstrap notes](docs/reset-bootstrap/)

## One-line summary

> LumaClaw is no longer pretending to be a full inherited fork. This repo is the smaller, cleaner mainline where SoulBond comes first and everything else has to earn its place.
