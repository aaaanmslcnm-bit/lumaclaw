# LumaClaw Project Map

_Last updated: 2026-03-15_

This file is the shortest reliable map of the clean-reset LumaClaw repo.

If the repo starts to feel visually large again, return to this file first.

---

## 1. What this repo is

LumaClaw is currently a **SoulBond-first clean reset mainline**.

This repo is not trying to carry the full historical OpenClaw/SoulClaw surface at once.
It is trying to preserve the real differentiator first, keep the technical mainline verifiable, and only then grow back selected product surface.

---

## 2. Core repo layers

## A. Active mainline identity layer
These files define what the repo says it is right now:

- `README.md`
- `CURRENT_STATE.md`
- `ROADMAP.md`
- `VISION.md`
- `package.json`
- `lumaclaw.mjs`

## B. Current carried differentiation layer
These files define what is already truly LumaClaw-specific in the reset mainline:

- `src/soulbond/**`
- `scripts/soulbond-*.ts`
- `src/auto-reply/reply/strip-inbound-meta.ts`
- `src/soulbond/cron-types.ts`

## C. Reset bootstrap record layer
These files explain how the new mainline was built and accepted:

- `docs/reset-bootstrap/`
- `docs/acceptance-log.md`

## D. Deferred layer
These surfaces are intentionally not in the current active mainline yet:

- broad UI carry
- apps / extensions / skills breadth
- old compatibility entrypoints
- broad inherited workflow/release surface

---

## 3. Current repo truth in one paragraph

The old heavy repo has been frozen separately as archive/reference.
This repo is the new active mainline.
SoulBond core is already carried.
The new mainline already has a minimal install/typecheck/test/CLI path.
The mainline identity/docs layer has also been promoted.
What remains is controlled expansion, not proof-of-existence.

---

## 4. What is already landed

### Landed
- SoulBond-first carry
- reset-local cron type decoupling
- minimal technical mainline bootstrap
- top-level identity and project-truth promotion
- acceptance logging for the clean-reset state

### Deferred
- UI carry
- broader docs breadth
- apps / extensions / skills reintroduction
- compatibility entrypoint restoration

---

## 5. Where to look next

### If you want repo truth
- `CURRENT_STATE.md`
- `docs/acceptance-log.md`

### If you want phase history
- `docs/reset-bootstrap/phase-summary.md`

### If you want reset implementation notes
- `docs/reset-bootstrap/index.md`

### If you want the shortest orientation file
- `docs/project-map.md`

---

## 6. One-line rule

> This repo should grow by deliberate promotion, not by panic inheritance.
