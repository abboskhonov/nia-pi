import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { listSources } from "../api";
import { formatSources } from "../format";
import { toToolResult } from "../result";
import {
  LIST_SOURCES_TITLE,
  LIST_SOURCES_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({});

export const niaListSourcesTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-list-sources",
  label: LIST_SOURCES_TITLE,
  description: LIST_SOURCES_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, _params: Static<typeof Params>) {
    const response = await listSources();
    if (response.error) {
      return toToolResult(response.error);
    }
    const sources = response.sources ?? [];
    return toToolResult(formatSources(sources));
  },
};
