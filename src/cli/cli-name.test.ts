import { describe, expect, it } from "vitest";
import { replaceCliName, resolveCliName } from "./cli-name.js";

describe("resolveCliName", () => {
  it("defaults to soulclaw when argv does not expose a known binary name", () => {
    expect(resolveCliName(["node", "/tmp/vitest.mjs", "status"])).toBe("soulclaw");
  });

  it.each([
    ["openclaw", "openclaw"],
    ["openclaw.mjs", "openclaw"],
    ["openclaw.cmd", "openclaw"],
    ["OPENCLAW.PS1", "openclaw"],
    ["soulclaw", "soulclaw"],
    ["soulclaw.mjs", "soulclaw"],
    ["soulclaw.cmd", "soulclaw"],
    ["SOULCLAW.EXE", "soulclaw"],
  ])("recognizes wrapper name %s", (entrypoint, expected) => {
    expect(resolveCliName(["node", `C:/bin/${entrypoint}`, "status"])).toBe(expected);
  });
});

describe("replaceCliName", () => {
  it("rewrites openclaw-prefixed commands to soulclaw by default", () => {
    expect(replaceCliName("openclaw doctor", "soulclaw")).toBe("soulclaw doctor");
    expect(replaceCliName("pnpm openclaw doctor", "soulclaw")).toBe("pnpm soulclaw doctor");
  });

  it("preserves explicit compatibility output when openclaw is requested", () => {
    expect(replaceCliName("soulclaw doctor", "openclaw")).toBe("openclaw doctor");
    expect(replaceCliName("pnpm soulclaw doctor", "openclaw")).toBe("pnpm openclaw doctor");
  });
});
