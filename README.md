# nia-pi

[Nia](https://trynia.ai) / [AgentSearch](https://agentsearch.sh) extension for the [pi coding agent](https://pi.dev).

Brings the full Nia MCP toolset to pi as native extension tools — no MCP required. Index and search code repositories, documentation, research papers, and packages with up-to-date, hallucination-free context.

## Install

```bash
pi install npm:nia-pi
# or from GitHub:
pi install git:github.com/abboskhonov/nia-pi
```

## Authenticate

The extension auto-discovers your Nia API key from (in order):

1. `NIA_API_KEY` environment variable
2. `~/.config/nia/config.json` (from `nia auth login`)
3. `~/.config/nia/api_key` (raw key file)

Get a key at [app.trynia.ai](https://app.trynia.ai) if you don't have one.

## What it adds

| Tool | Purpose | MCP equivalent |
|------|---------|----------------|
| `nia-manage-resource` | List, status, sync, delete indexed sources | `manage_resource` |
| `nia-index-source` | Index a new repo, doc URL, paper, or dataset | `index` |
| `nia-search` | Search indexed sources for a specific question | `search` |
| `nia-web-search` | Search the web via Nia | `nia_research` (quick) |
| `nia-package-search` | Search source code of public packages | `nia_package_search_hybrid` |
| `nia-explore` | Browse file trees of indexed sources | `nia_explore` |
| `nia-read` | Read specific files from indexed sources | `nia_read` |
| `nia-grep` | Regex search across indexed sources | `nia_grep` |
| `nia-oracle` | Run autonomous deep research jobs | `nia_research` (oracle) |
| `nia-context` | Save/load research context cross-agent | `context` |

**`nia-docs` skill** — teaches the agent the Nia-First workflow: check indexed sources before web search.

**`/nia-search <question> [repos...]`** — slash command for quick lookups.

## Usage

Once installed, just ask the agent a docs question and the tools are invoked automatically:

```
How do I configure caching in Next.js 16?
```

For a manual lookup:

```
/nia-search "How does streamText work?" vercel/ai
```

## Nia-First Workflow

The built-in skill teaches the agent to:

1. **Check indexed sources first** (`nia-manage-resource`)
2. **Index if missing** (`nia-index-source`)
3. **Explore structure** (`nia-explore`)
4. **Search / read / grep** (`nia-search`, `nia-read`, `nia-grep`)
5. **Save findings** (`nia-context`)

This eliminates hallucinations by using full source code and documentation instead of truncated web summaries.

## License

MIT
