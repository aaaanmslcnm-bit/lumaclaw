import fs from "node:fs/promises";
import { stripInboundMetadata } from "../auto-reply/reply/strip-inbound-meta.js";
import { getSoulBondDateKey, DEFAULT_SOUL_BOND_TIMEZONE } from "./schedule.js";
import { createDefaultInteractionSummary, type InteractionSummary } from "./types.js";

export interface SoulBondTranscriptMessage {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface SoulBondTranscriptEvidenceEntry {
  text: string;
  timestamp: string;
}

export interface SoulBondTranscriptEvidence {
  greetings: SoulBondTranscriptEvidenceEntry[];
  meaningfulChats: SoulBondTranscriptEvidenceEntry[];
  completedTasks: SoulBondTranscriptEvidenceEntry[];
  gratitudeMoments: SoulBondTranscriptEvidenceEntry[];
  lifeShares: SoulBondTranscriptEvidenceEntry[];
  rudeEvents: SoulBondTranscriptEvidenceEntry[];
  teasingEvents: SoulBondTranscriptEvidenceEntry[];
}

export interface SoulBondTranscriptAudit {
  dateKey: string;
  summary: InteractionSummary;
  evidence: SoulBondTranscriptEvidence;
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function extractTranscriptRawText(content: unknown): string | null {
  if (typeof content === "string") {
    const trimmed = content.trim();
    return trimmed || null;
  }
  if (!Array.isArray(content)) {
    return null;
  }

  const parts: string[] = [];
  for (const block of content) {
    if (!block || typeof block !== "object") {
      continue;
    }
    const record = block as { type?: unknown; text?: unknown };
    if (record.type !== "text" || typeof record.text !== "string") {
      continue;
    }
    const text = record.text.trim();
    if (text) {
      parts.push(text);
    }
  }

  if (parts.length === 0) {
    return null;
  }

  return parts.join("\n\n");
}

function toEvidenceEntry(message: SoulBondTranscriptMessage): SoulBondTranscriptEvidenceEntry {
  return {
    text: message.text,
    timestamp: message.timestamp,
  };
}

function capEvidence(
  messages: SoulBondTranscriptMessage[],
  max: number,
): SoulBondTranscriptEvidenceEntry[] {
  return messages.slice(0, max).map(toEvidenceEntry);
}

function isSessionControlMessage(text: string): boolean {
  return /^(A new session was started via \/new or \/reset\.|Read HEARTBEAT\.md if it exists)/u.test(text);
}

// Session transcripts often wrap the real user text with metadata blocks.
// For SoulBond scoring we only want the actual user-facing message body.
export function extractVisibleConversationText(raw: string): string {
  let text = stripInboundMetadata(raw).trim();

  text = text.replace(/^\[\[[^\]]+\]\]\s*/u, "");
  text = text.replace(/^\[Queued messages while agent was busy\]\s*---\s*Queued\s*#\d+\s*/u, "");
  text = text.replace(/^\[(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s+\d{4}-\d{2}-\d{2}[^\]]*\]\s*/u, "");
  text = normalizeWhitespace(text);

  if (isSessionControlMessage(text)) {
    return "";
  }

  return text;
}

function normalizeSessionTimestamp(record: { timestamp?: unknown; message?: { timestamp?: unknown } }): string | null {
  if (typeof record.timestamp === "string" && record.timestamp.trim()) {
    return record.timestamp.trim();
  }
  const nested = record.message?.timestamp;
  if (typeof nested === "number" && Number.isFinite(nested)) {
    return new Date(nested).toISOString();
  }
  if (typeof nested === "string" && nested.trim()) {
    const parsed = Date.parse(nested);
    if (Number.isFinite(parsed)) {
      return new Date(parsed).toISOString();
    }
  }
  return null;
}

export async function loadSoulBondTranscriptMessages(params: {
  transcriptPath: string;
  dateKey: string;
  timeZone?: string;
}): Promise<SoulBondTranscriptMessage[]> {
  const raw = await fs.readFile(params.transcriptPath, "utf8");
  const timeZone = params.timeZone ?? DEFAULT_SOUL_BOND_TIMEZONE;
  const messages: SoulBondTranscriptMessage[] = [];

  for (const line of raw.split("\n")) {
    if (!line.trim()) {
      continue;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    if (!parsed || typeof parsed !== "object") {
      continue;
    }
    const record = parsed as {
      type?: unknown;
      timestamp?: unknown;
      message?: { role?: unknown; content?: unknown; timestamp?: unknown };
    };
    if (record.type !== "message") {
      continue;
    }
    const role = record.message?.role;
    if (role !== "user" && role !== "assistant") {
      continue;
    }
    const timestamp = normalizeSessionTimestamp(record);
    if (!timestamp) {
      continue;
    }
    if (getSoulBondDateKey(new Date(timestamp), timeZone) !== params.dateKey) {
      continue;
    }
    const rawText = extractTranscriptRawText(record.message?.content);
    if (!rawText) {
      continue;
    }
    const visible = extractVisibleConversationText(rawText);
    if (!visible) {
      continue;
    }
    messages.push({
      role,
      text: visible,
      timestamp,
    });
  }

  return messages;
}

function isGreeting(text: string): boolean {
  return /^(早安安|早安|早上好|晚安|午安|hello|hi|嗨|哈喽|你好)/iu.test(text);
}

function isGratitude(text: string): boolean {
  return /(谢谢(?:你)?|感谢(?:你)?|辛苦(?:了|啦)?|多谢|谢啦|谢你|麻烦你了|辛苦你了)/iu.test(text);
}

function isDirectiveLikeRequest(text: string): boolean {
  const normalized = normalizeWhitespace(text);
  return /^(做成|放到?|帮我|给我|请你|你去|你帮我|继续|查一下|看看|试试|整理一下|总结一下)/iu.test(normalized);
}

function isLifeShare(text: string): boolean {
  if (isDirectiveLikeRequest(text) && !/(我打算|我准备|我今天|我刚刚|我现在|我想|最近|我决定|我觉得|我担心|我不忍心)/iu.test(text)) {
    return false;
  }
  return /(我打算|我准备|我今天|我刚刚|我现在|我在|我想|最近|我决定|我觉得|我担心|我不忍心|今天|刚刚)/iu.test(text);
}

function isCompletion(text: string): boolean {
  const normalized = normalizeWhitespace(text);

  // Avoid treating user requests like "do this, then continue" as completed work.
  if (/(好了之后|好之后|做成.+吧|^做成|放.+桌面上吧|帮我|给我|你去|请你|麻烦你)/iu.test(normalized)) {
    return false;
  }

  if (/(我|已经|刚刚|刚|终于|现在).*(搞定了|完成了|做完了|修好了|救活了|通过了|没问题了)/iu.test(normalized)) {
    return true;
  }

  if (/(^|[，。！\s])(搞定了|完成了|做完了|修好了|救活了|通过了|没问题了)([，。！\s]|$)/iu.test(normalized)) {
    return true;
  }

  if (/(现在|已经|这下).*(可以了)/iu.test(normalized)) {
    return true;
  }

  return false;
}

function isRude(text: string): boolean {
  return /(傻逼|滚开|废物|垃圾|去死)/iu.test(text);
}

function isBadFaithTeasing(text: string): boolean {
  return /(耍你|故意整你|故意逗你|骗你的哈哈)/iu.test(text);
}

function isQuestionLikeMessage(text: string): boolean {
  return /[？?]|(怎么|怎样|为何|为什么|是不是|能不能|可不可以|行不行|要不要|改不改|支持不支持|支持吗|怎么看)/iu.test(
    text,
  );
}

function isLightweightReaction(text: string): boolean {
  const compact = text.replace(/\s+/g, "");
  if (compact.length > 12) {
    return false;
  }
  if (isQuestionLikeMessage(text) || isDirectiveLikeRequest(text) || isCompletion(text) || isLifeShare(text)) {
    return false;
  }
  return true;
}

function isMeaningfulUserMessage(text: string): boolean {
  const compact = text.replace(/\s+/g, "");
  if (compact.length < 6) {
    return false;
  }
  if (isGreeting(text) && compact.length <= 12) {
    return false;
  }
  if (isLightweightReaction(text)) {
    return false;
  }
  if (isCompletion(text) || isLifeShare(text)) {
    return true;
  }
  if (isDirectiveLikeRequest(text) || isQuestionLikeMessage(text)) {
    return compact.length >= 8;
  }
  return compact.length >= 18;
}

export function auditInteractionSummaryFromTranscriptMessages(params: {
  messages: SoulBondTranscriptMessage[];
  dateKey: string;
}): SoulBondTranscriptAudit {
  const summary = createDefaultInteractionSummary(params.dateKey);
  const userMessages = params.messages.filter((message) => message.role === "user");

  const greetingMatches = userMessages.filter((message) => isGreeting(message.text));
  const meaningfulMatches = userMessages.filter((message) => isMeaningfulUserMessage(message.text));
  const completionMatches = userMessages.filter((message) => isCompletion(message.text));
  const gratitudeMatches = userMessages.filter((message) => isGratitude(message.text));
  const lifeShareMatches = userMessages.filter((message) => isLifeShare(message.text));
  const rudeMatches = userMessages.filter((message) => isRude(message.text));
  const teasingMatches = userMessages.filter((message) => isBadFaithTeasing(message.text));

  const evidence: SoulBondTranscriptEvidence = {
    greetings: capEvidence(greetingMatches, 1),
    meaningfulChats: capEvidence(meaningfulMatches, 2),
    completedTasks: capEvidence(completionMatches, 2),
    gratitudeMoments: capEvidence(gratitudeMatches, 2),
    lifeShares: capEvidence(lifeShareMatches, 1),
    rudeEvents: capEvidence(rudeMatches, 1),
    teasingEvents: capEvidence(teasingMatches, 1),
  };

  summary.greetings = evidence.greetings.length;
  summary.meaningfulChats = evidence.meaningfulChats.length;
  summary.completedTasks = evidence.completedTasks.length;
  summary.gratitudeMoments = evidence.gratitudeMoments.length;
  summary.lifeShares = evidence.lifeShares.length;
  summary.rudeEvents = evidence.rudeEvents.length;
  summary.teasingEvents = evidence.teasingEvents.length;

  return {
    dateKey: params.dateKey,
    summary,
    evidence,
  };
}

export function buildInteractionSummaryFromTranscriptMessages(params: {
  messages: SoulBondTranscriptMessage[];
  dateKey: string;
}): InteractionSummary {
  return auditInteractionSummaryFromTranscriptMessages(params).summary;
}

export async function auditInteractionSummaryFromTranscript(params: {
  transcriptPath: string;
  now?: Date;
  timeZone?: string;
}): Promise<SoulBondTranscriptAudit> {
  const timeZone = params.timeZone ?? DEFAULT_SOUL_BOND_TIMEZONE;
  const dateKey = getSoulBondDateKey(params.now ?? new Date(), timeZone);
  const messages = await loadSoulBondTranscriptMessages({
    transcriptPath: params.transcriptPath,
    dateKey,
    timeZone,
  });
  return auditInteractionSummaryFromTranscriptMessages({ messages, dateKey });
}

export async function buildInteractionSummaryFromTranscript(params: {
  transcriptPath: string;
  now?: Date;
  timeZone?: string;
}): Promise<InteractionSummary> {
  return (await auditInteractionSummaryFromTranscript(params)).summary;
}
