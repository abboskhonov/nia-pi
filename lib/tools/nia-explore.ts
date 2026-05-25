import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  sourceId: Type.String({ description: 'Source ID, display name, or identifier.' }),
  path: Type.Optional(Type.String({ description: 'Optional subdirectory path to explore.' })),
});

export const niaExploreTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-explore",
  label: "NIA Explore",
  description: `Browse the file tree of an indexed source. Lists files and directories.

Use BEFORE \`nia-read\` or \`nia-grep\` to understand the structure and choose the right files.`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const args = params.path
      ? ["sources", "tree", params.sourceId, params.path]
      : ["sources", "tree", params.sourceId];
    const output = await runNia(args);
    return toToolResult(output);
  },
};
