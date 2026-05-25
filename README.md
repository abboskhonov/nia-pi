# @nozomio/nia-pi

Official [Nia](https://trynia.ai) extension for the [pi coding agent](https://pi.dev).

Adds Nia AI search, indexing, and research capabilities to pi via six LLM-callable tools — plus a skill that teaches the agent when to use them and a `/nia-search` slash command for manual lookups.

## Install

```bash
pi install npm:@nozomio/nia-pi
```

## Authenticate

The extension requires a Nia API key. Get one at [app.trynia.ai](https://app.trynia.ai) and export it:

```bash
export NIA_API_KEY=nia_...
```

Set it in your shell profile so pi picks it up on launch.

## What it adds

| Tool | Purpose |
|------|---------|
| `nia-list-sources` | List all indexed sources (repos, docs, papers, datasets) |
| `nia-index-source` | Index a new repo, documentation URL, paper, or dataset |
| `nia-search` | Search indexed sources for a specific question |
| `nia-web-search` | Search the web via Nia |
| `nia-package-search` | Search source code of public packages (npm, PyPI, crates, Go) |
| `nia-oracle` | Run autonomous deep research jobs |

**`nia-docs` skill** — instructs the agent to reach for NIA tools whenever the user asks about a library, framework, SDK, API, CLI tool, cloud service, package, or research topic.

**`/nia-search <question> [repos...]`** — slash command that runs list + search in one shot.

## Usage

Once installed, just ask the agent a docs question and the tools are invoked automatically:

```
How do I configure caching in Next.js 16?
```

For a manual lookup:

```
/nia-search "How does streamText work?" vercel/ai
```

## License

MIT
