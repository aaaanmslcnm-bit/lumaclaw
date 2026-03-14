# LumaClaw — SoulClaw Residual Cleanup Checklist

_Last updated: 2026-03-13_

This file tracks where the old `SoulClaw` name still remains and how to treat each occurrence.

The goal is **not** to mass-rename blindly.
The goal is to distinguish:
- what must remain for compatibility
- what can be cleaned up safely later
- what is only historical wording and can be reduced gradually

---

## Cleanup policy

### 1. Keep compatibility layers
Do **not** remove or rename `soulclaw` references that still serve as:
- CLI compatibility aliases
- launcher compatibility entrypoints
- package/bin compatibility surfaces
- explicit transition notes for old users

### 2. Clean low-risk semantic leftovers
Good cleanup targets are:
- comments
- test fixture/sample text
- stale internal wording that no longer reflects the public project identity

### 3. Avoid broad rename drift
A residual cleanup pass should stay narrow.
It should not become:
- a full public-surface rename pass
- a compatibility migration
- a broad package/runtime refactor

---

## A. Compatibility layer — keep for now

These are intentional and should stay until compatibility is deliberately retired.

### CLI / launcher compatibility
- `package.json`
  - `bin.soulclaw`
  - `soulclaw`
  - `soulclaw:rpc`
  - `soulclaw.mjs`
  - `soulclaw.podman.env`
  - `scripts/run-soulclaw-podman.sh`
- `soulclaw.mjs`
- `openclaw.mjs`
  - `soulclaw` name-resolution branch
- `src/cli/cli-name.ts`
- `src/cli/command-format.ts`
- `src/cli/completion-cli.ts`
- `src/cli/cli-name.test.ts`

### Docs that intentionally mention compatibility
- `README.md`
  - legacy `soulclaw` / `openclaw` command references during transition
- `docs/collaboration-workflow.md`
  - legacy `soulclaw` / `openclaw` command compatibility note
- `CHANGELOG.md`
  - `lumaclaw` first, with legacy `soulclaw` / `openclaw` compatibility

### Status
- `keep-for-compatibility`

---

## B. Low-risk cleanup targets — safe later

These are the best candidates for a narrow cleanup pass.

### Comments / internal wording
- `src/soulbond/scoring.ts`
  - comment still refers to `SoulClaw planning docs`

### Test sample text
- `src/soulbond/transcript.test.ts`
  - sample visible text still says `SoulClaw`
- `src/soulbond/run-daily.test.ts`
  - transcript sample still says `SoulClaw`

### Status
- `safe-cleanup-target`

---

## C. Historical wording — reduce gradually

These are not wrong, but should slowly become less central in public/project-facing explanations.

### Public/history wording
- `README.md`
  - "earlier SoulClaw project line"
- any similar historical wording that explains project evolution correctly but is no longer the best default framing

### Status
- `history-wording`

---

## Recommended next cleanup pass

If we run a narrow residual cleanup task, prefer allowing only:
- `src/soulbond/scoring.ts`
- `src/soulbond/transcript.test.ts`
- `src/soulbond/run-daily.test.ts`

Optional extra files only if they are:
- comments
- sample text
- clearly non-compatibility wording

### Explicit non-goals
- do not remove `soulclaw` CLI compatibility
- do not rename launcher files
- do not change `package.json` compatibility bins/scripts
- do not do broad repository-wide rename work

---

## One-line summary

> Keep `soulclaw` where it still serves compatibility. Clean it where it only survives as comment/sample-text residue.
