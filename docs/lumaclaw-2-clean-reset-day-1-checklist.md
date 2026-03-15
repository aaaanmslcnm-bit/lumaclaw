# LumaClaw 2.0 Clean Reset — Day 1 Checklist

_Last updated: 2026-03-15_

This checklist is for **Day 1 only**.
Its purpose is not to finish the reset in one burst.
Its purpose is to separate the old repo from the new reset mainline and create a stable skeleton for later carry-over.

---

## Day 1 goal

Create a clean-reset starting point while preserving the old repo as archive/reference.

Success condition for Day 1:
- the old repo is frozen/archived, not deleted
- the new reset workspace exists
- the new repo identity is established as `LumaClaw`
- the dependency direction is narrowed through a whitelist
- no broad carry-over has happened by accident

---

## Checklist

### 1. Freeze the old repo

- [ ] confirm the current old-repo location
- [ ] confirm the current active branch and unpushed work
- [ ] record the final old-repo state (HEAD, key commits, current PR head)
- [ ] create an archive tag or archive branch reference
- [ ] rename or mark the old repo locally as archive/reference only
- [ ] explicitly stop treating the old repo as the active development mainline

**Acceptance note:**
Day 1 fails if the old repo is destructively modified instead of being archived.

---

### 2. Create the clean reset workspace

- [ ] choose the new reset directory path
- [ ] create the new repo/workspace from a clean base
- [ ] verify that the new workspace is not contaminated by old generated directories
- [ ] confirm that the new workspace starts with only the intended baseline

**Acceptance note:**
Day 1 fails if the new reset workspace is created by copying the full old repo wholesale.

---

### 3. Establish the identity skeleton

Create or carry minimal versions of:

- [ ] `package.json`
- [ ] `README.md`
- [ ] `CURRENT_STATE.md`
- [ ] `ROADMAP.md`
- [ ] `VISION.md`
- [ ] `lumaclaw.mjs`
- [ ] `tsconfig.json`

Rules:
- identity must default to **LumaClaw**
- do not add `soulclaw` / `openclaw` compatibility back yet
- do not overfill these files with old migration noise

---

### 4. Build the dependency whitelist

- [ ] inspect SoulBond runtime needs
- [ ] inspect minimal UI slice needs
- [ ] inspect minimal CLI / script needs
- [ ] list the exact dependencies required for phase one
- [ ] list the dependencies explicitly rejected for phase one
- [ ] keep the output in a reviewable whitelist note

Suggested output file:
- `docs/reset-dependency-whitelist.md`

**Acceptance note:**
Day 1 fails if dependencies are carried over by habit rather than by explicit reset-scope need.

---

### 5. Define the carry plan before moving code

- [ ] confirm the carry set from `docs/clean-reset-migration-whitelist.md`
- [ ] mark the Day 2 carry targets explicitly:
  - `src/soulbond/**`
  - `scripts/soulbond-*.ts`
  - minimum UI slice
  - minimum governance docs
- [ ] confirm the phase-one exclusions explicitly

**Acceptance note:**
No code carry should begin before this list is frozen for review.

---

### 6. Create the Day 1 review note

Write a short review note that records:
- [ ] old repo archived state
- [ ] new reset workspace path
- [ ] identity skeleton status
- [ ] dependency-whitelist status
- [ ] Day 2 carry readiness

Suggested output file:
- `docs/day-1-reset-review.md`

---

## Explicit Day 1 non-goals

Do **not** do these on Day 1:
- [ ] broad source-tree carry-over
- [ ] full workflow recreation
- [ ] Docker/release path rebuild
- [ ] compatibility-layer restoration
- [ ] apps/extensions/skills migration
- [ ] public-repo handoff

---

## Day 1 pass/fail rule

### Pass
Day 1 passes if:
- the old repo is safely frozen
- the new reset workspace exists
- the LumaClaw identity skeleton exists
- dependency direction is narrowed explicitly
- the Day 2 carry set is pre-scoped

### Fail
Day 1 fails if:
- the old repo is destructively altered
- the new workspace is just the old repo copied over
- identity remains ambiguous
- dependencies are inherited blindly
- the team starts carrying code before scope is frozen

---

## One-line rule

> Day 1 is for separating worlds and fixing scope. It is not for panicked mass migration.
