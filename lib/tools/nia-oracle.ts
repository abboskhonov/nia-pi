import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { createOracleJob } from "../api";
import { toToolResult } from "../result";
import {
  ORACLE_TITLE,
  ORACLE_DESCRIPTION,
  ORACLE_QUERY_DESCRIPTION,
} from "../prompts";

const Params = Type.Object({
  query: Type.String({ description: ORACLE_QUERY_DESCRIPTION }),
});

export const niaOracleTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-oracle",
  label: ORACLE_TITLE,
  description: ORACLE_DESCRIPTION,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const response = await createOracleJob({ query: params.query });
    if (response.error) {
      return toToolResult(response.error);
    }

    let text = `Oracle research job created.`;
    if (response.job_id) {
      text += `\n- Job ID: \`${response.job_id}\``;
    }
    if (response.status) {
      text += `\n- Status: ${response.status}`;
    }
    if (response.result) {
      text += `\n\n**Result:**\n${response.result}`;
    } else {
      text += `\n\nThe job is now running. Results will be available shortly. You can ask the user to wait a moment and then follow up, or the job may complete asynchronously.`;
    }

    return toToolResult(text);
  },
};
