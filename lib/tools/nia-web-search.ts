import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  query: Type.String({ description: "The question or topic to search the web for." }),
});

export const niaWebSearchTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-web-search",
  label: "NIA Web Search",
  description: `Search the web via Nia / AgentSearch. Use for recent events, breaking changes, or topics not in indexed sources. Prefer \`nia-search\` (indexed sources) over web search whenever possible.`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const output = await runNia(["search", "web", params.query]);
    return toToolResult(output);
  },
};
