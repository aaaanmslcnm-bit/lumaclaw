#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const scriptMap = {
  status: path.join(repoRoot, "scripts", "soulbond-status.ts"),
  demo: path.join(repoRoot, "scripts", "soulbond-demo.ts"),
  "run-daily": path.join(repoRoot, "scripts", "soulbond-run-daily.ts"),
  "cron-spec": path.join(repoRoot, "scripts", "soulbond-cron-spec.ts"),
  "build-summary": path.join(repoRoot, "scripts", "soulbond-build-summary.ts"),
};

function printHelp() {
  process.stdout.write(
    [
      "LumaClaw reset mainline CLI",
      "",
      "Available commands:",
      "  lumaclaw status [--state=path]",
      "  lumaclaw demo [--state <path> --session <jsonl> ...]",
      "  lumaclaw run-daily [args]",
      "  lumaclaw cron-spec [args]",
      "  lumaclaw build-summary [args]",
    ].join("\n") + "\n",
  );
}

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === "help" || args[0] === "--help" || args[0] === "-h") {
  printHelp();
  process.exit(0);
}

let command = args[0];
let forwardArgs = args.slice(1);
if (command === "soulbond") {
  command = args[1] ?? "help";
  forwardArgs = args.slice(2);
}

const scriptPath = scriptMap[command];
if (!scriptPath) {
  process.stderr.write(`Unknown command: ${command}\n\n`);
  printHelp();
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--import", "tsx", scriptPath, ...forwardArgs], {
  stdio: "inherit",
  cwd: repoRoot,
});

if (typeof result.status === "number") {
  process.exit(result.status);
}
process.exit(1);
