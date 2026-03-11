# LumaClaw Current State

_Last updated: 2026-03-10_

This file is the reality layer for the project.

It is not the long-term vision, and it is not marketing copy.
It exists to answer a simpler question:

> **What is actually real in SoulClaw right now, what is still incomplete, and what should be done next?**

---

## Short version

SoulClaw is currently best described as:

> **a real OpenClaw fork with a working SoulBond MVP, strong engineering foundations, and a product layer that has not fully caught up to the architecture yet.**

In plainer language:

- this is no longer a fake rename or empty concept repo
- the differentiator is real enough to demo
- the integration layer is still behind the core logic
- the project is in a fork transition, not at finished product form

---

## Default development workflow

SoulClaw currently uses this working model by default:

1. **Yukino leads** — define scope, priorities, architecture, and acceptance criteria
2. **Codex implements** — handle bounded coding/execution work inside the defined task
3. **Yukino reviews** — inspect diffs, rerun key tests, judge quality/risk, and decide whether the result is acceptable
4. **Only then deliver to Jie** — raw external-agent output is not treated as the final project judgment

This is intentional.
SoulClaw should not drift into a mode where the coding worker silently becomes the project lead.

For medium-sized delegated work, SoulClaw also uses a lightweight task spec instead of ad-hoc prompts:
- template: [`docs/light-spec-template.md`](docs/light-spec-template.md)
- purpose: freeze goal, scope, non-goals, acceptance, and review focus before Codex starts implementation

Near-term execution planning lives here:
- [`docs/next-7-days-plan.md`](docs/next-7-days-plan.md)

## Default acceptance report format

When Codex finishes a bounded implementation task, the **automatic callback is not the final project delivery**.
The automatic callback only means:

- Codex has stopped running
- Yukino has received the result
- a formal review still needs to happen

The final project-facing delivery should come from Yukino and follow this structure by default:

1. **Task title**
   - what the task was
   - where it sits in the roadmap / current phase
2. **Files changed**
   - which files changed
   - what each file changed for
3. **Implementation strategy / design judgment**
   - how the task was solved
   - what boundaries were intentionally kept
4. **Tests and review**
   - what Codex reported
   - what Yukino personally re-ran or verified
5. **Remaining risks**
   - what is still incomplete, fragile, or intentionally deferred
6. **Acceptance conclusion**
   - accepted / not accepted / accepted as phase-one only
7. **Score**
   - Yukino's quality judgment, not Codex self-rating
8. **Next-step recommendation**
   - what should be done next and why

This format exists to preserve the actual project roles:

- Codex may implement
- Yukino decides whether the implementation is good enough to become project truth
- Jie should see Yukino's reviewed judgment, not just a worker's raw completion ping

---

## What is already real

These things already exist in a meaningful way:

### SoulBond core loop
- transcript-based interaction analysis
- explainable audit / evidence output
- daily score calculation
- state persistence
- status formatting / inspection
- daily run command
- cron integration path
- demo flow that chains the loop end-to-end

### Engineering base
- a serious inherited OpenClaw runtime/tooling foundation
- strict TypeScript configuration
- tests around the SoulBond module
- working CLI/runtime entry paths
- evidence that this is an actual maintained engineering fork, not a thin wrapper

### Project direction
- a clear companion-oriented thesis
- explicit rejection of manipulative pseudo-intimacy
- a meaningful attempt to combine real agent capability with continuity and relationship growth

---

## What is not fully integrated yet

These directions are visible, but not yet fully real in the user-facing product:

### Behavior mapping
SoulBond exists structurally, but it does not yet consistently change the assistant in ways users can feel across the product.

Examples of what is still incomplete:
- tone mapping that is consistently applied
- stage-aware behavior changes that are visible in normal use
- runtime behavior that fully consumes SoulBond settings

### Presentation layer
These are still future-facing rather than current headline features:
- voice integration driven by SoulBond state
- avatar / expression / visual presentation changes
- desktop presence shell
- product-level UI exposure of SoulBond as a first-class feature

