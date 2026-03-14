# LumaClaw — SoulBond Overview Card Implementation Pass

_Last updated: 2026-03-13_

This is the next bounded implementation task after state reconciliation and UI-slice arbitration.

It assumes:
- the first real `affectTone` reply-boundary path is already treated as landed unless a real defect is found
- the first functional UI slice has already been decided
- the correct first slice is the existing SoulBond overview/status-card path

---

## Task title

**Promote the existing SoulBond overview card into the first accepted functional UI slice**

---

## Goal

Turn the current SoulBond status card in the Control UI overview from a promising in-repo surface into the first explicitly accepted product-facing UI slice.

The purpose is:
- make SoulBond legible at a glance
- keep the UI grounded in real runtime state
- improve demo readability without drifting into avatar/voice/presentation theater

---

## Primary repo evidence

Current slice candidate already exists here:
- `ui/src/ui/components/soulbond-status-card.ts`
- `ui/src/ui/views/overview.ts`
- `ui/src/ui/views/overview.soulbond.test.ts`

Supporting runtime evidence:
- `src/soulbond/tone.ts`
- `src/soulbond/store.ts`
- `src/auto-reply/reply/get-reply-run.ts`

Decision anchor:
- `docs/first-functional-ui-slice.md`
- `docs/state-arbitration-structure.md`

---

## In scope

### 1. Treat the overview SoulBond card as the first official product-facing slice
Keep the current slice in the overview and make it feel intentionally product-facing, not like a leftover preview widget.

### 2. Tighten runtime-vs-preview behavior
Ensure the card clearly distinguishes:
- real runtime SoulBond state when available
- preview/demo fallback state when runtime state is not available yet

### 3. Improve explanatory value
The card should clearly expose, in one place:
- current bond
- current stage
- current tone
- tone mode (`mapped` vs `fixed`)
- latest daily result
- short guidance text
- source state (`runtime` vs `preview`)

### 4. Preserve repo-local test coverage
Keep or improve focused tests around the overview SoulBond path.

---

## Out of scope

- avatar / expression systems
- voice integration
- transcript timeline browser
- full SoulBond dashboard
- broad Control UI redesign
- fork-wide naming cleanup
- reopening the old reply-boundary implementation task unless a real defect is found

---

## Constraints

- keep scope narrow
- prefer the existing UI path over inventing a new surface
- no decorative drift
- no mocked product fantasy disconnected from current runtime data
- if runtime data is still limited, make fallback state honest rather than pretending it is live

---

## Suggested allowed files

If delegated, prefer keeping edits inside:
- `ui/src/ui/components/soulbond-status-card.ts`
- `ui/src/ui/views/overview.ts`
- `ui/src/ui/views/overview.soulbond.test.ts`
- nearby UI styles only if truly necessary
- possibly one tiny adjacent controller/helper if required for clearer runtime state flow

Do not broaden file scope without a concrete reason.

---

## Acceptance criteria

The pass is acceptable when:

1. The SoulBond overview card reads like an intentional first product slice
   - not a loose preview artifact
   - not a decorative panel with unclear value

2. Runtime vs preview state is explicit and understandable
   - a reviewer can tell whether the card is showing live state or fallback state

3. The card makes SoulBond easier to demo
   - a new viewer can understand the relationship state at a glance
   - heavy narration is reduced

4. The implementation stays bounded
   - no broad UI sprawl
   - no accidental architecture detour

5. Focused validation exists
   - existing tests are preserved or improved
   - any new logic has narrow evidence

---

## Required review format

When this pass is implemented, review it with:
- task title
- files changed
- implementation strategy
- tests / re-review
- remaining risks
- acceptance conclusion
- score
- next-step suggestion

---

## Likely next step after acceptance

If this pass lands cleanly, the next follow-up should probably be one of:
- a small explanation-panel follow-up
- demo-flow polish that references the card directly
- careful runtime data exposure improvements for richer SoulBond state visibility

Not avatar work.
Not voice work.
Not broad redesign.
