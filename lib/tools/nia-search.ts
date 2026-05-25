import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { search } from "../api";
import { toToolResult } from "../result";
import {
  SEARCH_TITLE,
  SEARCH_DESCRIPTION,
  SEARCH_QUERY_DESCRIPTION,
  SEARCH_REPOSITORIES_DESCRIPTION,
  SEARCH_DATA_SOURCES_DESCRIPTION,
  SEARCH_MODE_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({
  query: Type.String({ description: SEARCH_QUERY_DESCRIPTION }),
  repositories: Type.Optional(Type.Array(Type.String(), { description: SEARCH_REPOSITORIES_DESCRIPTION })),
  dataSources: Type.Optional(Type.Array(Type.String(), { description: SEARCH_DATA_SOURCES_DESCRIPTION })),
  searchMode: Type.Optional(Type.Union([
    Type.Literal("unified"),
    Type.Literal("repositories"),
    Type.Literal("sources"),
  ], { description: SEARCH_MODE_DESCRIPTION })),
});

export const niaSearchTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-search",
  label: SEARCH_TITLE,
  description: SEARCH_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const body = {
      mode: "query" as const,
      messages: [{ role: "user", content: params.query }],
      repositories: params.repositories,
      data_sources: params.dataSources,
      search_mode: params.searchMode ?? "unified",
    };

    const response = await search(body);
    if (response.error) {
      return toToolResult(response.error);
    }

    const result = response.results;
    if (!result) {
      return toToolResult("No results returned from NIA search.");
    }

    let text = result.content;
    if (result.sources && result.sources.length > 0) {
      text += "\n\n**Sources used:**\n";
      for (const src of result.sources) {
        text += `\n- ${src.display_name} (\`${src.id}\`) — ${src.type}`;
      }
    }

    return toToolResult(text);
  },
};
