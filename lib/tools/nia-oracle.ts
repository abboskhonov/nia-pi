import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  query: Type.String({ description: "Research question or topic. Be specific and descriptive." }),
});

export const niaOracleTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-oracle",
  label: "NIA Oracle Research",
  description: `Run an autonomous deep research job with Nia Oracle. Performs multi-step research with extended thinking and tool use.

Use for: complex comparisons, deep investigations, broad research questions. The Oracle runs asynchronously.`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const output = await runNia(["oracle", "create", params.query]);
    return toToolResult(output);
  },
};
