#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import {
  auditInteractionSummaryFromTranscript,
  buildInteractionSummaryFromTranscript,
} from "../src/soulbond/transcript.js";

function parseArgs(argv: string[]) {
  const sessionArg = argv.find((arg) => arg.startsWith("--session="));
  const tzArg = argv.find((arg) => arg.startsWith("--tz="));
  const nowArg = argv.find((arg) => arg.startsWith("--now="));
  const explain = argv.includes("--explain");

  if (!sessionArg) {
    throw new Error("--session=<path> is required");
  }

  const transcriptPath = path.resolve(sessionArg.slice("--session=".length));
  const timeZone = tzArg ? tzArg.slice("--tz=".length) : undefined;
  const nowRaw = nowArg ? nowArg.slice("--now=".length) : undefined;
  const now = nowRaw ? new Date(nowRaw) : undefined;

  if (now && Number.isNaN(now.getTime())) {
    throw new Error(`invalid --now value: ${nowRaw}`);
  }

  return { transcriptPath, timeZone, now, explain };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = args.explain
    ? await auditInteractionSummaryFromTranscript({
        transcriptPath: args.transcriptPath,
        timeZone: args.timeZone,
        now: args.now,
      })
    : await buildInteractionSummaryFromTranscript({
        transcriptPath: args.transcriptPath,
        timeZone: args.timeZone,
        now: args.now,
      });
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`SoulBond summary build failed: ${message}\n`);
  process.exitCode = 1;
});
