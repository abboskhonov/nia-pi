import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { grepSource } from "../api";
import { toToolResult } from "../result";
import {
  GREP_TITLE,
  GREP_DESCRIPTION,
  GREP_SOURCE_ID_DESCRIPTION,
  GREP_PATTERN_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({
  sourceId: Type.String({ description: GREP_SOURCE_ID_DESCRIPTION }),
  pattern: Type.String({ description: GREP_PATTERN_DESCRIPTION }),
});

export const niaGrepTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-grep",
  label: GREP_TITLE,
  description: GREP_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const response = await grepSource(params.sourceId, { pattern: params.pattern });
    if (response.error) {
      return toToolResult(response.error);
    }
    if (!response.results || response.results.length === 0) {
      return toToolResult("No matches found.");
    }
    const lines = response.results.map(
      (r) => `**${r.path}:${r.line_number}**\n\`\`\`\n${r.snippet}\n\`\`\``
    );
    return toToolResult(`Found ${response.results.length} match(es):\n\n${lines.join("\n\n")}`);
  },
};
