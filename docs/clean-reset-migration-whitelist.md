# Clean Reset Migration Whitelist

_Last updated: 2026-03-15_

This file defines what should be carried into a clean-reset LumaClaw repo, what should be preserved only as archive/reference, and what should **not** be brought into the new mainline during the first reset pass.

The goal is simple:

> inherit project truth and core differentiation, not the full weight of migration-era residue.

---

## Reset intent

The clean reset is **not** a destructive panic rename.
It is a controlled rebuild of the public/project mainline using:

1. a clean technical base
2. the minimum real LumaClaw identity layer
3. the SoulBond differentiation layer
4. the minimum governance/docs layer needed to keep project truth coherent

---

## A. Carry directly into the new mainline

These files/directories define current project identity, core differentiation, or minimum governance. They should move into the new repo's live mainline.

### A1. Project identity layer
- `package.json` *(selective carry: public identity, repository/homepage/bugs metadata, minimal scripts/bin policy after reset decision)*
- `README.md`
- `CURRENT_STATE.md`
- `ROADMAP.md`
- `VISION.md`
- `lumaclaw.mjs`

### A2. Core differentiation layer
- `src/soulbond/**`

### A3. Minimum product-facing slice
- `ui/src/ui/components/soulbond-status-card.ts`
- `ui/src/ui/views/overview.ts`
- `ui/src/ui/views/overview.soulbond.test.ts`

### A4. Minimum project-governance layer
- `docs/acceptance-log.md`
- `docs/collaboration-workflow.md`
- `docs/state-arbitration-structure.md`
- `docs/light-spec-template.md`
- `docs/first-functional-ui-slice.md`
- `docs/soulbond-overview-card-implementation-pass.md`
- `docs/soulbond-explanation-panel-followup.md`

### A5. Minimum dependency / repo contract layer
- `pnpm-lock.yaml` *(only if the reset repo still uses pnpm workspace structure and the carried packages actually need it)*
- minimal `.github/workflows/` files rebuilt or selectively reintroduced only after the new repo shape is confirmed

---

## B. Preserve as archive/reference only

These should be kept for evidence, migration memory, or later cherry-pick/reference, but should **not** define the new repo's live mainline by default.

### B1. Migration/history notes
- `docs/soulclaw-residual-cleanup-checklist.md`
- prior README/CURRENT_STATE/ROADMAP snapshots
- PR #12 remediation notes
- CI runner-migration notes
- lockfile/secrets/install-smoke repair notes

### B2. Acceptance/history evidence
- selected relevant files from `.artifacts/`
- any structured acceptance report or migration retrospective
- recent PR/branch repair notes that explain how the old repo drifted

### B3. Old workflow references
- old `.github/workflows/` files as reference only
- old Docker/build scripts as reference only
- old compatibility notes as reference only

Recommended location after reset:
- `docs/archive/`
- `docs/migration-notes/`
- `archive/`

---

## C. Do not bring into the new mainline in the first reset pass

These are the highest-risk sources of re-polluting the clean reset. They should stay out unless later reintroduced intentionally.

### C1. Compatibility surfaces to exclude initially
- `soulclaw.mjs`
- `openclaw.mjs`
- legacy `soulclaw` / `openclaw` bins by default
- old dual-name launcher compatibility unless explicitly re-added later

### C2. Workflow / infra residue to exclude initially
- the full old `.github/workflows/` tree copied wholesale
- old Blacksmith-specific or transition-specific workflow assumptions
- old install/release/Docker compatibility paths unless needed by the reset scope

### C3. Generated or non-source residue
- `.artifacts/`
- `node_modules/`
- `dist/`
- transient CI/debug outputs

### C4. Non-core or side-track directories to exclude initially
- `Swabble/`
- `.pi/`
- broad `apps/` surfaces unless the reset scope explicitly includes them
- broad `extensions/` and `skills/` carryover unless the reset requires them immediately

### C5. Broad migration-era wording carryover
- large old docs/passages whose primary value is explaining why the old repo was messy
- any text that makes the new repo sound like an apology instead of a project

---

## D. Minimal reset target shape

The new repo should initially aim to look more like this:

- `package.json`
- `README.md`
- `CURRENT_STATE.md`
- `ROADMAP.md`
- `VISION.md`
- `lumaclaw.mjs`
- `src/soulbond/**`
- minimum UI files for the current SoulBond slice
- `docs/acceptance-log.md`
- `docs/collaboration-workflow.md`
- `docs/state-arbitration-structure.md`
- `docs/light-spec-template.md`
- a **minimal** `.github/workflows/` set rebuilt for the reset scope

The reset should earn back complexity, not inherit it automatically.

---

## E. Next-step execution order

### Step 1 — Freeze the old repo
- keep the current repo as archive/reference
- do not keep active development pressure on it once reset starts

### Step 2 — Create a clean reset workspace
- start from a clean base rather than pruning the old repo in place
- establish the new repo's intended scope before copying files

### Step 3 — Carry only whitelist items from section A
- copy identity layer
- copy SoulBond core
- copy the minimum UI slice
- copy minimum governance docs

### Step 4 — Rebuild minimum CI/docs/package identity
- do not import the old workflow tree wholesale
- add only the minimum validation path needed for the reset repo

### Step 5 — Reintroduce additional surfaces deliberately
- only after the new mainline is coherent
- one subsystem at a time
- with explicit acceptance criteria

---

## One-line rule

> Carry project truth and core differentiation first. Everything else must earn its way back into the new repo.
