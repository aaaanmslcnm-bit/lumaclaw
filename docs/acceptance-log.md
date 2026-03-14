# LumaClaw Acceptance Log

_Last updated: 2026-03-13_

This file is the acceptance ledger for bounded project truth.

Its job is not to replace `CURRENT_STATE.md`.
Its job is to answer a narrower question:

> **What has been judged, what is its current status, and what evidence supports that judgment?**

Use status labels only from the current arbitration structure:
- `landed`
- `landed-with-small-fix`
- `partial`
- `planned`
- `stale`
- `superseded`

## Workflow rule

Whenever a bounded review, state-reconciliation pass, or project-truth arbitration produces a real judgment, write it here.

If the judgment changes current project reality or next-step ordering, also sync:
- `CURRENT_STATE.md`
- `docs/resume-checklist.md`
- `docs/next-7-days-plan.md` (when still useful)

This file is therefore the **ledger of project truth decisions**, not just a historical note dump.

## New entry template

Use this shape for future entries:

```md
## [ACC-YYYYMMDD-XXX] Short task / decision name

- **Status:** `landed|landed-with-small-fix|partial|planned|stale|superseded`
- **Area:** short subsystem / workflow area
- **Why this status:** one tight explanation of the judgment
- **Evidence:**
  - `path/to/file-a`
  - `path/to/file-b`
- **Notes:** optional boundary, risk, or next-step note
```

### Entry-writing rules
- Keep the title short and specific.
- `Why this status` should explain the judgment, not retell the whole story.
- `Evidence` should point to the smallest useful repo-local proof set.
- `Notes` should capture boundary/risk/follow-up context only when it helps.
- If an older entry is no longer true, do **not** quietly ignore it — add a new entry with `superseded` or `stale`, or update the old one explicitly.

## Example entry

```md
## [ACC-20260313-008] Example bounded UI pass

- **Status:** `landed-with-small-fix`
- **Area:** Control UI / SoulBond
- **Why this status:** the main implementation landed, but one small follow-up is still needed to make the runtime/preview distinction clearer.
- **Evidence:**
  - `ui/src/ui/views/overview.ts`
  - `ui/src/ui/views/overview.soulbond.test.ts`
  - `docs/first-functional-ui-slice.md`
- **Notes:** acceptable as the current slice foundation; do the small clarity fix before broadening UI scope.
```

## Status update rules

Use these rules so the ledger stays trustworthy:

### Add a new entry when
- a bounded review reaches a real new judgment
- a state-reconciliation pass settles a disputed status
- a task changes from `planned` → `landed` / `partial` / `landed-with-small-fix`
- a previously trusted checkpoint is now clearly `stale` or `superseded`

### Update an existing entry when
- the same task/decision is still the same object, but its evidence or notes need tightening
- the judgment stays the same and only the proof set or boundary note gets better
- a follow-up implementation clarifies the old entry rather than replacing it

### Mark `superseded` when
- an older judgment has been replaced by a newer, more correct one
- a previous decision is no longer the project truth and should not keep steering work

### Mark `stale` when
- a plan/checkpoint/doc was once useful but now lags behind code reality
- the file still exists for reference, but should no longer be treated as current truth

### Do not use the ledger for
- vague brainstorming
- raw worker transcripts
- long narrative postmortems
- duplicate entries that add no new judgment

When in doubt:
- record the smallest real judgment
- point to the tightest evidence
- sync the state docs if the judgment changes project truth

---

## [ACC-20260313-001] `STATE_EVOLUTION.md` draft

- **Status:** `landed`
- **Area:** SoulBond state evolution docs
- **Why this status:** accepted in the current project record; no active contradiction was found in the current reconciliation round.
- **Evidence:**
  - `docs/resume-checklist.md`
  - `src/soulbond/STATE_EVOLUTION.md`
- **Notes:** treat as accepted background state, not the current next move.

---

## [ACC-20260313-002] `affectTone` MVP (`soulbond-tone-mapping-mvp-retry`)

