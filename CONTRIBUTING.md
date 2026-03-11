# Contributing to LumaClaw

Thanks for considering a contribution.

LumaClaw is currently in the **MVP-building stage**. That means the project benefits most from contributions that improve clarity, direction, and the core companion loop — not from random feature sprawl.

Project overview: [`README.md`](README.md)  
Project direction: [`VISION.md`](VISION.md)

---

## What LumaClaw is trying to build

LumaClaw is the public product line for this fork-stage OpenClaw-derived codebase, focused on a companion-oriented desktop AI assistant.

The goal is **not** to build:

- a hollow desktop mascot
- a purely utilitarian but emotionally flat agent
- a manipulative “AI girlfriend” system

The goal **is** to build:

- a real agent with real capabilities
- a transparent relationship-growth layer
- a customizable companion experience
- a desktop AI that can work, remember, and grow with the user over time

---

## Current priorities

Right now, the most useful contributions are:

### 1. SoulBond MVP quality
Examples:
- transcript signal extraction quality
- scoring explainability
- audit / evidence readability
- state handling and cron integration
- demo flow improvements

### 2. Documentation and onboarding
Examples:
- improving README clarity
- documenting demo flows
- making repo structure and module boundaries easier to understand
- clarifying how SoulClaw differs from upstream OpenClaw

### 3. Project boundary cleanup
Examples:
- making SoulClaw-specific modules easier to identify
- reducing confusion between upstream docs and fork-specific docs
- preserving upstream syncability while making the fork legible

### 4. Future-facing presentation layers (carefully)
Examples:
- UI groundwork
- presentation/state mapping
- desktop shell planning
- voice/avatar integration preparation

These are welcome **only if they do not destabilize the MVP core**.

---

## What is not helpful right now

At this stage, the project should avoid contributions that add a lot of surface area without strengthening the core loop.

Examples of low-priority or risky contributions right now:

- giant speculative rewrites
- unrelated feature bundles in one PR
- “romance-first” gimmicks that weaken the product direction
- heavy visual layers before the core system is stable
- black-box magic that reduces explainability
- changes that make upstream sync dramatically harder without strong reason

In short:

> First make the core loop solid. Then make it beautiful.

---

## Before you open a PR

Please do the obvious, since someone has to clean up after bad PRs and I would rather that not become a hobby.

- keep PRs focused
- explain **what changed** and **why**
- avoid mixing unrelated concerns
- test the affected path locally when possible
- include screenshots or terminal output when the change affects visible behavior
- if your change affects SoulBond logic, include before/after examples or sample output

Recommended checks when relevant:

```bash
corepack pnpm build
corepack pnpm check
corepack pnpm test
```

If you only changed a focused subsystem, targeted tests are fine as long as you say what you ran.

---

## AI-assisted contributions

AI-assisted PRs are welcome.

Just be transparent.

Please include:

- whether the PR was AI-assisted
- how much you personally reviewed
- what testing you ran
- anything reviewers should double-check carefully

The rule is not “no AI.”
The rule is “don’t dump unreviewed sludge on the repo.”

---

## Contribution rules

### One PR = one coherent topic
Do not bundle five unrelated ideas into one pull request.

### Prefer inspectable changes
Small, understandable, well-scoped improvements are better than large dramatic rewrites.

### Preserve explainability
Especially for SoulBond-related logic, prefer transparent rules over opaque heuristics whenever possible.

### Keep the fork legible
If you touch code that diverges from upstream OpenClaw, make the purpose of the divergence clear.

### Respect the product direction
SoulClaw is **companion-oriented**, not “cheap emotional manipulation as a feature.”

---

## Good first contribution areas

If you want somewhere useful to start, these are good entry points:

- improving `src/soulbond/transcript.ts`
- improving SoulBond test coverage
- improving CLI/demo docs
- clarifying module boundaries in docs
- polishing README / roadmap / contributor-facing docs

---

## Security and responsible reporting

If you discover a vulnerability, report it responsibly.

Since SoulClaw is currently a fork-stage project, security issues may involve:

- SoulClaw-specific additions
- inherited upstream OpenClaw behavior
- the interaction boundary between the two

Until a dedicated SoulClaw security process is formalized, use the repository’s security reporting path and clearly label whether the issue appears to be:

- upstream-derived
- fork-specific
- or uncertain

---

## Final note

SoulClaw is still early.
That is exactly why contribution quality matters so much.

A good contribution right now does not just add code — it makes the project easier to understand, easier to demo, and easier to keep moving in the right direction.
