#!/usr/bin/env node

const draftMessage = [
  "lumaclaw reset draft entrypoint",
  "",
  "This file is a review scaffold only.",
  "It exists inside reset-drafts/ so Yukino can approve or reject the minimal mainline shape",
  "before any real top-level LumaClaw entrypoint is introduced.",
].join("\n");

process.stdout.write(`${draftMessage}\n`);