## UI / illustration timing

SoulClaw should not jump straight into full visual presentation while the behavior layer is still mostly invisible.

### Functional UI can start when
These conditions are met:
- the SoulBond loop is stable enough to demo
- at least one visible behavior-mapping result exists (for example tone)
- the product can show a coherent transcript -> score -> state -> behavior story

At that point, UI work should focus on:
- SoulBond state cards
- tone/stage visualization
- explanation panels
- demo-oriented product surfaces

### Illustration / expressive presentation should start when
These conditions are met:
- behavior mapping is no longer internal-only
- at least one or two runtime behavior changes are genuinely visible to users
- the core demo no longer needs heavy narration to explain itself

Only then should SoulClaw seriously invest in:
- standing illustration / avatar work
- expression mapping
- stronger visual identity
- desktop-presence presentation layers

### Practical rule
- **First:** make behavior visible
- **Then:** make it legible through functional UI
- **Only after that:** amplify it with illustration, voice, and presence

### Fork transition cleanup
The project identity is SoulClaw, but the public/runtime surface still carries inherited OpenClaw pieces in several places.
That is survivable for now, but it still weakens clarity.

---

## Current strongest parts

If someone asked what SoulClaw is doing well right now, the honest answer would be:

### 1. It has a real differentiator
SoulBond is not imaginary anymore. There is a real:

`transcript -> score -> state -> cron/demo`

loop in the codebase.

### 2. The project direction is unusually disciplined
SoulClaw is not trying to become:
- a hollow mascot
- a cheap romance-script gimmick
- a shell with no practical capability

That restraint is part of the project's strength.

### 3. The engineering base is serious
The project is inheriting from a large real runtime, not pretending to start from zero. That gives SoulClaw real leverage if the companion layer is integrated carefully.

---

## Current weaknesses / risks

These are the most important current weaknesses, not random nitpicks.

### 1. SoulBond state evolution is under-protected
The state model already has versioning shape, but persistence/migration hardening is still not where it should be.

Why this matters:
- SoulBond is supposed to survive over time
- long-term state without migration discipline is a trap
- this is one of the first technical debts likely to bite hard

### 2. Interface shape is ahead of behavior reality
Some settings look like product capabilities already exist, but they are not yet fully consumed by the runtime.

This is not automatically bad.
It becomes bad only if the docs or product story overclaim what is already active.

### 3. Product surface still undersells the core
The repo has real work in it, but the visible product layer does not yet express that work strongly enough.

This is why the project can feel:
- stronger in architecture than in experience
- stronger in internal logic than in visible differentiation

### 4. Fork transition is still visibly incomplete
The current mixed SoulClaw / OpenClaw surface is understandable during transition, but it should not remain vague forever.

### 5. Presentation credibility still matters
Even small issues like README glitches or public-facing wording drift can damage confidence more than they "deserve" to.
That is annoying, but true.

---

## What this project is *not* right now

To avoid self-deception, SoulClaw is **not** currently:

- a finished desktop companion product
- a fully integrated relationship-aware assistant
- a mature voice/avatar/presence system
- a cleanly separated successor runtime with no OpenClaw inheritance visible

That does not mean the project is weak.
It means the current stage should be described honestly.

---

## What the next three priorities should be

### Priority 1 — Add SoulBond state validation + migration
This protects the part of the project that is already real.

### Priority 2 — Make SoulBond settings affect real runtime behavior
This is the shortest path from "interesting internal subsystem" to "actual differentiated user experience."

### Priority 3 — Finish current transition cleanup at the public/runtime surface
This improves credibility, legibility, and contribution clarity without requiring a giant rewrite.

---

## Practical current-stage summary

If someone asked, "What stage is SoulClaw in?", the best answer is:

> SoulClaw is past concept stage and already has a real SoulBond MVP, but it is still in the stage where behavior integration and product surfacing matter more than adding more theoretical future features.

Or even shorter:

> **Strong core, incomplete integration.**
