# LumaClaw Acceptance Log

_Last updated: 2026-03-15_

This file records bounded project-truth judgments for the clean-reset mainline.

Use status labels:
- `landed`
- `landed-with-small-fix`
- `partial`
- `planned`
- `stale`
- `superseded`

---

## [ACC-20260315-001] SoulBond core first carry (v2A)

- **Status:** `landed-with-small-fix`
- **Area:** clean reset / SoulBond carry
- **Why this status:** the approved SoulBond-first carry landed in the new reset repo, including reset-local cron type extraction, but the worker failed to finish its own reporting cleanly and required Yukino to recover the missing implementation note manually.
- **Evidence:**
  - `src/soulbond/`
  - `src/auto-reply/reply/strip-inbound-meta.ts`
  - `scripts/soulbond-build-summary.ts`
  - `scripts/soulbond-cron-spec.ts`
  - `scripts/soulbond-demo.ts`
  - `scripts/soulbond-run-daily.ts`
  - `scripts/soulbond-status.ts`
  - `docs/reset-bootstrap/carry-v2a-soulbond-core-first.md`
- **Notes:** UI carry remains deferred. This entry should be treated as the point where the clean reset moved from planning into real carried implementation.

---

## [ACC-20260315-002] Technical minimum mainline bootstrap

- **Status:** `landed`
- **Area:** clean reset / technical mainline
- **Why this status:** the new LumaClaw repo now has a minimal technical identity and a passing verification path (`install`, `typecheck`, `test`, minimal CLI help), which makes it a real verifiable mainline rather than a draft scaffold.
- **Evidence:**
  - `package.json`
  - `lumaclaw.mjs`
  - `tsconfig.json`
  - `vitest.config.ts`
  - `docs/reset-bootstrap/verifiable-mainline-bootstrap-v1.md`
- **Notes:** This does not yet mean the repo is a full public-feature replacement. It means the reset mainline is technically alive and can continue as the active development surface.

---

## [ACC-20260315-003] Top-level identity and project-truth promotion

- **Status:** `landed`
- **Area:** clean reset / identity docs
- **Why this status:** the repo's top-level identity and project-truth docs were promoted from upstream/default shells into LumaClaw-specific mainline documents that match the current reset reality.
- **Evidence:**
  - `README.md`
  - `CURRENT_STATE.md`
  - `ROADMAP.md`
  - `VISION.md`
- **Notes:** This promotion intentionally stops short of UI carry and broader subsystem restoration. The mainline now describes itself truthfully, but its breadth is still deliberately narrow.
