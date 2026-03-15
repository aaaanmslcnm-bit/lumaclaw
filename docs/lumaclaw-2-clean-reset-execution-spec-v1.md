# LumaClaw 2.0 Clean Reset — Execution Spec v1

_Last updated: 2026-03-15_

## 1. Goal

Build a **clean-reset minimal mainline** for LumaClaw in roughly **3 days**, with these constraints:

- this is a clean rebuild of the mainline shape, not an in-place mass cleanup of the old repo
- this is not a day-one full replacement of all existing public-repo history and compatibility layers
- the purpose is to preserve LumaClaw's real differentiation while dropping migration-era residue and excess inherited surface area

Primary goals:
1. preserve current LumaClaw identity
2. preserve SoulBond as the core differentiation layer
3. preserve minimum project-truth / governance structure
4. rebuild a smaller repo that is explainable, buildable, and reviewable

### Non-goals

This reset does **not** try to do all of the following in phase one:
- preserve `soulclaw` / `openclaw` runtime compatibility
- preserve the full old workflow tree
- preserve apps/extensions/skills breadth
- preserve every inherited OpenClaw integration path
- replace the current public repo mainline immediately without reset acceptance

---

## 2. Must-carry files

### A. Project identity layer
- `package.json`
  - selective carry only
  - keep `lumaclaw` identity metadata
  - keep only minimal scripts/bin/deps required by the reset repo
- `tsconfig.json`
- `README.md`
- `CURRENT_STATE.md`
- `ROADMAP.md`
- `VISION.md`
- `lumaclaw.mjs`

### B. SoulBond core layer
- `src/soulbond/**`
- `scripts/soulbond-*.ts`

### C. Minimum product-facing slice
- `ui/src/ui/components/soulbond-status-card.ts`
- `ui/src/ui/views/overview.ts`
- `ui/src/ui/views/overview.soulbond.test.ts`

### D. Minimum governance / project-truth layer
- `docs/acceptance-log.md`
- `docs/collaboration-workflow.md`
- `docs/state-arbitration-structure.md`
- `docs/light-spec-template.md`
- `docs/first-functional-ui-slice.md`
- `docs/soulbond-overview-card-implementation-pass.md`
- `docs/soulbond-explanation-panel-followup.md`

---

## 3. Must-not-carry files in phase one

### A. Compatibility entrypoints
- `openclaw.mjs`
- `soulclaw.mjs`
- old `soulclaw` / `openclaw` bins by default
- old dual-name launcher compatibility by default

### B. Large inherited surface area
- `apps/**`
- `extensions/**`
- `skills/**`
- most old `src/**` outside the reset scope
- side-track directories like `Swabble/` and `.pi/`

### C. Old workflow / infra residue
- wholesale copy of the old `.github/workflows/**`
- old Blacksmith-specific workflow assumptions
- old complex Docker / Podman / release compatibility paths by default

### D. Non-source / generated residue
- `node_modules/`
- `dist/`
- `.artifacts/`
- transient debug / CI outputs

### E. Migration-noise documentation
- documents whose primary purpose is apologizing for the old repo's mess instead of defining the new mainline

---

## 4. 3-day plan

### Day 1 — Freeze old repo + create clean reset skeleton

Goal:
- separate archive world from new-mainline world

Required work:
1. freeze/archive the old repo
2. create the new clean-reset workspace
3. establish minimal identity files
4. create a dependency whitelist for the new repo
5. define the reset scope before carrying code

Done means:
- old repo is archived, not treated as the active battlefield
- new repo exists with a clear `LumaClaw` identity
- dependency direction is narrowed and explicit

### Day 2 — Carry SoulBond core + minimum UI / entry path

Goal:
- make the new repo feel like a real LumaClaw, not an empty scaffold

Required work:
1. carry `src/soulbond/**`
2. carry `scripts/soulbond-*.ts`
3. carry the minimum UI slice
4. establish at least one minimal runnable SoulBond-facing path
5. fix imports/types/scripts to fit the smaller repo shape

Done means:
- SoulBond stands on its own in the reset repo
- the minimum UI slice survives or is explicitly replaced
- the new repo no longer depends on the old giant compatibility surface to function

### Day 3 — Build minimum CI + close docs + accept/reject reset result

Goal:
- turn the reset repo into something verifiable and reviewable

Required work:
1. create minimum CI
2. close README/CURRENT_STATE/ROADMAP alignment
3. write reset acceptance judgment
4. decide whether the reset repo is ready for public-repo handoff planning

Done means:
- at least one minimal CI path works
- docs and code do not contradict each other
- a formal acceptance judgment exists

---

## 5. Acceptance criteria

The reset prototype passes only if all of the following are true:

### A. Identity is clean
- default project identity is `LumaClaw`
- default entrypoint is `lumaclaw`
- the reset repo does not rely on `soulclaw` / `openclaw` compatibility to define itself

### B. Core differentiation is real
- `src/soulbond/**` is carried successfully
- at least one SoulBond-facing flow is runnable
- at least one minimum product-facing slice remains visible or explicitly replaced

### C. Engineering baseline is trustworthy
- minimum install works
- minimum typecheck/test path works
- CI has at least one reliable validation path
- the repo no longer depends on inherited workflow sprawl for basic credibility

### D. Docs are coherent
These files must agree with each other:
- `README.md`
- `CURRENT_STATE.md`
- `ROADMAP.md`

### E. Acceptance is written down
- result must be recorded in `docs/acceptance-log.md`
- evidence, status, and next-step recommendation must be explicit

---

## 6. Scope-control red lines

### Red line 1
Do **not** turn clean reset into a wholesale copy of the old repo.

### Red line 2
Do **not** keep dependencies because they “might be useful later.”
Only keep what the reset mainline needs.

### Red line 3
Do **not** bring `apps/**`, `extensions/**`, or `skills/**` into phase one unless a reset-blocking dependency proves it is necessary.

### Red line 4
Do **not** restore `soulclaw` / `openclaw` compatibility in phase one by default.

### Red line 5
Do **not** delete the project-truth / governance skeleton just to make the repo look smaller.

### Red line 6
Do **not** treat the reset repo as ready to replace the current public mainline before reset acceptance is complete.

---

## One-line rule

> Build the smallest clean LumaClaw mainline that can stand on its own. Let everything else earn its way back later.
