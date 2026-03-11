import { theme } from "../terminal/theme.js";
import { replaceCliName, resolveCliName } from "./cli-name.js";

export type HelpExample = readonly [command: string, description: string];

function normalizeHelpCommand(command: string): string {
  return replaceCliName(command, resolveCliName());
}

export function formatHelpExample(command: string, description: string): string {
  const normalized = normalizeHelpCommand(command);
  return `  ${theme.command(normalized)}\n    ${theme.muted(description)}`;
}

export function formatHelpExampleLine(command: string, description: string): string {
  const normalized = normalizeHelpCommand(command);
  if (!description) {
    return `  ${theme.command(normalized)}`;
  }
  return `  ${theme.command(normalized)} ${theme.muted(`# ${description}`)}`;
}

export function formatHelpExamples(examples: ReadonlyArray<HelpExample>, inline = false): string {
  const formatter = inline ? formatHelpExampleLine : formatHelpExample;
  return examples.map(([command, description]) => formatter(command, description)).join("\n");
}

export function formatHelpExampleGroup(
  label: string,
  examples: ReadonlyArray<HelpExample>,
  inline = false,
) {
  return `${theme.muted(label)}\n${formatHelpExamples(examples, inline)}`;
}
