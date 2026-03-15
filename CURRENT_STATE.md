# LumaClaw Current State

_Last updated: 2026-03-15_

This file is the reality layer for the clean-reset mainline.

It answers one question:

> **What is actually real in this repo right now, what is still deferred, and what should happen next?**

---

## Short version

LumaClaw is currently best described as:

> **a SoulBond-first clean reset mainline with a working minimal verification path and a deliberately reduced technical surface.**

In plainer language:

- the old heavy migration-era repo has been frozen as archive/reference
- this repo is now the new active mainline
- SoulBond core is already carried into this repo
- the repo can already install, typecheck, test, and expose a minimal CLI
- broad UI / apps / extensions / skills carry is still deferred

---

## What is already real

### 1. SoulBond core carry
The repo now contains:

- `src/soulbond/**`
- `scripts/soulbond-*.ts`
- `src/auto-reply/reply/strip-inbound-meta.ts`
- `src/soulbond/cron-types.ts`

This means the clean reset has already moved past pure planning.

### 2. Minimal verification path
The repo has successfully completed a minimal technical verification pass:

- install
- typecheck
- tests
- minimal CLI help entrypoint

This is the first point where the reset repo becomes a **verifiable mainline** rather than a document scaffold.

### 3. Singular public identity direction
The reset mainline now treats:

- `LumaClaw` as the default project identity
- `lumaclaw` as the default CLI identity

The old compatibility entrypoints are intentionally not part of this mainline yet.

---

## What is not fully landed yet

### 1. Top-level product/docs polish
The repo has a real technical mainline now, but it is not yet a finished public-facing product surface.

Still missing or deferred:
- broader docs surface migration
- product polish beyond the SoulBond-first reset
- broader public explanation layers

### 2. UI carry
The minimum UI slice has **not** been carried into this mainline yet.

That work remains deferred until after the current technical/document identity layer is stable enough.

### 3. Broad inherited OpenClaw surface
This repo does not yet attempt to restore or preserve:

- apps
- extensions
- skills
- broad channel/runtime surface
- large workflow/release chains

That is intentional, not an omission-by-accident.

---

## Current risks

### 1. Scope re-expansion risk
Now that the repo is technically alive again, the biggest risk is dragging broad inherited surfaces back in too early.

### 2. Identity/document drift risk
Top-level identity and project-truth docs now exist, but future work still needs to keep them aligned with the actual carried code.

### 3. UI timing risk
It will be tempting to carry UI too soon just because the core is now verifiable. That should remain a bounded decision, not automatic momentum.

---

## Current phase

LumaClaw is currently in:

> **Phase: technical-mainline stabilization after SoulBond-first clean reset carry**

That means the repo has already crossed the threshold from planning into implementation, but still needs disciplined next-step ordering.

---

## Immediate next priorities

### Priority 1 — Keep the new mainline coherent
Do not let the repo drift back into inherited sprawl.

### Priority 2 — Grow the top-level identity truthfully
README / state / roadmap / vision must continue to describe the repo as it really exists.

### Priority 3 — Decide whether the next bounded move is UI carry or more technical hardening
This should be a deliberate choice, not a reflex.

---

## Working conclusion

LumaClaw is no longer just a migration idea.

This repo now contains a real SoulBond-first mainline with a passing minimal verification path. The next job is not to prove it exists. The next job is to grow it without losing the cleanliness we just paid to create.
