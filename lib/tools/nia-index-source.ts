import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { indexSource } from "../api";
import { formatSource } from "../format";
import { toToolResult } from "../result";
import {
  INDEX_SOURCE_TITLE,
  INDEX_SOURCE_DESCRIPTION,
  INDEX_SOURCE_TYPE_DESCRIPTION,
  INDEX_SOURCE_IDENTIFIER_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({
  type: Type.Union([
    Type.Literal("repository"),
    Type.Literal("documentation"),
    Type.Literal("research_paper"),
    Type.Literal("huggingface_dataset"),
  ], { description: INDEX_SOURCE_TYPE_DESCRIPTION }),
  identifier: Type.String({ description: INDEX_SOURCE_IDENTIFIER_DESCRIPTION }),
});

export const niaIndexSourceTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-index-source",
  label: INDEX_SOURCE_TITLE,
  description: INDEX_SOURCE_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const body: {
      type: string;
      repository?: string;
      url?: string;
      paper?: string;
      dataset?: string;
    } = { type: params.type };

    if (params.type === "repository") {
      body.repository = params.identifier;
    } else if (params.type === "documentation") {
      body.url = params.identifier;
    } else if (params.type === "research_paper") {
      body.paper = params.identifier;
    } else if (params.type === "huggingface_dataset") {
      body.dataset = params.identifier;
    }

    const response = await indexSource(body);
    if (response.error) {
      return toToolResult(response.error);
    }
    if (!response.source) {
      return toToolResult("Indexing request accepted but no source details were returned.");
    }
    return toToolResult(
      `Source indexed successfully:\n\n${formatSource(response.source)}\n\nIndexing may take 1-5 minutes. The source will be searchable once its status is "ready".`
    );
  },
};
