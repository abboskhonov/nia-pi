import { Type, type Static } from "typebox";
import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { runNia } from "../runner";
import { toToolResult } from "../result";

const Params = Type.Object({
  registry: Type.Union([
    Type.Literal("npm"),
    Type.Literal("py_pi"),
    Type.Literal("crates_io"),
    Type.Literal("golang_proxy"),
  ], { description: 'Registry: "npm", "py_pi", "crates_io", or "golang_proxy".' }),
  packageName: Type.String({ description: 'Package name (e.g., "react", "fastapi").' }),
  semanticQuery: Type.Optional(Type.String({ description: 'Semantic query (e.g., "How does dependency injection work?"). Provide this OR pattern.' })),
  pattern: Type.Optional(Type.String({ description: 'Regex pattern for exact code search (e.g., "streamText"). Provide this OR semanticQuery.' })),
});

export const niaPackageSearchTool: ToolDefinition<typeof Params, undefined> = {
  name: "nia-package-search",
  label: "NIA Package Search",
  description: `Search source code of public packages across npm, PyPI, Crates.io, and Go modules. No indexing required.

Use for: how a function works, internal implementation details, API signatures, code examples.`,
  parameters: Params,
  async execute(_toolCallId: string, params: Static<typeof Params>) {
    let args: string[];
    if (params.semanticQuery) {
      args = ["packages", "search", params.registry, params.packageName, params.semanticQuery];
    } else if (params.pattern) {
      args = ["packages", "grep", params.registry, params.packageName, params.pattern];
    } else {
      return toToolResult("Provide either `semanticQuery` or `pattern`.");
    }
    const output = await runNia(args);
    return toToolResult(output);
  },
};
