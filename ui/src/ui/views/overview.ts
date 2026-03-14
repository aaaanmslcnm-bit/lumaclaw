import { html } from "lit";
import { ConnectErrorDetailCodes } from "../../../../src/gateway/protocol/connect-error-details.js";
import { getSoulBondToneFromState } from "../../../../src/soulbond/tone.js";
import {
  SOUL_BOND_STAGES,
  createDefaultSoulBondState,
  resolveSoulBondStage,
  type SoulBondRecord,
  type SoulBondStage,
  type SoulBondState,
} from "../../../../src/soulbond/types.js";
import { t, i18n, SUPPORTED_LOCALES, type Locale } from "../../i18n/index.ts";
import type { SoulBondStatusCardModel } from "../components/soulbond-status-card.ts";
import "../components/soulbond-status-card.ts";
import { buildExternalLinkRel, EXTERNAL_LINK_TARGET } from "../external-link.ts";
import { formatRelativeTimestamp, formatDurationHuman } from "../format.ts";
import type { GatewayHelloOk } from "../gateway.ts";
import { formatNextRun } from "../presenter.ts";
import type { UiSettings } from "../storage.ts";
import { shouldShowPairingHint } from "./overview-hints.ts";

export type OverviewProps = {
  connected: boolean;
  hello: GatewayHelloOk | null;
  settings: UiSettings;
  password: string;
  lastError: string | null;
  lastErrorCode: string | null;
  presenceCount: number;
  sessionsCount: number | null;
  cronEnabled: boolean | null;
  cronNext: number | null;
  lastChannelsRefresh: number | null;
  onSettingsChange: (next: UiSettings) => void;
  onPasswordChange: (next: string) => void;
  onSessionKeyChange: (next: string) => void;
  onConnect: () => void;
  onRefresh: () => void;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function isSoulBondStage(value: unknown): value is SoulBondStage {
  return typeof value === "string" && SOUL_BOND_STAGES.includes(value as SoulBondStage);
}

function toTitleLabel(value: string): string {
  return value
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatBondDelta(delta: number): string {
  return delta >= 0 ? `+${delta}` : `${delta}`;
}

function coerceSoulBondRecord(value: unknown): SoulBondRecord | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }
  if (
    typeof record.date !== "string" ||
    typeof record.dailyScore !== "number" ||
    typeof record.bondDelta !== "number" ||
    !isSoulBondStage(record.stage)
  ) {
    return null;
  }
  return {
    date: record.date,
    dailyScore: record.dailyScore,
    bondDelta: record.bondDelta,
    stage: record.stage,
    reasons: [],
  };
}

function coerceSoulBondState(value: unknown): SoulBondState | null {
  const raw = asRecord(value);
  if (!raw || typeof raw.bond !== "number") {
    return null;
  }

  const defaults = createDefaultSoulBondState();
  const settings = asRecord(raw.settings);
  const records = Array.isArray(raw.dailyHistory)
    ? raw.dailyHistory
        .map((entry) => coerceSoulBondRecord(entry))
        .filter((entry): entry is SoulBondRecord => entry !== null)
    : defaults.dailyHistory;

  return {
    version: typeof raw.version === "number" ? raw.version : defaults.version,
    currentDay: typeof raw.currentDay === "number" ? raw.currentDay : records.length,
    bond: raw.bond,
    stage: isSoulBondStage(raw.stage) ? raw.stage : resolveSoulBondStage(raw.bond),
    lastEvaluationAt: typeof raw.lastEvaluationAt === "string" ? raw.lastEvaluationAt : undefined,
    dailyHistory: records,
    settings: {
      enabled: typeof settings?.enabled === "boolean" ? settings.enabled : defaults.settings.enabled,
      mode:
        settings?.mode === "simple" || settings?.mode === "100-day"
          ? settings.mode
          : defaults.settings.mode,
      allowNegative:
        typeof settings?.allowNegative === "boolean"
          ? settings.allowNegative
          : defaults.settings.allowNegative,
      notifyDaily:
        typeof settings?.notifyDaily === "boolean"
          ? settings.notifyDaily
          : defaults.settings.notifyDaily,
      affectTone:
        typeof settings?.affectTone === "boolean"
          ? settings.affectTone
          : defaults.settings.affectTone,
      affectAvatar:
        typeof settings?.affectAvatar === "boolean"
          ? settings.affectAvatar
          : defaults.settings.affectAvatar,
      affectVoice:
        typeof settings?.affectVoice === "boolean"
          ? settings.affectVoice
          : defaults.settings.affectVoice,
    },
  };
}

