# LumaClaw

**A desktop AI that can work, remember, and grow with you.**

An open-source companion-oriented desktop AI assistant built on OpenClaw.

LumaClaw is the public product/release line for this fork-stage codebase. Internally, parts of the repo may still refer to the earlier SoulClaw project line while the public-facing package and release surface are being unified.

LumaClaw keeps the real agent capabilities of OpenClaw — tools, automation, browser control, local actions, skills, channels, and local computer control — while adding a companion layer focused on continuity, relationship growth, voice/avatar customization, and future desktop presence.

> Not just an AI tool. Not just a cute shell.

Project direction: [`VISION.md`](VISION.md) · Roadmap: [`ROADMAP.md`](ROADMAP.md) · Current state: [`CURRENT_STATE.md`](CURRENT_STATE.md) · Contribution guide: [`CONTRIBUTING.md`](CONTRIBUTING.md)

## Why LumaClaw?

Most AI assistants fall into one of two extremes:

1. powerful but emotionally flat
2. cute but functionally shallow

LumaClaw is meant to sit between those two failures.

The goal is to keep the practical power of OpenClaw, while building something that can also feel:

- continuous across time
- explainable in how the relationship layer works
- customizable in future voice / avatar / desktop presence
- more like a real desktop companion, not just an invisible automation backend

## Current Status

LumaClaw is already past pure concept phase, but it is not yet a finished product shell.

The most honest description of the project right now is:

> **A strong upstream agent foundation plus a real SoulBond MVP, with product integration still in progress.**

Current public stage:

- the repo is in an active fork transition from OpenClaw to LumaClaw as the public release line
- the SoulBond core loop already exists and is runnable
- the project is stronger on core logic than on visible integration
- the long-term companion layer is defined more clearly than it is currently surfaced
- the public GitHub repo and the `lumaclaw` npm package name are now occupied, but the release workflow is intentionally split into separate development, public, and npm packaging tracks

### Already real

These parts already exist in the codebase today:

- transcript-based interaction signal extraction
- explainable audit / evidence output
- daily SoulBond scoring
- manual daily evaluation
- SoulBond state persistence and status inspection
- cron-job generation / scheduling path
- a unified demo command that chains the whole flow

### Not fully integrated yet

These directions are intentional, but they are **not** yet fully productized:

- tone changes that consistently map from SoulBond state into real assistant behavior
- avatar / presentation changes driven by relationship state
- voice-layer integration tied to SoulBond state
- a first-class desktop/UI surface that exposes SoulBond as a visible product feature
- a fully cleaned-up public/runtime naming split from upstream OpenClaw

## Quick Demo

Current unified demo command:

```powershell
corepack pnpm run soulbond:demo -- --session <session.jsonl> --tz Asia/Shanghai --now <iso> --state <demo-state-path>
```

This single command currently outputs:

1. transcript audit
2. daily run result
3. current SoulBond status
4. cron job spec

So even at the current stage, LumaClaw can already demonstrate a complete end-to-end SoulBond loop, not just isolated scripts.

## Current Limitations

Right now, LumaClaw is still:

- CLI-first rather than a finished desktop UI
- stronger on core relationship logic than on presentation layers
- still inheriting a large amount of upstream OpenClaw structure and documentation
- still carrying some naming split / fork-transition rough edges
- not yet at the stage where voice / avatar / desktop shell are headline-ready features

That is intentional. The current priority is to make the core loop solid, inspectable, and easy to demo before dressing it up.

For a more detailed snapshot of what is real, what is not integrated yet, and what should be built next, see [`CURRENT_STATE.md`](CURRENT_STATE.md).

## Upstream Base

LumaClaw is currently built directly on top of OpenClaw.

That means much of the installation, runtime, platform, and tooling reference below still reflects the upstream technical base and remains useful while the fork is taking shape.

OpenClaw references:

