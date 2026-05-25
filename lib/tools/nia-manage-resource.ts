import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { listSources, getSource, syncSource, deleteSource } from "../api";
import { formatSources, formatSource } from "../format";
import { toToolResult } from "../result";
import {
  MANAGE_RESOURCE_TITLE,
  MANAGE_RESOURCE_DESCRIPTION,
  MANAGE_RESOURCE_ACTION_DESCRIPTION,
  MANAGE_RESOURCE_SOURCE_ID_DESCRIPTION,
  MANAGE_RESOURCE_QUERY_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({
  action: Type.Union([
    Type.Literal("list"),
    Type.Literal("status"),
    Type.Literal("sync"),
    Type.Literal("delete"),
  ], { description: MANAGE_RESOURCE_ACTION_DESCRIPTION }),
  sourceId: Type.Optional(Type.String({ description: MANAGE_RESOURCE_SOURCE_ID_DESCRIPTION })),
  query: Type.Optional(Type.String({ description: MANAGE_RESOURCE_QUERY_DESCRIPTION })),
});

export const niaManageResourceTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-manage-resource",
  label: MANAGE_RESOURCE_TITLE,
  description: MANAGE_RESOURCE_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    if (params.action === "list") {
      const response = await listSources();
      if (response.error) return toToolResult(response.error);
      const sources = response.sources ?? [];
      if (params.query && sources.length > 0) {
        const filtered = sources.filter(
          (s) =>
            s.display_name.toLowerCase().includes(params.query!.toLowerCase()) ||
            s.identifier.toLowerCase().includes(params.query!.toLowerCase()) ||
            s.type.toLowerCase().includes(params.query!.toLowerCase())
        );
        return toToolResult(formatSources(filtered));
      }
      return toToolResult(formatSources(sources));
    }

    if (!params.sourceId) {
      return toToolResult("`sourceId` is required for status, sync, and delete actions.");
    }

    if (params.action === "status") {
      const response = await getSource(params.sourceId);
      if (response.error) return toToolResult(response.error);
      if (!response.source) return toToolResult("Source not found.");
      return toToolResult(formatSource(response.source));
    }

    if (params.action === "sync") {
      const response = await syncSource(params.sourceId);
      if (response.error) return toToolResult(response.error);
      if (!response.source) return toToolResult("Sync initiated but no source details returned.");
      return toToolResult(`Sync initiated for **${response.source.display_name}**.\n\nCurrent status: ${response.source.status}`);
    }

    if (params.action === "delete") {
      const response = await deleteSource(params.sourceId);
      if (response.error) return toToolResult(response.error);
      return toToolResult(`Source \`${params.sourceId}\` deleted successfully.`);
    }

    return toToolResult("Unknown action.");
  },
};
