#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { getFormattedSoulBondStatus } from "../src/soulbond/status.js";

function parseArgs(argv: string[]) {
  const stateArg = argv.find((arg) => arg.startsWith("--state="));
  const statePath = stateArg
    ? path.resolve(stateArg.slice("--state=".length))
    : path.resolve(process.cwd(), ".artifacts", "soulbond", "state.json");

  return { statePath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const text = await getFormattedSoulBondStatus(args.statePath);
  process.stdout.write(text + "\n");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`SoulBond status failed: ${message}\n`);
  process.exitCode = 1;
});
