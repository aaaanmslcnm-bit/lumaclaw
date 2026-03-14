import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

export type SoulBondStatusCardToneMode = "mapped" | "fixed";
export type SoulBondStatusCardSource = "runtime" | "preview";

export interface SoulBondStatusCardModel {
  bond: number;
  bondProgress: number;
  stage: string;
  tone: string;
  toneMode: SoulBondStatusCardToneMode;
  toneModeHint: string;
  latestDailyResult: string;
  latestDailyDelta?: string;
  guidance: string;
  source: SoulBondStatusCardSource;
  sourceHint: string;
}

function resolveToneClass(tone: string): string {
  switch (tone.trim().toLowerCase()) {
    case "warm":
      return "metric--warm";
    case "natural":
      return "metric--natural";
    default:
      return "metric--reserved";
  }
}

function resolveDeltaClass(delta?: string): string {
  if (!delta) {
    return "";
  }
  if (delta.startsWith("+")) {
    return "delta-chip--positive";
  }
  if (delta.startsWith("-")) {
    return "delta-chip--negative";
  }
  return "delta-chip--neutral";
}

@customElement("soulbond-status-card")
export class SoulBondStatusCard extends LitElement {
  @property({ attribute: false }) model: SoulBondStatusCardModel | null = null;

  static styles = css`
    :host {
      display: block;
    }

    .card-shell {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border, #27272a);
      border-radius: 18px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 36%),
        linear-gradient(135deg, rgba(255, 92, 92, 0.08), transparent 48%),
        var(--card, #181b22);
      padding: 20px;
      box-shadow:
        var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.2)),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .card-shell::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at top right, rgba(255, 92, 92, 0.14), transparent 34%),
        radial-gradient(circle at bottom left, rgba(20, 184, 166, 0.12), transparent 28%);
    }

    .header,
    .badges,
    .metrics,
    .details {
      position: relative;
      z-index: 1;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted, #71717a);
    }

    .title {
      margin-top: 6px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--text-strong, #fafafa);
    }

    .subtitle {
      margin-top: 6px;
      max-width: 58ch;
      color: var(--muted, #71717a);
      font-size: 13px;
      line-height: 1.5;
    }

    .badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 30px;
      padding: 0 10px;
      border-radius: 999px;
      border: 1px solid var(--border, #27272a);
      background: rgba(255, 255, 255, 0.03);
      color: var(--text, #e4e4e7);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }

    .badge--runtime {
      border-color: rgba(34, 197, 94, 0.24);
      background: rgba(34, 197, 94, 0.12);
      color: var(--ok, #22c55e);
    }

    .badge--preview {
      border-color: rgba(59, 130, 246, 0.22);
      background: rgba(59, 130, 246, 0.12);
      color: var(--info, #3b82f6);
    }

    .metrics {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 16px;
    }

    .metric {
      min-width: 0;
      border: 1px solid var(--border, #27272a);
      border-radius: 16px;
      padding: 14px 16px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 60%),
        var(--bg-elevated, #1a1d25);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    .metric--bond {
      background:
        linear-gradient(135deg, rgba(255, 92, 92, 0.14), transparent 54%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 60%),
        var(--bg-elevated, #1a1d25);
    }

    .metric--warm {
      background:
        linear-gradient(135deg, rgba(255, 92, 92, 0.12), transparent 54%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 60%),
        var(--bg-elevated, #1a1d25);
    }

    .metric--natural {
      background:
        linear-gradient(135deg, rgba(20, 184, 166, 0.14), transparent 54%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 60%),
        var(--bg-elevated, #1a1d25);
    }

    .metric--reserved {
      background:
        linear-gradient(135deg, rgba(113, 113, 122, 0.18), transparent 54%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 60%),
        var(--bg-elevated, #1a1d25);
    }

    .metric-label,
    .detail-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted, #71717a);
    }

    .metric-value {
      margin-top: 8px;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.05;
      color: var(--text-strong, #fafafa);
    }

    .metric-value--bond {
      font-size: 34px;
    }

    .metric-note {
      margin-top: 8px;
      color: var(--muted, #71717a);
      font-size: 12px;
      line-height: 1.45;
    }

    .bond-rail {
      margin-top: 14px;
      height: 6px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
    }

    .bond-fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--accent, #ff5c5c), var(--accent-hover, #ff7070));
      box-shadow: 0 0 18px rgba(255, 92, 92, 0.28);
    }

    .details {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
      gap: 12px;
      margin-top: 12px;
    }

    .detail-card {
      min-width: 0;
      border: 1px solid var(--border, #27272a);
      border-radius: 16px;
      padding: 14px 16px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 60%),
        var(--card, #181b22);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
    }

    .detail-card--guidance {
      background:
        linear-gradient(135deg, rgba(20, 184, 166, 0.08), transparent 50%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 60%),
        var(--card, #181b22);
    }

    .detail-card--source {
      background:
        linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent 50%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 60%),
        var(--card, #181b22);
    }

    .detail-copy {
      margin-top: 8px;
      color: var(--text, #e4e4e7);
      font-size: 14px;
      line-height: 1.55;
    }

    .source-state {
      margin-top: 8px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text-strong, #fafafa);
    }

    .delta-chip {
      display: inline-flex;
      align-items: center;
      margin-top: 10px;
      min-height: 28px;
      padding: 0 10px;
      border-radius: 999px;
      border: 1px solid var(--border, #27272a);
      background: rgba(255, 255, 255, 0.03);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .delta-chip--positive {
      border-color: rgba(34, 197, 94, 0.24);
      background: rgba(34, 197, 94, 0.12);
      color: var(--ok, #22c55e);
    }

    .delta-chip--negative {
      border-color: rgba(239, 68, 68, 0.24);
      background: rgba(239, 68, 68, 0.12);
      color: var(--danger, #ef4444);
    }

    .delta-chip--neutral {
      color: var(--muted, #71717a);
    }

    @media (max-width: 980px) {
      .metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .details {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @media (max-width: 640px) {
      .card-shell {
        padding: 16px;
      }

      .header {
        flex-direction: column;
      }

      .badges {
        justify-content: flex-start;
      }

      .metrics {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `;

