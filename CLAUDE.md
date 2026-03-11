# SoulClaw Repository Notes

This repository is **SoulClaw**, a fork-stage project built on top of OpenClaw.

If you are reading this as a contributor or coding agent, use these files first:

- [`README.md`](README.md) — current public-facing project overview
- [`VISION.md`](VISION.md) — product direction and philosophy
- [`ROADMAP.md`](ROADMAP.md) — staged implementation direction
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution expectations and current priorities
- [`SECURITY.md`](SECURITY.md) — current fork-stage security/reporting guidance

## Fork-stage note

SoulClaw is still separating its public project identity from inherited upstream runtime and internal naming.
That means you may still see:

- `openclaw` CLI examples or compatibility aliases
- `OPENCLAW_*` environment variables
- upstream technical names in code and scripts

Do **not** assume those mean the project identity is still OpenClaw.
They are currently part of the compatibility layer while the fork boundary is being cleaned up deliberately.

## Practical rule

When editing repo-facing/public-facing files, prefer the **SoulClaw** name and framing.
When editing deep runtime internals, preserve compatibility unless there is a clear reason to change it.
