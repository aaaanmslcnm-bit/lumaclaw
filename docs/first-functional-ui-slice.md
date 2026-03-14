# LumaClaw — First Functional UI Slice Decision

_Last updated: 2026-03-13_

This file defines the first real product-facing UI slice for the current LumaClaw stage.

It is intentionally narrow.
The goal is not to invent a full product shell.
The goal is to make the current SoulBond reality legible.

---

## Decision

The first functional UI slice should be:

> **the SoulBond status card in the Control UI overview**

More specifically:
- current bond
- current stage
- current tone
- tone mode (`mapped` vs `fixed`)
- latest daily result
- short guidance text
- runtime vs preview source state

This is the correct first slice because it already exists in repo-local form and matches the current project stage better than decorative or speculative alternatives.

Primary repo evidence:
- `ui/src/ui/components/soulbond-status-card.ts`
- `ui/src/ui/views/overview.ts`
- `ui/src/ui/views/overview.soulbond.test.ts`

---

## Why this slice wins

### 1. It matches the current project problem

LumaClaw's biggest current weakness is not missing internal logic.
It is that the product surface still undersells the core.

A SoulBond status card directly addresses that problem by making the current relationship state visible without pretending the whole companion layer is already productized.

### 2. It uses real data, not product fantasy

The overview path already knows how to:
- resolve runtime SoulBond state from gateway snapshot data
- fall back to a preview state when runtime data is unavailable
- derive tone and latest daily-result labels from real SoulBond structures

That makes it a grounded slice, not a mockup-first detour.

### 3. It is already partially built

This is important.
The first slice does **not** need to be invented from scratch.

The repo already contains:
- a dedicated `soulbond-status-card` component
- overview wiring
- tests for both preview and runtime rendering

So the right move is to formalize and promote this slice, not abandon it for a brand-new UI idea.

### 4. It fits the current sequencing rule

Current sequencing should remain:
1. make behavior real
2. make behavior legible
3. only then expand presentation

The SoulBond overview card is legibility work.
That is exactly the right layer for now.

---

## Why the other candidates lose *for now*

### Stage/tone panel alone
Too narrow by itself.
It shows classification, but not enough of the state story.
Without bond / latest daily result / guidance, it risks feeling cosmetic.

### Recent change explanation panel
Good follow-up slice, not the first slice.
It depends on users already understanding the base SoulBond state surface.

### Demo comparison surface
Useful later, but heavier.
It is better as a second-step demo/explainer layer after the basic status card is treated as real product UI.

### Avatar / illustration work
Wrong layer.
Current stage still needs functional legibility more than expressive presentation.

---

## Scope for the first implementation pass

### In scope
- keep the SoulBond card in the overview as the first official product-facing SoulBond surface
- ensure the card reflects real runtime state when available
- preserve preview fallback when runtime state is not yet exposed
- keep the card explanatory, not decorative
- make the source state clear (`runtime` vs `preview`)
- keep labels understandable for demo use

### Out of scope
- avatar / expression systems
- voice integration
- full transcript comparison UI
- rich timeline / history browser
- broad control-ui redesign
- speculative relationship theater

---

## Success criteria

This slice is successful when:
- a new viewer can immediately see that SoulBond is a real system state, not a hidden internal number
- the UI shows bond + stage + tone + latest daily result in one place
- the runtime vs preview distinction is explicit
- the surface helps demo the project without heavy narration
- the implementation stays grounded in current repo-local data paths

---

## Practical next move

The next implementation task should **not** ask "what should the first UI slice be?"
That decision is now made.

The next task should ask:

> **How do we promote the existing SoulBond overview/status-card path into the first accepted functional UI slice with the smallest clean implementation pass?**

That is the right bounded follow-up.
