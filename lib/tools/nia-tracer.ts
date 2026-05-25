import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  query: Type.String({ description: "Search question for the GitHub repo." }),
  repository: Type.String({ description: 'GitHub repo in "owner/repo" format (e.g., "vercel/ai").' }),
  action: Type.Optional(Type.Union([
    Type.Literal("create"),
    Type.Literal("status"),
  ], { description: 'Action: "create" (default) to start a Tracer job, or "status" to check a job.' })),
  jobId: Type.Optional(Type.String({ description: "Job ID. Required for status action." })),
});

export const niaTracerTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-tracer",
  label: "NIA Tracer",
  description: `Search GitHub repositories without indexing using Nia Tracer. An autonomous agent searches code directly via GitHub's API. Great for exploring unfamiliar repos or finding examples across codebases you haven't indexed yet.`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    const action = params.action ?? "create";

    if (action === "create") {
      const output = await runNia(["tracer", "run", params.query, params.repository]);
      return toToolResult(output);
    }

    if (action === "status") {
      if (!params.jobId) {
        return toToolResult("`jobId` is required for status action.");
      }
      const output = await runNia(["tracer", "status", params.jobId]);
      return toToolResult(output);
    }

    return toToolResult("Unknown action.");
  },
};