function formatLatestDailyResult(state: SoulBondState): {
  summary: string;
  delta?: string;
} {
  const latestRecord =
    state.dailyHistory.length > 0
      ? state.dailyHistory[state.dailyHistory.length - 1]
      : undefined;
  if (!latestRecord) {
    return {
      summary: "No daily evaluation has been recorded yet.",
    };
  }

  const previousStage = resolveSoulBondStage(state.bond - latestRecord.bondDelta);
  const stageResult =
    previousStage === latestRecord.stage
      ? `stage held at ${toTitleLabel(latestRecord.stage)}`
      : `${toTitleLabel(previousStage)} -> ${toTitleLabel(latestRecord.stage)}`;

  return {
    summary: `${latestRecord.dailyScore}/100 day, bond ${formatBondDelta(latestRecord.bondDelta)}, ${stageResult}.`,
    delta: `${formatBondDelta(latestRecord.bondDelta)} bond`,
  };
}

function buildSoulBondStatusCardModel(
  state: SoulBondState,
  source: "runtime" | "preview",
): SoulBondStatusCardModel {
  const tone = getSoulBondToneFromState(state);
  const latestDailyResult = formatLatestDailyResult(state);
  return {
    bond: state.bond,
    bondProgress: Math.max(0, Math.min(state.bond, 100)),
    stage: toTitleLabel(state.stage),
    tone: toTitleLabel(tone.tone),
    toneMode: state.settings.affectTone ? "mapped" : "fixed",
    toneModeHint: state.settings.affectTone
      ? "Follows the current bond and stage."
      : "Pinned to the default reserved tone.",
    latestDailyResult: latestDailyResult.summary,
    latestDailyDelta: latestDailyResult.delta,
    guidance: tone.note,
    source,
    sourceHint:
      source === "runtime"
        ? "Live SoulBond state from the current gateway snapshot."
        : "Preview fallback because the current gateway snapshot does not expose SoulBond state here yet.",
  };
}

function createPreviewSoulBondStatusCardModel(): SoulBondStatusCardModel {
  const preview = createDefaultSoulBondState();
  preview.bond = 36;
  preview.stage = resolveSoulBondStage(preview.bond);
  preview.currentDay = 12;
  preview.dailyHistory = [
    {
      date: "preview-latest",
      dailyScore: 78,
      bondDelta: 4,
      stage: preview.stage,
      reasons: [],
    },
  ];
  return buildSoulBondStatusCardModel(preview, "preview");
}

function resolveSoulBondStateFromHello(hello: GatewayHelloOk | null): SoulBondState | null {
  const snapshot = asRecord(hello?.snapshot);
  if (!snapshot) {
    return null;
  }
  const runtimeCandidates: unknown[] = [snapshot.soulbond];
  const health = asRecord(snapshot.health);
  if (health?.soulbond) {
    runtimeCandidates.push(health.soulbond);
  }
  for (const candidate of runtimeCandidates) {
    const state = coerceSoulBondState(candidate);
    if (state) {
      return state;
    }
  }
  return null;
}

