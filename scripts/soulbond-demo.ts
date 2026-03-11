#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { createSoulBondDailyCronJob } from "../src/soulbond/cron-job.js";
import { runSoulBondDaily } from "../src/soulbond/run-daily.js";
import { DEFAULT_SOUL_BOND_TIMEZONE } from "../src/soulbond/schedule.js";
import { getFormattedSoulBondStatus } from "../src/soulbond/status.js";
import {
  auditInteractionSummaryFromTranscript,
  type SoulBondTranscriptEvidence,
  type SoulBondTranscriptEvidenceEntry,
} from "../src/soulbond/transcript.js";
import type { InteractionSummary } from "../src/soulbond/types.js";

type InteractionSignalKey = Exclude<keyof InteractionSummary, "date">;

type CliArgs = {
  statePath: string;
  transcriptPath: string;
  timeZone: string;
  now?: Date;
};

function readFlagValue(args: string[], flag: string): string | undefined {
  const exact = args.indexOf(flag);
  if (exact >= 0) {
    return args[exact + 1];
  }
  const inline = args.find((arg) => arg.startsWith(`${flag}=`));
  return inline ? inline.slice(flag.length + 1) : undefined;
}

function parseArgs(argv: string[]): CliArgs {
  const transcriptPathArg = readFlagValue(argv, "--session");
  if (!transcriptPathArg) {
    throw new Error("--session <path> is required");
  }

  const nowRaw = readFlagValue(argv, "--now");
  const now = nowRaw ? new Date(nowRaw) : undefined;
  if (now && Number.isNaN(now.getTime())) {
    throw new Error(`invalid --now value: ${nowRaw}`);
  }

  const statePathArg = readFlagValue(argv, "--state");
  const timeZone = readFlagValue(argv, "--tz") ?? DEFAULT_SOUL_BOND_TIMEZONE;

  return {
    statePath: statePathArg
      ? path.resolve(statePathArg)
      : path.resolve(process.cwd(), ".artifacts", "soulbond", "demo-state.json"),
    transcriptPath: path.resolve(transcriptPathArg),
    timeZone,
    now,
  };
}

const INTERACTION_SIGNAL_LABELS: Array<{
  key: InteractionSignalKey;
  label: string;
}> = [
  { key: "greetings", label: "Greetings" },
  { key: "meaningfulChats", label: "Meaningful chats" },
  { key: "completedTasks", label: "Completed tasks" },
  { key: "gratitudeMoments", label: "Gratitude moments" },
  { key: "lifeShares", label: "Life shares" },
  { key: "rudeEvents", label: "Rude moments" },
  { key: "teasingEvents", label: "Bad-faith teasing" },
  { key: "ignoredFollowUps", label: "Ignored follow-ups" },
  { key: "streakDays", label: "Streak days" },
  { key: "specialEventBonus", label: "Special event bonus" },
];

const EVIDENCE_GROUPS: Array<{
  label: string;
  entries: (evidence: SoulBondTranscriptEvidence) => SoulBondTranscriptEvidenceEntry[];
}> = [
  { label: "Greeting moments", entries: (evidence) => evidence.greetings },
  { label: "Meaningful exchanges", entries: (evidence) => evidence.meaningfulChats },
  { label: "Completed tasks", entries: (evidence) => evidence.completedTasks },
  { label: "Gratitude moments", entries: (evidence) => evidence.gratitudeMoments },
  { label: "Life shares", entries: (evidence) => evidence.lifeShares },
  { label: "Rude moments", entries: (evidence) => evidence.rudeEvents },
  { label: "Bad-faith teasing", entries: (evidence) => evidence.teasingEvents },
];

function formatInteractionSummary(summary: InteractionSummary): string[] {
  const activeSignals = INTERACTION_SIGNAL_LABELS.filter(({ key }) => summary[key] > 0);
  if (activeSignals.length === 0) {
    return ["- No notable interaction signals were detected in this session."];
  }

  return activeSignals.map(({ key, label }) => `- ${label}: ${summary[key]}`);
}

function formatEvidenceEntry(entry: SoulBondTranscriptEvidenceEntry): string {
  return `  - [${entry.timestamp}] ${entry.text}`;
}

function formatEvidenceGroup(label: string, entries: SoulBondTranscriptEvidenceEntry[]): string[] {
  const lines = [`- ${label}`];
  lines.push(...entries.map(formatEvidenceEntry));
  return lines;
}

function formatEvidence(evidence: SoulBondTranscriptEvidence): string[] {
  const activeGroups = EVIDENCE_GROUPS
    .map((group) => ({
      label: group.label,
      entries: group.entries(evidence),
    }))
    .filter((group) => group.entries.length > 0);

  if (activeGroups.length === 0) {
    return ["- No transcript highlights matched the current SoulBond signals."];
  }

  return activeGroups.flatMap((group) => formatEvidenceGroup(group.label, group.entries));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const audit = await auditInteractionSummaryFromTranscript({
    transcriptPath: args.transcriptPath,
    timeZone: args.timeZone,
    now: args.now,
  });

  const runResult = await runSoulBondDaily({
    statePath: args.statePath,
    transcriptPath: args.transcriptPath,
    timeZone: args.timeZone,
    now: args.now,
  });

  const statusText = await getFormattedSoulBondStatus(args.statePath);
  const cronJob = createSoulBondDailyCronJob({
    statePath: args.statePath,
    timeZone: args.timeZone,
  });

  const lines: string[] = [
    "SoulBond Demo",
    "",
    "1. Interaction Input",
    `- Session source: ${args.transcriptPath}`,
    `- Local day: ${audit.dateKey}`,
    `- Time zone: ${args.timeZone}`,
  ];

  if (args.now) {
    lines.push(`- Demo time: ${args.now.toISOString()}`);
  }

  lines.push(
    "Detected signals:",
    ...formatInteractionSummary(audit.summary),
    "Transcript highlights:",
    ...formatEvidence(audit.evidence),
    "",
    "2. Daily Result",
  );

  if (runResult.summaryText) {
    lines.push(`- Evaluation: completed for ${runResult.dateKey}`);
    lines.push(...runResult.summaryText.split("\n"));
  } else {
    lines.push(
      `- Evaluation: already completed for ${runResult.dateKey}`,
      "- No new score was written, so the saved relationship state stayed as-is.",
    );
  }

  lines.push(
    "",
    "3. Current Relationship State",
    statusText,
    "",
    "4. Daily Automation",
    `- ${cronJob.description}.`,
    `- Scheduled for local midnight in ${args.timeZone}.`,
  );

  process.stdout.write(lines.join("\n") + "\n");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`SoulBond demo failed: ${message}\n`);
  process.exitCode = 1;
});