- [OpenClaw repository](https://github.com/openclaw/openclaw)
- [OpenClaw docs](https://docs.openclaw.ai)
- [Vision](VISION.md)
- [Getting Started](https://docs.openclaw.ai/start/getting-started)
- [Updating](https://docs.openclaw.ai/install/updating)
- [Wizard](https://docs.openclaw.ai/start/wizard)
- [Docker](https://docs.openclaw.ai/install/docker)

## CLI Naming Transition

LumaClaw is still in a fork transition phase.

For now, much of the inherited runtime and packaging surface still uses the upstream `openclaw` CLI name.
That means examples below may still use commands like:

- `openclaw onboard`
- `openclaw gateway`
- `openclaw agent`

This is intentional for the current stage.
The public project identity is LumaClaw, while the inherited runtime/docs surface is still being separated carefully instead of being renamed blindly everywhere at once.

Current transition policy:

- the public npm package name is `lumaclaw`
- the package exposes `lumaclaw` as the public CLI name
- legacy `soulclaw` and `openclaw` entrypoints may remain temporarily for compatibility during transition
- existing inherited docs/examples may still use `openclaw` while the fork boundary is being cleaned up
- day-to-day engineering still happens in the heavier fork-stage development repo, while the public GitHub repo is synchronized as a cleaner public snapshot and npm is currently held by a minimal placeholder package

## Install (recommended)

Runtime: **Node 22+**.

At the current fork stage, the most honest/reliable setup is **from source**.
LumaClaw's public package/release story is still being separated from the upstream OpenClaw base, so source install is the clearest path for now.

```bash
git clone https://github.com/<your-org>/lumaclaw.git
cd LumaClaw

corepack pnpm install
corepack pnpm build
corepack pnpm lumaclaw onboard --install-daemon
```

Current transition note:

- package metadata uses `lumaclaw`
- local CLI entrypoints support `lumaclaw` first, with legacy `soulclaw` / `openclaw` compatibility during transition
- inherited docs/examples may still mention `openclaw` until the fork boundary is cleaned up further
- the current public npm package is a minimal placeholder release used to reserve the package name cleanly while the full runtime package boundary is being prepared

## Quick start (TL;DR)

Runtime: **Node 22+**.

Full beginner guide (auth, pairing, channels): [Getting started](https://docs.openclaw.ai/start/getting-started)

```bash
lumaclaw onboard --install-daemon

lumaclaw gateway --port 18789 --verbose

# Send a message
lumaclaw message send --to +1234567890 --message "Hello from LumaClaw"

# Talk to the assistant (optionally deliver back to any connected channel: WhatsApp/Telegram/Slack/Discord/Google Chat/Signal/iMessage/BlueBubbles/IRC/Microsoft Teams/Matrix/Feishu/LINE/Mattermost/Nextcloud Talk/Nostr/Synology Chat/Tlon/Twitch/Zalo/Zalo Personal/WebChat)
lumaclaw agent --message "Ship checklist" --thinking high
```

Upgrading? [Updating guide](https://docs.openclaw.ai/install/updating) (and run `lumaclaw doctor`, legacy `soulclaw doctor`, or `openclaw doctor`).

## Development channels

- **stable**: tagged releases (`vYYYY.M.D` or `vYYYY.M.D-<patch>`), npm dist-tag `latest`.
- **beta**: prerelease tags (`vYYYY.M.D-beta.N`), npm dist-tag `beta` (macOS app may be missing).
- **dev**: moving head of `main`, npm dist-tag `dev` (when published).

Switch channels (git + npm): `lumaclaw update --channel stable|beta|dev`.
Details: [Development channels](https://docs.openclaw.ai/install/development-channels).

## From source (development)

Prefer `pnpm` for builds from source. Bun is optional for running TypeScript directly.

```bash
git clone https://github.com/<your-org>/lumaclaw.git
cd LumaClaw

corepack pnpm install
corepack pnpm ui:build # auto-installs UI deps on first run
corepack pnpm build

corepack pnpm lumaclaw onboard --install-daemon

# Dev loop (auto-reload on TS changes)
corepack pnpm gateway:watch
```

Note: `corepack pnpm lumaclaw ...` runs TypeScript directly (via `tsx`). `corepack pnpm build` produces `dist/` for running via Node / the packaged `lumaclaw` / legacy `soulclaw` / `openclaw` binaries during the current transition.

## Security defaults (DM access)

LumaClaw currently inherits OpenClaw's messaging/runtime surface here. Treat inbound DMs as **untrusted input**.

Full security guide: [Security](https://docs.openclaw.ai/gateway/security)

Default behavior on Telegram/WhatsApp/Signal/iMessage/Microsoft Teams/Discord/Google Chat/Slack:

- **DM pairing** (`dmPolicy="pairing"` / `channels.discord.dmPolicy="pairing"` / `channels.slack.dmPolicy="pairing"`; legacy: `channels.discord.dm.policy`, `channels.slack.dm.policy`): unknown senders receive a short pairing code and the bot does not process their message.
- Approve with: `lumaclaw pairing approve <channel> <code>` (legacy `soulclaw` / `openclaw` approve commands also work during transition).
- Public inbound DMs require an explicit opt-in: set `dmPolicy="open"` and include `"*"` in the channel allowlist (`allowFrom` / `channels.discord.allowFrom` / `channels.slack.allowFrom`; legacy: `channels.discord.dm.allowFrom`, `channels.slack.dm.allowFrom`).

Run `lumaclaw doctor` (or legacy `soulclaw doctor` / `openclaw doctor`) to surface risky/misconfigured DM policies.

## Inherited Upstream Reference (Current Fork Stage)

LumaClaw currently still inherits a large amount of technical capability and runtime surface from OpenClaw.

That means many detailed install/platform/channel/tooling references are still best understood through upstream documentation while the fork boundary is being cleaned up.

Useful upstream references:

- OpenClaw repository: <https://github.com/openclaw/openclaw>
- OpenClaw docs: <https://docs.openclaw.ai>
- Getting started: <https://docs.openclaw.ai/start/getting-started>
- Configuration: <https://docs.openclaw.ai/gateway/configuration>
- Security: <https://docs.openclaw.ai/gateway/security>
- Browser tools: <https://docs.openclaw.ai/tools/browser>
- Nodes: <https://docs.openclaw.ai/nodes>
- Web / Control UI: <https://docs.openclaw.ai/web>

This is a temporary compromise, not the finished state.

The public-facing project identity is now LumaClaw.
The runtime/docs split is still being separated deliberately instead of being renamed blindly everywhere at once.

## Fork Direction

LumaClaw is not trying to become:

- a hollow desktop mascot
- a cheap romance-script project
- an aesthetics-first shell around weak internals

It is trying to become:

- a real desktop AI assistant
- built on a serious agent foundation
- with continuity, relationship growth, and future presentation layers
- without giving up practical capability

## Current Public State

At this stage, the most accurate public summary is:

> LumaClaw is a fork-stage project with a real SoulBond MVP, a strong inherited agent base, and a product layer that is still catching up to the architecture.

That is not a flaw to hide. It is simply the current truth of the project.