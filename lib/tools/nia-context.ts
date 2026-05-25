import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  action: Type.Union([
    Type.Literal("save"),
    Type.Literal("list"),
  ], { description: 'Action: "save" to store context, or "list" to view saved contexts.' }),
  title: Type.Optional(Type.String({ description: "Title (required for save)." })),
  summary: Type.Optional(Type.String({ description: "Short summary (required for save)." })),
  content: Type.Optional(Type.String({ description: "Full content / detailed findings (required for save)." })),
  tags: Type.Optional(Type.Array(Type.String(), { description: 'Optional tags (e.g., ["react", "auth"]).' })),
});

export const niaContextTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-context",
  label: "NIA Context",
  description: `Save or list research context for cross-agent sharing. Enables session handoff: finish planning in one agent, pick up execution in another without losing the thread.`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    if (params.action === "save") {
      if (!params.title || !params.summary || !params.content) {
        return toToolResult("`title`, `summary`, and `content` are required for save.");
      }
      const args = ["contexts", "save", params.title, params.summary, params.content];
      if (params.tags && params.tags.length > 0) {
        args.push("--tags", params.tags.join(","));
      }
      const output = await runNia(args);
      return toToolResult(output);
    }

    if (params.action === "list") {
      const output = await runNia(["contexts", "list"]);
      return toToolResult(output);
    }

    return toToolResult("Unknown action.");
  },
};
