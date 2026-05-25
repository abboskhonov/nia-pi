import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { getSourceContent } from "../api";
import { toToolResult } from "../result";
import {
  READ_TITLE,
  READ_DESCRIPTION,
  READ_SOURCE_ID_DESCRIPTION,
  READ_PATH_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({
  sourceId: Type.String({ description: READ_SOURCE_ID_DESCRIPTION }),
  path: Type.Optional(Type.String({ description: READ_PATH_DESCRIPTION })),
});

export const niaReadTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-read",
  label: READ_TITLE,
  description: READ_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const response = await getSourceContent(params.sourceId, params.path);
    if (response.error) {
      return toToolResult(response.error);
    }
    if (!response.content) {
      return toToolResult("No content returned. The file may be empty or the path may not exist.");
    }
    return toToolResult(response.content);
  },
};
