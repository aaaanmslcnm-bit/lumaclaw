#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { runSoulBondDaily } from "../src/soulbond/run-daily.js";

type CliArgs = {
  statePath: string;
  transcriptPath?: string;
  timeZone?: string;
  now?: Date;
};

function readFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) {
    return undefined;
  }
  return args[index + 1];
}

function parseArgs(argv: string[]): CliArgs {
  const statePathArg = readFlagValue(argv, "--state");
  const transcriptPathArg = readFlagValue(argv, "--session");
  const timeZone = readFlagValue(argv, "--tz");
  const nowRaw = readFlagValue(argv, "--now");

  const statePath = statePathArg
    ? path.resolve(statePathArg)
    : path.resolve(process.cwd(), ".artifacts", "soulbond", "state.json");
  const transcriptPath = transcriptPathArg ? path.resolve(transcriptPathArg) : undefined;

  const now = nowRaw ? new Date(nowRaw) : undefined;
  if (now && Number.isNaN(now.getTime())) {
    throw new Error(`invalid --now value: ${nowRaw}`);
  }

  return {
    statePath,
    transcriptPath,
    timeZone,
    now,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await runSoulBondDaily({
    statePath: args.statePath,
    transcriptPath: args.transcriptPath,
    timeZone: args.timeZone,
    now: args.now,
  });

  process.stdout.write(`SoulBond status: ${result.status}\n`);
  process.stdout.write(`State path: ${args.statePath}\n`);
  process.stdout.write(`Date key: ${result.dateKey}\n`);

  if (result.summaryText) {
    process.stdout.write("\n");
    process.stdout.write(result.summaryText + "\n");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`SoulBond run failed: ${message}\n`);
  process.exitCode = 1;
});
