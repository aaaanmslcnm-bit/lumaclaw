# Clean Reset Phase Summary

_Last updated: 2026-03-15_

This file summarizes the clean-reset phases that have already happened and the next bounded phase candidates.

---

## Phase 0 — Old repo stabilization

### Goal
Reduce ambiguity in the old heavy repo long enough to extract project truth and choose a reset path.

### Outcome
- CI/workflow contradictions were exposed and partially stabilized.
- Project-truth docs were created/refined.
- The old repo stopped being treated as a reliable long-term mainline candidate.

### Status
`completed`

---

## Phase 1 — Clean reset decision and freeze

### Goal
Choose a reset strategy and separate archive world from new-mainline world.

### Outcome
- clean-reset planning pack was written
- dependency whitelist was defined
- old repo was frozen as archive/reference
- new mainline workspace was separated out

### Status
`completed`

---

## Phase 2 — SoulBond-first carry

### Goal
Carry the real differentiator first without dragging the broader old repo back in.

### Outcome
- `src/soulbond/**` carried
- `scripts/soulbond-*.ts` carried
- `src/auto-reply/reply/strip-inbound-meta.ts` carried
- `src/soulbond/cron-types.ts` added as reset-local cron decoupling
- worker run needed manual recovery at the reporting layer, but the carry itself landed

### Status
`completed`

See also:
- [`carry-v2a-soulbond-core-first.md`](carry-v2a-soulbond-core-first.md)

---

## Phase 3 — Technical minimum mainline bootstrap

### Goal
Turn the reset repo into a minimally verifiable technical mainline.

### Outcome
- top-level technical shape promoted
- minimal install/typecheck/test path succeeded
- minimal `lumaclaw` CLI entrypoint established

### Status
`completed`

See also:
- [`verifiable-mainline-bootstrap-v1.md`](verifiable-mainline-bootstrap-v1.md)

---

## Phase 4 — Top-level identity / project-truth promotion

### Goal
Make the repo describe itself truthfully as LumaClaw rather than inherited OpenClaw mainline.

### Outcome
- `README.md` promoted
- `CURRENT_STATE.md` promoted
- `ROADMAP.md` promoted
- `VISION.md` promoted
- acceptance state recorded

### Status
`completed`

See also:
- [`../acceptance-log.md`](../acceptance-log.md)

---

## Phase 5 — Candidate mainline validation on GitHub

### Goal
Move the clean reset from local-only truth into a real GitHub candidate branch / PR.

### Outcome so far
- remote snapshot branch created
- bridge branch created for PR compatibility
- PR #13 opened
- old PR #12 closed
- checks are still the current external validation gate

### Status
`active`

---

## Next bounded phase candidates

### Candidate A — Watch and respond to PR #13 checks
Use when:
- first external validation results are landing
- the next decision is whether to fix this candidate PR or change strategy

### Candidate B — Bounded UI carry
Use when:
- the current mainline has enough stability to bring over the minimum UI slice without polluting the reset

### Candidate C — Structure cleanup around drafts/bootstrap files
Use when:
- PR checks are still pending or blocked
- low-risk structure work can continue without destabilizing the candidate mainline

---

## Current phase judgment

> The clean reset has already crossed from planning into a real mainline. The repo is now in candidate-mainline validation, not identity ambiguity.

---

## One-line rule

> Treat the remaining work as controlled expansion and validation, not as proof that the reset exists.
