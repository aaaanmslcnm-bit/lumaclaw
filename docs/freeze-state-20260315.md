# Freeze State — 2026-03-15

_Last updated: 2026-03-15_

This note records the old-repo state immediately before the LumaClaw 2.0 clean reset archive freeze.

---

## Repo identity

- Local repo path: `C:\Users\Administrator\Desktop\LumaClaw`
- Public repo: `git@github.com:Yukino-Akane/lumaclaw.git`
- Active branch at freeze time: `align/origin-main-20260314-093246`
- Current local HEAD before freeze-note commit: `d1fdb606913d3ed1b28b6c98456e5339ea5a163d`

---

## Recent reset-prep commits already landed locally

- `c4638cc5b` — `docs: align public project narrative with current repo state`
- `d1fdb6069` — `docs: add clean reset planning pack`

Relevant preceding CI/doc repair commits on this branch:
- `ec85d25e1` — `chore: refresh detect-secrets baseline`
- `34e6c649d` — `ci: restore pnpm lockfile and decouple linux workflows from Blacksmith`
- `a73a3ac95` — `ci: move Linux workflow runners from Blacksmith to ubuntu-latest`
- `da035618f` — `chore: sync LumaClaw public identity across CLI and entrypoints`
- `17a83e2a0` — `feat(ui): land SoulBond overview status card slice`
- `69cac0824` — `docs: establish project truth, acceptance ledger, and current task anchors`

---

## PR snapshot

- PR: `#12`
- PR head at snapshot time: `c4638cc5bf3cbd2fcf4b4526c1c678c231727d8f`
- Mergeable: `true`
- Mergeable state: `unstable`

---

## CI snapshot at freeze-planning time

Check summary:
- failures: `8`
- queued: `8`
- success: `7`
- skipped: `5`

Current failed checks:
- `build-artifacts`
- `check`
- `check-docs`
- `checks (bun, test, pnpm canvas:a2ui:bundle && bunx vitest run --config vitest.unit.config.ts)`
- `checks (node, protocol, pnpm protocol:check)`
- `checks (node, test, pnpm canvas:a2ui:bundle && pnpm test)`
- `install-smoke`
- `secrets`

Interpretation:
- the old repo is no longer blocked on the earlier runner-queue / frozen-lockfile contradiction alone
- remaining failures now reflect deeper code/docs/build/test/security issues in the old repo path
- this is one reason the repo is being frozen as archive/reference for clean-reset work instead of continuing as the unquestioned future mainline

---

## Freeze decision

The old repo is now being transitioned into:
- archive
- reference
- evidence source
- cherry-pick pool

It should no longer be treated as the default place where LumaClaw 2.0 mainline decisions are made.

---

## Clean reset planning pack present in old repo before freeze

- `docs/clean-reset-migration-whitelist.md`
- `docs/lumaclaw-2-clean-reset-execution-spec-v1.md`
- `docs/lumaclaw-2-clean-reset-day-1-checklist.md`
- `docs/reset-dependency-whitelist.md`
- `docs/old-repo-freeze-plan.md`

These files are part of the documented reset-planning state preserved with the old repo archive.
