import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({});

export const niaUsageTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-usage",
  label: "NIA Usage",
  description: `Check Nia / AgentSearch API usage and limits (queries, indexing, oracle, etc.).`,
  parameters: Params,
  async execute(_toolCallId: string, _params: Static<typeof Params>) {
    const output = await runNia(["usage"]);
    return toToolResult(output);
  },
};
