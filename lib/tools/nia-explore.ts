import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { getSourceTree } from "../api";
import { formatTree } from "../format";
import { toToolResult } from "../result";
import {
  EXPLORE_TITLE,
  EXPLORE_DESCRIPTION,
  EXPLORE_SOURCE_ID_DESCRIPTION,
  EXPLORE_PATH_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({
  sourceId: Type.String({ description: EXPLORE_SOURCE_ID_DESCRIPTION }),
  path: Type.Optional(Type.String({ description: EXPLORE_PATH_DESCRIPTION })),
});

export const niaExploreTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-explore",
  label: EXPLORE_TITLE,
  description: EXPLORE_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const response = await getSourceTree(params.sourceId, params.path);
    if (response.error) {
      return toToolResult(response.error);
    }
    if (!response.tree || response.tree.length === 0) {
      return toToolResult("No files found. The path may be empty or not exist.");
    }
    const treeText = formatTree(response.tree);
    return toToolResult(`File tree for \`${params.sourceId}\`${params.path ? ` (path: ${params.path})` : ""}:\n\n${treeText}`);
  },
};
