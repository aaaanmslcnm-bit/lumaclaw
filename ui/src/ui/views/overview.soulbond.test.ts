import { render } from "lit";
import { describe, expect, it, vi } from "vitest";
import { createDefaultSoulBondState, resolveSoulBondStage } from "../../../../src/soulbond/types.js";
import type { GatewayHelloOk } from "../gateway.ts";
import type { UiSettings } from "../storage.ts";
import { renderOverview, type OverviewProps } from "./overview.ts";

function createSettings(): UiSettings {
  return {
    gatewayUrl: "ws://127.0.0.1:18789",
    token: "",
    sessionKey: "main",
    lastActiveSessionKey: "main",
    theme: "system",
    chatFocusMode: false,
    chatShowThinking: true,
    splitRatio: 0.6,
    navCollapsed: false,
    navGroupsCollapsed: {},
  };
}

function createOverviewProps(overrides: Partial<OverviewProps> = {}): OverviewProps {
  return {
    connected: true,
    hello: null,
    settings: createSettings(),
    password: "",
    lastError: null,
    lastErrorCode: null,
    presenceCount: 3,
    sessionsCount: 7,
    cronEnabled: true,
    cronNext: null,
    lastChannelsRefresh: null,
    onSettingsChange: vi.fn(),
    onPasswordChange: vi.fn(),
    onSessionKeyChange: vi.fn(),
    onConnect: vi.fn(),
    onRefresh: vi.fn(),
    ...overrides,
  };
}

async function renderSoulBondCard(props: OverviewProps) {
  const container = document.createElement("div");
  render(renderOverview(props), container);
  const card = container.querySelector("soulbond-status-card");
  expect(card).not.toBeNull();
  const updatable = card as HTMLElement & { updateComplete?: Promise<unknown> };
  if (updatable.updateComplete) {
    await updatable.updateComplete;
  }
  return card as HTMLElement;
}

describe("overview SoulBond status card", () => {
  it("renders an explicit preview state when live SoulBond data is unavailable", async () => {
    const card = await renderSoulBondCard(createOverviewProps());
    const content = card.shadowRoot?.textContent ?? "";

    expect(content).toContain("Preview state");
    expect(content).toContain("Source state");
    expect(content).toContain("Current bond");
    expect(content).toContain("36");
    expect(content).toContain("Current stage");
    expect(content).toContain("Close");
    expect(content).toContain("Current tone");
    expect(content).toContain("Natural");
    expect(content).toContain("Tone behavior");
    expect(content).toContain("Mapped");
    expect(content).toContain("Latest daily result");
    expect(content).toContain("78/100 day, bond +4, stage held at Close.");
    expect(content).toContain(
      "Preview fallback because the current gateway snapshot does not expose SoulBond state here yet.",
    );
    expect(content).toContain("Guidance");
    expect(content).toContain(
      "Can speak in a relaxed and steady way without being too distant.",
    );
  });

  it("renders runtime SoulBond state when a snapshot payload is present", async () => {
    const runtimeState = createDefaultSoulBondState();
    runtimeState.bond = 86;
    runtimeState.stage = resolveSoulBondStage(runtimeState.bond);
    runtimeState.settings.affectTone = false;
    runtimeState.currentDay = 21;
    runtimeState.dailyHistory = [
      {
        date: "2026-03-10",
        dailyScore: 58,
        bondDelta: -2,
        stage: runtimeState.stage,
        reasons: [],
      },
    ];

    const hello: GatewayHelloOk = {
      type: "hello-ok",
      protocol: 3,
      snapshot: {
        soulbond: runtimeState,
      } as unknown,
    };

    const card = await renderSoulBondCard(
      createOverviewProps({
        hello,
      }),
    );
    const content = card.shadowRoot?.textContent ?? "";

    expect(content).toContain("Runtime state");
    expect(content).toContain("Source state");
    expect(content).toContain("86");
    expect(content).toContain("Resonant");
    expect(content).toContain("Reserved");
    expect(content).toContain("Fixed");
    expect(content).toContain("58/100 day, bond -2, stage held at Resonant.");
    expect(content).toContain("Live SoulBond state from the current gateway snapshot.");
    expect(content).toContain("Pinned to the default reserved tone.");
    expect(content).toContain("Tone mapping is disabled; stay polite, measured, and not too intimate yet.");
  });
});
