import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  type: Type.Union([
    Type.Literal("repository"),
    Type.Literal("documentation"),
    Type.Literal("research_paper"),
    Type.Literal("huggingface_dataset"),
  ], { description: 'Source type: "repository", "documentation", "research_paper", or "huggingface_dataset".' }),
  identifier: Type.String({ description: 'Identifier. Repos: "owner/repo". Docs: URL. Papers: arXiv ID. Datasets: name.' }),
});

export const niaIndexSourceTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-index-source",
  label: "Index Source with NIA",
  description: `Index a new source with Nia / AgentSearch so it becomes searchable.

Supported types:
- repository: GitHub repo in "owner/repo" format (e.g., "vercel/ai")
- documentation: Documentation URL (e.g., "https://docs.stripe.com")
- research_paper: arXiv ID or URL (e.g., "2312.00752")
- huggingface_dataset: Dataset name (e.g., "squad")

Indexing takes 1-5 minutes. The source will be searchable once its status is "ready".`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    let args: string[];
    switch (params.type) {
      case "repository":
        args = ["repos", "index", params.identifier];
        break;
      case "documentation":
        args = ["sources", "index", params.identifier];
        break;
      case "research_paper":
        args = ["papers", "index", params.identifier];
        break;
      case "huggingface_dataset":
        args = ["datasets", "index", params.identifier];
        break;
      default:
        return toToolResult(`Unsupported source type: ${params.type}`);
    }
    const output = await runNia(args);
    return toToolResult(output);
  },
};