- **Status:** `landed`
- **Area:** behavior mapping foundation
- **Why this status:** the core tone-mapping behavior exists in SoulBond runtime logic and related tests; it should no longer be treated as a purely planned feature.
- **Evidence:**
  - `src/soulbond/tone.ts`
  - `src/soulbond/tone.test.ts`
  - `docs/resume-checklist.md`
  - `CURRENT_STATE.md`
- **Notes:** this is the behavior-mapping foundation, not the full product-wide completion of behavior mapping.

---

## [ACC-20260313-003] `soulbond-demo-flow-polish`

- **Status:** `landed`
- **Area:** demo flow / product legibility
- **Why this status:** current repo state and planning reconciliation both treat demo flow work as already accepted groundwork.
- **Evidence:**
  - `docs/resume-checklist.md`
  - `scripts/soulbond-demo.ts`
  - `CURRENT_STATE.md`
- **Notes:** demo polish exists, but further demo readability improvements can still happen later.

---

## [ACC-20260313-004] First real `affectTone` reply-boundary path

- **Status:** `landed`
- **Area:** runtime behavior mapping
- **Why this status:** repo-local code and nearby tests show that the preferred reply boundary already loads SoulBond runtime state and injects a real tone hint into the reply path.
- **Evidence:**
  - `src/auto-reply/reply/get-reply-run.ts`
  - `src/auto-reply/reply/get-reply-run.media-only.test.ts`
  - `src/auto-reply/reply/agent-runner-execution.ts`
  - `src/auto-reply/reply/followup-runner.ts`
  - `CURRENT_STATE.md`
- **Notes:** unless a real defect is found, do not reopen this as a default “implement from scratch” task.

---

## [ACC-20260313-005] State arbitration structure

- **Status:** `landed`
- **Area:** project governance / state management
- **Why this status:** a formal authority order, required status labels, repo-local evidence set, and arbitration output format now exist.
- **Evidence:**
  - `docs/state-arbitration-structure.md`
- **Notes:** this structure is now part of how LumaClaw should settle code-vs-doc drift.

---

## [ACC-20260313-006] First functional UI slice decision

- **Status:** `landed`
- **Area:** product-facing UI direction
- **Why this status:** the first functional UI slice has been explicitly decided and documented as the SoulBond status card in the Control UI overview.
- **Evidence:**
  - `docs/first-functional-ui-slice.md`
  - `ui/src/ui/components/soulbond-status-card.ts`
  - `ui/src/ui/views/overview.ts`
  - `ui/src/ui/views/overview.soulbond.test.ts`
- **Notes:** this decision means the next implementation move should promote the existing overview/status-card path rather than reopening slice selection.

---

## [ACC-20260313-007] SoulBond overview card implementation pass

- **Status:** `landed`
- **Area:** first functional UI slice implementation
- **Why this status:** the bounded UI pass landed narrowly in the existing overview/status-card path, made source-state semantics explicit in-card, and improved the slice's product readability without broadening scope.
- **Evidence:**
  - `docs/soulbond-overview-card-implementation-pass.md`
  - `ui/src/ui/components/soulbond-status-card.ts`
  - `ui/src/ui/views/overview.ts`
  - `ui/src/ui/views/overview.soulbond.test.ts`
- **Notes:** accepted on code review with focused evidence. Environment-level Vitest execution remained blocked by `spawn EPERM`, so the remaining risk is verification depth rather than an identified code defect.

---

## [ACC-20260313-008] SoulBond explanation-panel follow-up

- **Status:** `planned`
- **Area:** first functional UI slice follow-up
- **Why this status:** the next bounded move is to make the SoulBond state easier to interpret by adding a narrow explanation layer adjacent to the existing overview/status-card path.
- **Evidence:**
  - `docs/soulbond-explanation-panel-followup.md`
  - `docs/first-functional-ui-slice.md`
  - `docs/acceptance-log.md`
- **Notes:** do not broaden this into a dashboard or history browser. If Codex remains transport-unstable, keep the task planned and retry only when the route is stable or another controlled path is chosen.

---

## Current read of the ledger

As of 2026-03-13:
- SoulBond core + tone foundation are already real
- the first reply-boundary tone path should be treated as landed
- the first functional UI slice is already decided and now has a landed first implementation pass
- the current next clean move is the planned SoulBond explanation-panel follow-up
