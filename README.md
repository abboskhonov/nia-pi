# nia-pi

[Nia](https://trynia.ai) / [AgentSearch](https://agentsearch.sh) extension for the [pi coding agent](https://pi.dev).

Wraps the official NIA CLI via `npx` — **zero install required**. Brings the full Nia toolset to pi: index and search code repos, docs, papers, packages, run Oracle research, search GitHub without indexing, and share context across agents.

## Install

```bash
pi install git:github.com/abboskhonov/nia-pi
```

No other dependencies needed. `npx` auto-downloads and caches the NIA CLI on first use.

## Authenticate

The NIA CLI handles auth automatically. Get a key at [app.trynia.ai](https://app.trynia.ai), then:

```bash
npx -y @nozomioai/nia auth login --api-key nk_your_key
```

Or set the env var: `export NIA_API_KEY=nk_your_key`

## How it works

Instead of a custom HTTP client, every tool spawns the official NIA CLI:

```
User asks → pi tool call → npx -y @nozomioai/nia <command> → result
```

This means:
- **New CLI features work immediately** — no extension updates needed
- **Auth, rate limits, retries handled by the CLI** — no maintenance
- **Full feature parity with MCP** — same commands, same output

## Tools (12)

| Tool | CLI command | Purpose |
|------|-------------|---------|
| `nia-manage-resource` | `nia sources list/get/sync/delete` | List, status, sync, delete indexed sources |
| `nia-index-source` | `nia repos/sources/papers/datasets index` | Index repos, docs, papers, datasets |
| `nia-search` | `nia search query` | Semantic search across indexed sources |
| `nia-web-search` | `nia search web` | Web search |
| `nia-package-search` | `nia packages search/grep` | Search package source code |
| `nia-explore` | `nia sources tree` | Browse file trees |
| `nia-read` | `nia sources read` | Read specific files |
| `nia-grep` | `nia sources grep` | Regex search with snippets |
| `nia-oracle` | `nia oracle create` | Deep autonomous research |
| `nia-context` | `nia contexts save/list` | Cross-agent context sharing |
| `nia-usage` | `nia usage` | Check API quota |
| `nia-tracer` | `nia tracer run/status` | Search GitHub without indexing |

**`nia-docs` skill** — teaches the Nia-First workflow: check indexed sources before web search.

**`/nia-search <question>`** — slash command for quick lookups.

## Usage

Once installed, just ask:

```
How do I configure caching in Next.js 16?
```

Pi auto-triggers the `nia-docs` skill → `nia-manage-resource` → `nia-search` → answer.

## License

MIT
