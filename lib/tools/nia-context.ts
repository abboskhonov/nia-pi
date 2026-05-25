import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { saveContext, listContexts } from "../api";
import { toToolResult } from "../result";
import {
  CONTEXT_TITLE,
  CONTEXT_DESCRIPTION,
  CONTEXT_ACTION_DESCRIPTION,
  CONTEXT_TITLE_DESCRIPTION,
  CONTEXT_SUMMARY_DESCRIPTION,
  CONTEXT_CONTENT_DESCRIPTION,
  CONTEXT_TAGS_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({
  action: Type.Union([
    Type.Literal("save"),
    Type.Literal("list"),
  ], { description: CONTEXT_ACTION_DESCRIPTION }),
  title: Type.Optional(Type.String({ description: CONTEXT_TITLE_DESCRIPTION })),
  summary: Type.Optional(Type.String({ description: CONTEXT_SUMMARY_DESCRIPTION })),
  content: Type.Optional(Type.String({ description: CONTEXT_CONTENT_DESCRIPTION })),
  tags: Type.Optional(Type.Array(Type.String(), { description: CONTEXT_TAGS_DESCRIPTION })),
});

export const niaContextTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-context",
  label: CONTEXT_TITLE,
  description: CONTEXT_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    if (params.action === "save") {
      if (!params.title || !params.summary || !params.content) {
        return toToolResult("`title`, `summary`, and `content` are required for save action.");
      }
      const response = await saveContext({
        title: params.title,
        summary: params.summary,
        content: params.content,
        agent_source: "pi",
        tags: params.tags,
      });
      if (response.error) return toToolResult(response.error);
      if (!response.context) return toToolResult("Context saved but no ID returned.");
      return toToolResult(`Context saved.\n- ID: \`${response.context.id}\`\n- Title: ${response.context.title}`);
    }

    if (params.action === "list") {
      const response = await listContexts();
      if (response.error) return toToolResult(response.error);
      if (!response.contexts || response.contexts.length === 0) {
        return toToolResult("No saved contexts found.");
      }
      const lines = response.contexts.map(
        (c) => `- **${c.title}** (\`${c.id}\`)${c.tags?.length ? ` [${c.tags.join(", ")}]` : ""}\n  ${c.summary}`
      );
      return toToolResult(`Saved contexts (${response.contexts.length}):\n\n${lines.join("\n\n")}`);
    }

    return toToolResult("Unknown action.");
  },
};
