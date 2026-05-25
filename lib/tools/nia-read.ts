import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  sourceId: Type.String({ description: 'Source ID, display name, or identifier (e.g., "vercel/ai").' }),
  path: Type.Optional(Type.String({ description: 'File path within the source (e.g., "src/index.ts").' })),
});

export const niaReadTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-read",
  label: "NIA Read",
  description: `Read a specific file from an indexed source. Returns full file content — not truncated like web fetch.

Use after \`nia-explore\` to understand structure, then read files you need.`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const args = params.path
      ? ["sources", "read", params.sourceId, params.path]
      : ["sources", "read", params.sourceId];
    const output = await runNia(args);
    return toToolResult(output);
  },
};
