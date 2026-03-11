#!/usr/bin/env bash
# SoulClaw public-facing Podman launcher wrapper.
# Runtime currently delegates to the inherited compatibility script.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$SCRIPT_DIR/run-openclaw-podman.sh" "$@"
