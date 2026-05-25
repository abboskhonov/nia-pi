import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { search } from "../api";
import { toToolResult } from "../result";
import {
  WEB_SEARCH_TITLE,
  WEB_SEARCH_DESCRIPTION,
  WEB_SEARCH_QUERY_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({
  query: Type.String({ description: WEB_SEARCH_QUERY_DESCRIPTION }),
});

export const niaWebSearchTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-web-search",
  label: WEB_SEARCH_TITLE,
  description: WEB_SEARCH_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const body = {
      mode: "web" as const,
      query: params.query,
    };

    const response = await search(body);
    if (response.error) {
      return toToolResult(response.error);
    }

    const result = response.results;
    if (!result) {
      return toToolResult("No web search results returned from NIA.");
    }

    let text = result.content;
    if (result.sources && result.sources.length > 0) {
      text += "\n\n**Sources found:**\n";
      for (const src of result.sources) {
        text += `\n- ${src.display_name}${src.url ? ` — ${src.url}` : ""}`;
      }
    }

    return toToolResult(text);
  },
};
