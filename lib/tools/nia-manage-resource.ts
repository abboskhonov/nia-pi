import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  action: Type.Union([
    Type.Literal("list"),
    Type.Literal("status"),
    Type.Literal("sync"),
    Type.Literal("delete"),
  ], { description: 'Action: "list", "status", "sync", or "delete".' }),
  sourceId: Type.Optional(Type.String({ description: "Source ID, display name, or identifier. Required for status, sync, and delete." })),
  query: Type.Optional(Type.String({ description: 'Optional filter keyword for list (e.g., "react", "stripe", "docs").' })),
});

export const niaManageResourceTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-manage-resource",
  label: "Manage NIA Resource",
  description: `Manage indexed sources in Nia / AgentSearch: list, check status, sync, or delete.

Use this tool FIRST before indexing a new source. Many sources may already be indexed.

When listing, use a targeted \`query\` keyword to save tokens — users can have many sources indexed.`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    if (params.action === "list") {
      const args = ["sources", "list"];
      if (params.query) args.push("--query", params.query);
      const output = await runNia(args);
      return toToolResult(output);
    }

    if (!params.sourceId) {
      return toToolResult("`sourceId` is required for status, sync, and delete actions.");
    }

    if (params.action === "status") {
      const output = await runNia(["sources", "get", params.sourceId]);
      return toToolResult(output);
    }

    if (params.action === "sync") {
      const output = await runNia(["sources", "sync", params.sourceId]);
      return toToolResult(output);
    }

    if (params.action === "delete") {
      const output = await runNia(["sources", "delete", params.sourceId]);
      return toToolResult(output);
    }

    return toToolResult("Unknown action.");
  },
};