  render() {
    const model = this.model;
    if (!model) {
      return nothing;
    }
    const sourceBadgeClass = model.source === "runtime" ? "badge--runtime" : "badge--preview";
    const sourceLabel = model.source === "runtime" ? "Runtime state" : "Preview state";
    const toneClass = resolveToneClass(model.tone);
    const deltaClass = resolveDeltaClass(model.latestDailyDelta);

    return html`
      <section class="card-shell">
        <div class="header">
          <div>
            <div class="eyebrow">SoulBond status</div>
            <div class="title">Relationship state at a glance</div>
            <div class="subtitle">
              Current bond, stage, tone behavior, and the latest daily result in one place.
            </div>
          </div>
          <div class="badges">
            <span class="badge ${sourceBadgeClass}">${sourceLabel}</span>
          </div>
        </div>

        <div class="metrics">
          <div class="metric metric--bond">
            <div class="metric-label">Current bond</div>
            <div class="metric-value metric-value--bond">${model.bond}</div>
            <div class="metric-note">Relationship score across the current SoulBond state.</div>
            <div class="bond-rail" aria-hidden="true">
              <div class="bond-fill" style=${`width: ${model.bondProgress}%`}></div>
            </div>
          </div>

          <div class="metric">
            <div class="metric-label">Current stage</div>
            <div class="metric-value">${model.stage}</div>
          </div>

          <div class="metric ${toneClass}">
            <div class="metric-label">Current tone</div>
            <div class="metric-value">${model.tone}</div>
          </div>

          <div class="metric">
            <div class="metric-label">Tone behavior</div>
            <div class="metric-value">${model.toneMode === "mapped" ? "Mapped" : "Fixed"}</div>
            <div class="metric-note">${model.toneModeHint}</div>
          </div>
        </div>

        <div class="details">
          <div class="detail-card">
            <div class="detail-label">Latest daily result</div>
            <div class="detail-copy">${model.latestDailyResult}</div>
            ${
              model.latestDailyDelta
                ? html`<span class="delta-chip ${deltaClass}">${model.latestDailyDelta}</span>`
                : nothing
            }
          </div>

          <div class="detail-card detail-card--guidance">
            <div class="detail-label">Guidance</div>
            <div class="detail-copy">${model.guidance}</div>
          </div>

          <div class="detail-card detail-card--source">
            <div class="detail-label">Source state</div>
            <div class="source-state">${sourceLabel}</div>
            <div class="detail-copy">${model.sourceHint}</div>
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "soulbond-status-card": SoulBondStatusCard;
  }
}