function resolveSoulBondStatusCardModel(hello: GatewayHelloOk | null): SoulBondStatusCardModel {
  const liveState = resolveSoulBondStateFromHello(hello);
  if (liveState) {
    return buildSoulBondStatusCardModel(liveState, "runtime");
  }
  return createPreviewSoulBondStatusCardModel();
}

export function renderOverview(props: OverviewProps) {
  const snapshot = props.hello?.snapshot as
    | {
        uptimeMs?: number;
        policy?: { tickIntervalMs?: number };
        authMode?: "none" | "token" | "password" | "trusted-proxy";
      }
    | undefined;
  const uptime = snapshot?.uptimeMs ? formatDurationHuman(snapshot.uptimeMs) : t("common.na");
  const tick = snapshot?.policy?.tickIntervalMs
    ? `${snapshot.policy.tickIntervalMs}ms`
    : t("common.na");
  const authMode = snapshot?.authMode;
  const isTrustedProxy = authMode === "trusted-proxy";

  const pairingHint = (() => {
    if (!shouldShowPairingHint(props.connected, props.lastError, props.lastErrorCode)) {
      return null;
    }
    return html`
      <div class="muted" style="margin-top: 8px">
        ${t("overview.pairing.hint")}
        <div style="margin-top: 6px">
          <span class="mono">openclaw devices list</span><br />
          <span class="mono">openclaw devices approve &lt;requestId&gt;</span>
        </div>
        <div style="margin-top: 6px; font-size: 12px;">
          ${t("overview.pairing.mobileHint")}
        </div>
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.ai/web/control-ui#device-pairing-first-connection"
            target=${EXTERNAL_LINK_TARGET}
            rel=${buildExternalLinkRel()}
            title="Device pairing docs (opens in new tab)"
            >Docs: Device pairing</a
          >
        </div>
      </div>
    `;
  })();

  const authHint = (() => {
    if (props.connected || !props.lastError) {
      return null;
    }
    const lower = props.lastError.toLowerCase();
    const authRequiredCodes = new Set<string>([
      ConnectErrorDetailCodes.AUTH_REQUIRED,
      ConnectErrorDetailCodes.AUTH_TOKEN_MISSING,
      ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING,
      ConnectErrorDetailCodes.AUTH_TOKEN_NOT_CONFIGURED,
      ConnectErrorDetailCodes.AUTH_PASSWORD_NOT_CONFIGURED,
    ]);
    const authFailureCodes = new Set<string>([
      ...authRequiredCodes,
      ConnectErrorDetailCodes.AUTH_UNAUTHORIZED,
      ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH,
      ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH,
      ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH,
      ConnectErrorDetailCodes.AUTH_RATE_LIMITED,
      ConnectErrorDetailCodes.AUTH_TAILSCALE_IDENTITY_MISSING,
      ConnectErrorDetailCodes.AUTH_TAILSCALE_PROXY_MISSING,
      ConnectErrorDetailCodes.AUTH_TAILSCALE_WHOIS_FAILED,
      ConnectErrorDetailCodes.AUTH_TAILSCALE_IDENTITY_MISMATCH,
    ]);
    const authFailed = props.lastErrorCode
      ? authFailureCodes.has(props.lastErrorCode)
      : lower.includes("unauthorized") || lower.includes("connect failed");
    if (!authFailed) {
      return null;
    }
    const hasToken = Boolean(props.settings.token.trim());
    const hasPassword = Boolean(props.password.trim());
    const isAuthRequired = props.lastErrorCode
      ? authRequiredCodes.has(props.lastErrorCode)
      : !hasToken && !hasPassword;
    if (isAuthRequired) {
      return html`
        <div class="muted" style="margin-top: 8px">
          ${t("overview.auth.required")}
          <div style="margin-top: 6px">
            <span class="mono">openclaw dashboard --no-open</span> → tokenized URL<br />
            <span class="mono">openclaw doctor --generate-gateway-token</span> → set token
          </div>
          <div style="margin-top: 6px">
            <a
              class="session-link"
              href="https://docs.openclaw.ai/web/dashboard"
              target=${EXTERNAL_LINK_TARGET}
              rel=${buildExternalLinkRel()}
              title="Control UI auth docs (opens in new tab)"
              >Docs: Control UI auth</a
            >
          </div>
        </div>
      `;
    }
    return html`
      <div class="muted" style="margin-top: 8px">
        ${t("overview.auth.failed", { command: "openclaw dashboard --no-open" })}
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.ai/web/dashboard"
            target=${EXTERNAL_LINK_TARGET}
            rel=${buildExternalLinkRel()}
            title="Control UI auth docs (opens in new tab)"
            >Docs: Control UI auth</a
          >
        </div>
      </div>
    `;
  })();

  const insecureContextHint = (() => {
    if (props.connected || !props.lastError) {
      return null;
    }
    const isSecureContext = typeof window !== "undefined" ? window.isSecureContext : true;
    if (isSecureContext) {
      return null;
    }
    const lower = props.lastError.toLowerCase();
    const insecureContextCode =
      props.lastErrorCode === ConnectErrorDetailCodes.CONTROL_UI_DEVICE_IDENTITY_REQUIRED ||
      props.lastErrorCode === ConnectErrorDetailCodes.DEVICE_IDENTITY_REQUIRED;
    if (
      !insecureContextCode &&
      !lower.includes("secure context") &&
      !lower.includes("device identity required")
    ) {
      return null;
    }
    return html`
      <div class="muted" style="margin-top: 8px">
        ${t("overview.insecure.hint", { url: "http://127.0.0.1:18789" })}
        <div style="margin-top: 6px">
          ${t("overview.insecure.stayHttp", { config: "gateway.controlUi.allowInsecureAuth: true" })}
        </div>
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.ai/gateway/tailscale"
            target=${EXTERNAL_LINK_TARGET}
            rel=${buildExternalLinkRel()}
            title="Tailscale Serve docs (opens in new tab)"
            >Docs: Tailscale Serve</a
          >
          <span class="muted"> · </span>
          <a
            class="session-link"
            href="https://docs.openclaw.ai/web/control-ui#insecure-http"
            target=${EXTERNAL_LINK_TARGET}
            rel=${buildExternalLinkRel()}
            title="Insecure HTTP docs (opens in new tab)"
            >Docs: Insecure HTTP</a
          >
        </div>
      </div>
    `;
  })();

  const currentLocale = i18n.getLocale();
  const soulBondStatus = resolveSoulBondStatusCardModel(props.hello);

  return html`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">${t("overview.access.title")}</div>
        <div class="card-sub">${t("overview.access.subtitle")}</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>${t("overview.access.wsUrl")}</span>
            <input
              .value=${props.settings.gatewayUrl}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                props.onSettingsChange({ ...props.settings, gatewayUrl: v });
              }}
              placeholder="ws://100.x.y.z:18789"
            />
          </label>
          ${
            isTrustedProxy
              ? ""
              : html`
                <label class="field">
                  <span>${t("overview.access.token")}</span>
                  <input
                    .value=${props.settings.token}
                    @input=${(e: Event) => {
                      const v = (e.target as HTMLInputElement).value;
                      props.onSettingsChange({ ...props.settings, token: v });
                    }}
                    placeholder="OPENCLAW_GATEWAY_TOKEN"
                  />
                </label>
                <label class="field">
                  <span>${t("overview.access.password")}</span>
                  <input
                    type="password"
                    .value=${props.password}
                    @input=${(e: Event) => {
                      const v = (e.target as HTMLInputElement).value;
                      props.onPasswordChange(v);
                    }}
                    placeholder="system or shared password"
                  />
                </label>
              `
          }
          <label class="field">
            <span>${t("overview.access.sessionKey")}</span>
            <input
              .value=${props.settings.sessionKey}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                props.onSessionKeyChange(v);
              }}
            />
          </label>
          <label class="field">
            <span>${t("overview.access.language")}</span>
            <select
              .value=${currentLocale}
              @change=${(e: Event) => {
                const v = (e.target as HTMLSelectElement).value as Locale;
                void i18n.setLocale(v);
                props.onSettingsChange({ ...props.settings, locale: v });
              }}
            >
              ${SUPPORTED_LOCALES.map((loc) => {
                const key = loc.replace(/-([a-zA-Z])/g, (_, c) => c.toUpperCase());
                return html`<option value=${loc}>${t(`languages.${key}`)}</option>`;
              })}
            </select>
          </label>
        </div>
        <div class="row" style="margin-top: 14px;">
          <button class="btn" @click=${() => props.onConnect()}>${t("common.connect")}</button>
          <button class="btn" @click=${() => props.onRefresh()}>${t("common.refresh")}</button>
          <span class="muted">${
            isTrustedProxy ? t("overview.access.trustedProxy") : t("overview.access.connectHint")
          }</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">${t("overview.snapshot.title")}</div>
        <div class="card-sub">${t("overview.snapshot.subtitle")}</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">${t("overview.snapshot.status")}</div>
            <div class="stat-value ${props.connected ? "ok" : "warn"}">
              ${props.connected ? t("common.ok") : t("common.offline")}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">${t("overview.snapshot.uptime")}</div>
            <div class="stat-value">${uptime}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${t("overview.snapshot.tickInterval")}</div>
            <div class="stat-value">${tick}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${t("overview.snapshot.lastChannelsRefresh")}</div>
            <div class="stat-value">
              ${props.lastChannelsRefresh ? formatRelativeTimestamp(props.lastChannelsRefresh) : t("common.na")}
            </div>
          </div>
        </div>
        ${
          props.lastError
            ? html`<div class="callout danger" style="margin-top: 14px;">
              <div>${props.lastError}</div>
              ${pairingHint ?? ""}
              ${authHint ?? ""}
              ${insecureContextHint ?? ""}
            </div>`
            : html`
                <div class="callout" style="margin-top: 14px">
                  ${t("overview.snapshot.channelsHint")}
                </div>
              `
        }
      </div>
    </section>

    <section style="margin-top: 18px;">
      <soulbond-status-card .model=${soulBondStatus}></soulbond-status-card>
    </section>

    <section class="grid grid-cols-3" style="margin-top: 18px;">
      <div class="card stat-card">
        <div class="stat-label">${t("overview.stats.instances")}</div>
        <div class="stat-value">${props.presenceCount}</div>
        <div class="muted">${t("overview.stats.instancesHint")}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${t("overview.stats.sessions")}</div>
        <div class="stat-value">${props.sessionsCount ?? t("common.na")}</div>
        <div class="muted">${t("overview.stats.sessionsHint")}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${t("overview.stats.cron")}</div>
        <div class="stat-value">
          ${props.cronEnabled == null ? t("common.na") : props.cronEnabled ? t("common.enabled") : t("common.disabled")}
        </div>
        <div class="muted">${t("overview.stats.cronNext", { time: formatNextRun(props.cronNext) })}</div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${t("overview.notes.title")}</div>
      <div class="card-sub">${t("overview.notes.subtitle")}</div>
      <div class="note-grid" style="margin-top: 14px;">
        <div>
          <div class="note-title">${t("overview.notes.tailscaleTitle")}</div>
          <div class="muted">
            ${t("overview.notes.tailscaleText")}
          </div>
        </div>
        <div>
          <div class="note-title">${t("overview.notes.sessionTitle")}</div>
          <div class="muted">${t("overview.notes.sessionText")}</div>
        </div>
        <div>
          <div class="note-title">${t("overview.notes.cronTitle")}</div>
          <div class="muted">${t("overview.notes.cronText")}</div>
        </div>
      </div>
    </section>
  `;
}
