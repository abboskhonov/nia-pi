import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  query: Type.String({ description: "The question or task. Be specific." }),
  repositories: Type.Optional(Type.Array(Type.String(), { description: 'Optional repo identifiers (e.g., ["vercel/ai"]).' })),
  dataSources: Type.Optional(Type.Array(Type.String(), { description: 'Optional data source names/IDs (e.g., ["Stripe Docs"]).' })),
  searchMode: Type.Optional(Type.Union([
    Type.Literal("unified"),
    Type.Literal("repositories"),
    Type.Literal("sources"),
  ], { description: 'Scope: "unified" (default), "repositories", or "sources".' })),
});

export const niaSearchTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-search",
  label: "Search NIA Sources",
  description: `Search across indexed Nia / AgentSearch sources for a specific question or topic.

Call \`nia-manage-resource\` first to discover available sources, then target specific ones for focused results. Omit repositories/dataSources to search everything.`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const args = ["search", "query", params.query];
    if (params.repositories && params.repositories.length > 0) {
      args.push("--repositories", params.repositories.join(","));
    }
    if (params.dataSources && params.dataSources.length > 0) {
      args.push("--data-sources", params.dataSources.join(","));
    }
    if (params.searchMode) {
      args.push("--search-mode", params.searchMode);
    }
    const output = await runNia(args);
    return toToolResult(output);
  },
};
