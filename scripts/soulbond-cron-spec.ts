#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { createSoulBondDailyCronJob } from "../src/soulbond/cron-job.js";

function parseArgs(argv: string[]) {
  const stateArg = argv.find((arg) => arg.startsWith("--state="));
  const tzArg = argv.find((arg) => arg.startsWith("--tz="));

  const statePath = stateArg
    ? path.resolve(stateArg.slice("--state=".length))
    : path.resolve(process.cwd(), ".artifacts", "soulbond", "state.json");

  const timeZone = tzArg ? tzArg.slice("--tz=".length) : undefined;

  return { statePath, timeZone };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cronJob = createSoulBondDailyCronJob({
    statePath: args.statePath,
    timeZone: args.timeZone,
  });

  process.stdout.write(JSON.stringify(cronJob, null, 2) + "\n");
}

main();
