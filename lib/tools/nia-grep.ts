import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  sourceId: Type.String({ description: 'Source ID, display name, or identifier.' }),
  pattern: Type.String({ description: 'Regex pattern (e.g., "class.*Handler", "streamText").' }),
});

export const niaGrepTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-grep",
  label: "NIA Grep",
  description: `Regex search across an indexed source. Returns matching snippets with file paths and line numbers.

Use for: finding function definitions, searching patterns, locating configs, finding imports/usages.`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const output = await runNia(["sources", "grep", params.sourceId, params.pattern]);
    return toToolResult(output);
  },
};
