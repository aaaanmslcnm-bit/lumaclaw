# LumaClaw 2.0 Clean Reset — Dependency Whitelist

_Last updated: 2026-03-15_

This file defines the **phase-one dependency whitelist** for the LumaClaw 2.0 clean reset.

It is based on the current target carry set:
- `src/soulbond/**`
- `scripts/soulbond-*.ts`
- minimum SoulBond UI slice
- minimal project identity / docs layer

The purpose is to stop the reset from inheriting dependencies by habit.

---

## 1. Whitelist rule

> If a dependency is not required by the reset carry set, it does not enter phase one by default.

This includes package dependencies, devDependencies, and internal support modules.

---

## 2. External package dependencies actually surfaced by the current carry set

## A. Hard runtime dependency

### `zod`
Required by:
- `src/soulbond/state-schema.ts`

Why keep:
- SoulBond state validation/schema logic already depends on it directly.

Status:
- **keep in phase one**

---

## B. Hard UI dependency

### `lit`
Required by:
- `ui/src/ui/components/soulbond-status-card.ts`
- `ui/src/ui/views/overview.ts`
- `ui/src/ui/views/overview.soulbond.test.ts`

Why keep:
- the current minimum product-facing UI slice is Lit-based.

Status:
- **keep in phase one** if the reset keeps the current UI slice
- if the UI slice is rewritten/replaced, re-evaluate later

---

## C. Test dependency

### `vitest`
Required by:
- SoulBond test files
- overview UI slice test

Why keep:
- phase one still needs a minimum credible test path.

Status:
- **keep in phase one**

---

## D. TS/runtime tooling dependency

### `typescript`
Why keep:
- required for the TypeScript reset repo itself.

Status:
- **keep in phase one**

### `tsx`
Why keep:
- current SoulBond scripts run via `node --import tsx`.

Required by current scripts:
- `scripts/soulbond-build-summary.ts`
- `scripts/soulbond-cron-spec.ts`
- `scripts/soulbond-demo.ts`
- `scripts/soulbond-run-daily.ts`
- `scripts/soulbond-status.ts`

Status:
- **keep in phase one** unless the reset intentionally rewrites the execution path

### `@types/node`
Why keep:
- needed for a sane Node+TS dev/test baseline.

Status:
- **keep in phase one**

---

## 3. Node built-ins used by the carry set

These do not need package installation, but they do affect reset design:

- `node:fs/promises`
- `node:path`
- `node:os`
- `node:process`

Implication:
- the reset repo remains a Node-based project, not a browser-only or pure-library project.

---

## 4. Internal support modules that the carry set still depends on

These are not npm dependencies, but they are **internal carry dependencies**.
If they are not reimplemented, they must be copied or replaced in phase one.

## A. SoulBond internal-support carry requirements

### `src/cron/types.ts`
Needed by:
- `src/soulbond/cron-adapter.ts`
- `src/soulbond/cron-job.ts`
- `src/soulbond/schedule.ts`

Current judgment:
- **do not blindly carry the whole cron subsystem**
- either:
  1. carry only the minimal `types.ts` shape required by SoulBond, or
  2. refactor SoulBond cron-facing code to use a reset-local type

Preferred phase-one direction:
- **extract/minimize**, not full cron carry-over

### `src/auto-reply/reply/strip-inbound-meta.ts`
Needed by:
- `src/soulbond/transcript.ts`

Current judgment:
- this is a small, focused utility and is a good candidate for either:
  1. small direct carry, or
  2. reset-local extraction into a narrower utility file

Preferred phase-one direction:
- **carry or extract narrowly**

---

## B. UI-slice internal-support carry requirements

The current overview-based UI slice is not only 3 files. It still depends on:

- `src/gateway/protocol/connect-error-details.ts`
- `src/soulbond/tone.ts`
- `src/soulbond/types.ts`
- `ui/src/i18n/index.ts`
- `ui/src/ui/external-link.ts`
- `ui/src/ui/format.ts`
- `ui/src/ui/gateway.ts`
- `ui/src/ui/presenter.ts`
- `ui/src/ui/storage.ts`
- `ui/src/ui/views/overview-hints.ts`

Implication:
- phase one must choose one of two paths:

### Path 1 — Carry the current overview slice with its small support ring
Use when:
- the goal is to preserve the current UI slice quickly

### Path 2 — Refactor the UI slice into a more isolated reset-local component
Use when:
- the goal is maximum repo cleanliness, even if it means slightly more rewrite work

Current recommendation:
- **Path 1 for speed**, then isolate later if needed

---

## 5. Phase-one dependency keep list

## Runtime / direct deps
- `zod`
- `lit` *(if current UI slice is retained)*

## Dev / tool deps
- `typescript`
- `tsx`
- `vitest`
- `@types/node`

This is the current minimum credible dependency whitelist.

---

## 6. Dependencies explicitly rejected by default in phase one

The following dependency categories are **not** automatically carried into the reset repo:

- channel integrations
- provider SDK breadth
- browser automation stack breadth
- platform/app packaging deps
- release/distribution chain deps
- extension/plugin ecosystem deps
- large CLI/runtime surfaces unrelated to SoulBond reset scope

Examples from the old repo that should be treated as **excluded by default** unless later proven necessary:
- Slack / Discord / Telegram / WhatsApp related packages
- AWS / Bedrock client packages
- large TTS/media/image/document handling packages
- Playwright
- Express/server breadth unrelated to the reset scope
- large OpenClaw runtime dependencies outside the reset target

---

## 7. Day-1 dependency decision outputs required

Before Day 1 is considered complete, the reset should produce:

1. a **final phase-one keep list**
2. a **small internal-support carry list**
3. an **explicit exclusion list**
4. a decision on whether the current UI slice is:
   - carried with its support ring, or
   - rewritten into a smaller isolated slice

---

## 8. Working conclusion

The reset does **not** need the giant inherited dependency surface.

The current evidence says phase one only clearly needs:
- `zod`
- `lit` *(if retaining the current UI slice)*
- `vitest`
- `typescript`
- `tsx`
- `@types/node`

Plus a **small internal support ring** for:
- transcript metadata stripping
- cron payload typing
- the current overview-based UI slice

---

## One-line rule

> Keep only what SoulBond, the minimum UI slice, and the minimum verification path actually touch.
