import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { packageSearch } from "../api";
import { formatPackageResults } from "../format";
import { toToolResult } from "../result";
import {
  PACKAGE_SEARCH_TITLE,
  PACKAGE_SEARCH_DESCRIPTION,
  PACKAGE_SEARCH_REGISTRY_DESCRIPTION,
  PACKAGE_SEARCH_PACKAGE_NAME_DESCRIPTION,
  PACKAGE_SEARCH_SEMANTIC_DESCRIPTION,
  PACKAGE_SEARCH_PATTERN_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({
  registry: Type.Union([
    Type.Literal("npm"),
    Type.Literal("py_pi"),
    Type.Literal("crates_io"),
    Type.Literal("golang_proxy"),
  ], { description: PACKAGE_SEARCH_REGISTRY_DESCRIPTION }),
  packageName: Type.String({ description: PACKAGE_SEARCH_PACKAGE_NAME_DESCRIPTION }),
  semanticQuery: Type.Optional(Type.String({ description: PACKAGE_SEARCH_SEMANTIC_DESCRIPTION })),
  pattern: Type.Optional(Type.String({ description: PACKAGE_SEARCH_PATTERN_DESCRIPTION })),
});

export const niaPackageSearchTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-package-search",
  label: PACKAGE_SEARCH_TITLE,
  description: PACKAGE_SEARCH_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const body: {
      registry: string;
      package_name: string;
      semantic_queries?: string[];
      pattern?: string;
    } = {
      registry: params.registry,
      package_name: params.packageName,
    };

    if (params.semanticQuery) {
      body.semantic_queries = [params.semanticQuery];
    }
    if (params.pattern) {
      body.pattern = params.pattern;
    }

    const response = await packageSearch(body);
    if (response.error) {
      return toToolResult(response.error);
    }

    return toToolResult(formatPackageResults(response));
  },
};
