# LumaClaw Roadmap

This roadmap tracks the clean-reset LumaClaw mainline as it exists today: a reduced, SoulBond-first repo with a working technical verification path and intentionally deferred breadth.

The development order remains deliberate:

1. make the reset mainline real
2. make it verifiable
3. grow the public identity layer truthfully
4. only then expand UI / broader product surface
5. only later reconsider wider inherited subsystems

If that order gets reversed, the reset stops being clean.

---

## Current stage

Best current summary:

> **Early clean-reset productization: the SoulBond-first mainline is real and verifiable, but broader product surface is still intentionally deferred.**

What is already true:

- SoulBond core is carried into the new repo
- the new repo has a working install / typecheck / test / minimal CLI path
- the repo is now a real mainline, not just a draft scaffold
- the old heavy repo has been frozen as archive/reference

What is not yet true:

- the minimum UI slice is not yet carried
- the broader product surface is not yet rebuilt
- apps/extensions/skills breadth is not yet part of the new mainline
- the new repo is not yet a full public-feature replacement for the old world

---

## Phase 1 — Clean reset technical mainline

### Goal
Create a smaller LumaClaw mainline that can stand on its own without dragging the full old repo along.

### Status
**Landed.**

### Evidence
- SoulBond carry completed
- minimal verification path passed
- top-level technical identity now exists in reset form

---

## Phase 2 — Identity and project-truth consolidation

### Goal
Make the top-level identity and truth docs match the repo that actually exists.

### Why this phase matters
A technically working repo still feels unstable if its public/top-level explanation lags behind reality.

### Priority work
- keep README / CURRENT_STATE / ROADMAP / VISION aligned with the reset mainline
- keep claims scoped to what is actually present
- avoid both overclaiming and apologetic underclaiming

### Status
**Active.**

---

## Phase 3 — First bounded product-surface expansion

### Goal
Choose the next small visible product move after the technical mainline is stable.

### Candidate paths
- carry the minimum UI slice
- harden the SoulBond-first CLI/demo experience further
- refine package/validation ergonomics before UI

### Status
**Next bounded decision.**

This should be a choice, not automatic momentum.

---

## Phase 4 — Broader system reintroduction (if earned)

### Goal
Reintroduce wider surfaces only if they serve the reset mainline instead of polluting it.

### Examples
- selected UI support ring beyond the minimum slice
- selected docs breadth
- carefully chosen runtime subsystems

### Status
**Deferred.**

---

## What is intentionally not first

LumaClaw should **not** prioritize these before the new mainline is stable and clearly scoped:

- restoring legacy compatibility entrypoints
- broad repo-wide carry from the frozen archive
- apps/extensions/skills breadth
- broad UI migration without a bounded reason
- rebuilding the old heavy workflow surface by default

---

## Immediate roadmap priorities

### 1. Keep the technical mainline stable
Because the clean reset only pays off if the new repo stays smaller and verifiable.

### 2. Finish the top-level identity consolidation
Because the repo should now describe itself as LumaClaw, not as an inherited upstream shell.

### 3. Choose the next bounded visible product move
Because after technical validation, the next question is whether to carry UI or further harden the SoulBond-first surface.

---

## One-sentence roadmap summary

LumaClaw is moving from **clean-reset technical proof** toward **a smaller but real companion-oriented mainline** — and it should only grow when each new layer earns its place.
