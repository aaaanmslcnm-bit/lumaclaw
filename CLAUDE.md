# LumaClaw Repository Notes

This repository is **LumaClaw**, a fork-stage project built on top of OpenClaw.

If you are reading this as a contributor or coding agent, use these files first:

- [`README.md`](README.md) — current public-facing project overview
- [`VISION.md`](VISION.md) — product direction and philosophy
- [`ROADMAP.md`](ROADMAP.md) — staged implementation direction
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution expectations and current priorities
- [`SECURITY.md`](SECURITY.md) — current fork-stage security/reporting guidance
- [`docs/collaboration-workflow.md`](docs/collaboration-workflow.md) — current collaboration and delegation model

## Fork-stage note

LumaClaw is still separating its public project identity from inherited upstream runtime and internal naming.
That means you may still see:

- `openclaw` CLI examples or compatibility aliases
- `OPENCLAW_*` environment variables
- upstream technical names in code and scripts

Do **not** assume those mean the project identity is still OpenClaw.
They are currently part of the compatibility layer while the fork boundary is being cleaned up deliberately.

## Practical rule

When editing repo-facing/public-facing files, prefer the **LumaClaw** name and framing.
When editing deep runtime internals, preserve compatibility unless there is a clear reason to change it.

## Windows coding-agent gotchas

When inspecting or editing this repo from a Windows automation environment:

- Do **not** assume a test file exists just because the implementation file exists. For example, `src/cli/completion-cli.test.ts` does **not** exist here; discover actual tests first.
- Avoid shell globs like `src/cli/*.test.ts` or `src/cli/program/*.test.ts` in Windows PowerShell-driven flows. Prefer `rg --files src/cli` or `git ls-files` and then filter results.
- `banner.ts` contains encoding-sensitive literals in this workspace. Patch that file surgically after reading exact lines instead of doing broad blind replacements.
- If you are changing the CLI public name, treat `openclaw.mjs`, `src/cli/cli-name.ts`, `src/cli/command-format.ts`, `src/cli/completion-cli.ts`, banner/tagline/help/example files, and direct tests as one coordinated surface.
