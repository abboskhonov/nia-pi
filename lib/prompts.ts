// Tool titles, descriptions, and parameter descriptions for the LLM.
// Aligned with the Nia / AgentSearch MCP tools so pi and MCP clients
// give the LLM identical instructions where possible.

// ── Manage Resource ──

export const MANAGE_RESOURCE_TITLE = "Manage NIA Resource";

export const MANAGE_RESOURCE_DESCRIPTION = `Manage indexed sources in Nia / AgentSearch: list, check status, sync, or delete.

Use this tool FIRST before indexing a new source. Many sources may already be indexed.

When listing, use a targeted `query` keyword to save tokens — users can have many sources indexed.

**Actions:**
- `list`: List all indexed sources. Use `query` to filter by name/identifier/type.
- `status`: Get detailed status of a specific source (requires `sourceId`).
- `sync`: Trigger re-indexing of a source (requires `sourceId`).
- `delete`: Remove a source (requires `sourceId`).

Always call `manage_resource(action='list', query='...')` before indexing anything new.`;

export const MANAGE_RESOURCE_ACTION_DESCRIPTION =
  'Action to perform: "list", "status", "sync", or "delete".';

export const MANAGE_RESOURCE_SOURCE_ID_DESCRIPTION =
  'Source ID (UUID or identifier). Required for status, sync, and delete actions.';

export const MANAGE_RESOURCE_QUERY_DESCRIPTION =
  'Optional filter keyword for list action (e.g., "react", "stripe", "docs").';

// ── Index Source ──

export const INDEX_SOURCE_TITLE = "Index Source with NIA";

export const INDEX_SOURCE_DESCRIPTION = `Index a new source with Nia / AgentSearch so it becomes searchable.

Supported source types:
- repository: GitHub repo in "owner/repo" format (e.g., "vercel/ai")
- documentation: Documentation URL (e.g., "https://docs.stripe.com")
- research_paper: arXiv ID or URL (e.g., "2312.00752")
- huggingface_dataset: Dataset name (e.g., "squad" or "dair-ai/emotion")

Indexing takes 1-5 minutes. After calling this tool, the result will show the source ID and status (usually "indexing" or "pending"). You do NOT need to wait for indexing to complete before searching — the source will be searchable once its status becomes "ready".

Only call this tool when the user explicitly asks to index something, or when `nia-manage-resource` shows the source is not yet indexed and the user needs to search it.`;

export const INDEX_SOURCE_TYPE_DESCRIPTION =
  'The type of source to index: "repository", "documentation", "research_paper", or "huggingface_dataset".';

export const INDEX_SOURCE_IDENTIFIER_DESCRIPTION =
  'The source identifier. For repositories: "owner/repo". For documentation: a full URL. For papers: arXiv ID or URL. For datasets: dataset name or owner/dataset.';

// ── Search ──

export const SEARCH_TITLE = "Search NIA Sources";

export const SEARCH_DESCRIPTION = `Search across indexed Nia / AgentSearch sources (repositories, docs, papers, datasets) for a specific question or topic.

You should call `nia-manage-resource` first to discover what sources are available, then call this tool with the relevant source IDs or names. You can search across ALL indexed sources by omitting repositories and data_sources, or target specific ones for focused results.

This tool is the PRIMARY way to answer questions about specific libraries, frameworks, SDKs, APIs, or codebases. Prefer this over web search or your training data for library-specific questions because Nia returns full, structured source code and documentation rather than truncated summaries.`;

export const SEARCH_QUERY_DESCRIPTION =
  "The question or task you need help with. Be specific. Good: 'How do I configure authentication with JWT in Express.js?' Bad: 'auth'. Do not include API keys, passwords, credentials, personal data, or proprietary code in your query — it is sent to the NIA API.";

export const SEARCH_REPOSITORIES_DESCRIPTION =
  'Optional array of repository identifiers to search (e.g., ["vercel/ai", "facebook/react"]). Omit to search all indexed repos.';

export const SEARCH_DATA_SOURCES_DESCRIPTION =
  'Optional array of data source display names or IDs to search (e.g., ["Vercel AI SDK", "Stripe Docs"]). Omit to search all indexed data sources.';

export const SEARCH_MODE_DESCRIPTION =
  'Optional search scope: "unified" (repos + sources, default), "repositories" (repos only), or "sources" (docs/papers/datasets only).';

// ── Web Search ──

export const WEB_SEARCH_TITLE = "NIA Web Search";

export const WEB_SEARCH_DESCRIPTION = `Search the web via Nia / AgentSearch. Use this tool when:
1. The user asks about recent events, breaking changes, or topics not in indexed sources
2. You need to discover a documentation URL before indexing it
3. The user explicitly asks for web search results

Prefer `nia-search` (indexed sources) over web search whenever possible, because indexed sources provide more accurate, complete context. Web search is best for discovery and recent information.`;

export const WEB_SEARCH_QUERY_DESCRIPTION = SEARCH_QUERY_DESCRIPTION;

// ── Package Search ──

export const PACKAGE_SEARCH_TITLE = "NIA Package Search";

export const PACKAGE_SEARCH_DESCRIPTION = `Search the source code of public packages across npm, PyPI, Crates.io, and Go modules. No indexing required.

Use this tool when the user asks about:
- How a specific function or class works in a dependency
- Internal implementation details of a library
- Code examples from a package's actual source code
- API signatures or type definitions from a package

Supports two search modes:
- Semantic search (describe what you want, e.g., "How does dependency injection work?")
- Grep/regex search (exact pattern, e.g., "streamText")`;

export const PACKAGE_SEARCH_REGISTRY_DESCRIPTION =
  'Package registry: "npm", "py_pi", "crates_io", or "golang_proxy".';

export const PACKAGE_SEARCH_PACKAGE_NAME_DESCRIPTION =
  'Package name (e.g., "react", "fastapi", "tokio", "gin").';

export const PACKAGE_SEARCH_SEMANTIC_DESCRIPTION =
  'Optional semantic query describing what you want to find (e.g., "How does dependency injection work?"). Provide this for semantic search, OR provide pattern for grep search.';

export const PACKAGE_SEARCH_PATTERN_DESCRIPTION =
  'Optional regex pattern for exact code search (e.g., "streamText", "class Router"). Provide this for grep search, OR provide semantic_queries for semantic search.';

// ── Read ──

export const READ_TITLE = "NIA Read";

export const READ_DESCRIPTION = `Read a specific file from an indexed source (repository, documentation, or local folder).

Use this after `nia-explore` to understand the structure, then read files you need. This returns the full file content — not truncated like web fetch.

You must know the `sourceId` from `nia-manage-resource` or `nia-index-source`.`;

export const READ_SOURCE_ID_DESCRIPTION =
  'Source ID (UUID, display name, or identifier like "owner/repo"). Use `nia-manage-resource` to find source IDs.';

export const READ_PATH_DESCRIPTION =
  'File path within the source (e.g., "src/index.ts" or "/getting-started.md"). Optional — omit to read root content.';

// ── Grep ──

export const GREP_TITLE = "NIA Grep";

export const GREP_DESCRIPTION = `Regex search across an indexed source's content. Returns matching snippets with file paths and line numbers.

Use this for:
- Finding function/class definitions
- Searching for specific patterns across a codebase
- Locating configuration examples
- Finding imports or usages of a symbol

You must know the `sourceId` from `nia-manage-resource`.`;

export const GREP_SOURCE_ID_DESCRIPTION = READ_SOURCE_ID_DESCRIPTION;

export const GREP_PATTERN_DESCRIPTION =
  'Regex pattern to search for (e.g., "class.*Handler", "streamText", "export.*default").';

// ── Explore ──

export const EXPLORE_TITLE = "NIA Explore";

export const EXPLORE_DESCRIPTION = `Browse the file tree of an indexed source. Lists files and directories.

Use this BEFORE `nia-read` or `nia-grep` to understand the structure of a repository or documentation site. This helps you choose the right files to read or patterns to search.

You must know the `sourceId` from `nia-manage-resource`.`;

export const EXPLORE_SOURCE_ID_DESCRIPTION = READ_SOURCE_ID_DESCRIPTION;

export const EXPLORE_PATH_DESCRIPTION =
  'Optional subdirectory path to explore. Omit to list the root of the source.';

// ── Oracle ──

export const ORACLE_TITLE = "NIA Oracle Research";

export const ORACLE_DESCRIPTION = `Run an autonomous deep research job with Nia Oracle. The Oracle performs multi-step research with extended thinking and tool use.

Use this for:
- Complex comparisons (e.g., "Compare React vs Vue state management")
- Deep investigation (e.g., "What are the best practices for RAG evaluation frameworks?")
- Broad research questions that require synthesizing multiple sources

The Oracle runs asynchronously. The tool returns a job ID. You may need to call `nia-oracle` again later with follow-up queries to get the full result, or ask the user to wait and check back.`;

export const ORACLE_QUERY_DESCRIPTION =
  "The research question or topic. Be specific and descriptive. Good: 'Compare RAG evaluation frameworks with pros and cons for each.' Bad: 'RAG'.";

// ── Context ──

export const CONTEXT_TITLE = "NIA Context";

export const CONTEXT_DESCRIPTION = `Save or list research context for cross-agent sharing. Nia / AgentSearch stores your research findings so you (or another agent) can retrieve them later.

Use `save` when you have made significant research findings worth preserving. Use `list` to see previously saved contexts.

This enables session handoff: finish planning in one agent, pick up execution in another without losing the thread.`;

export const CONTEXT_ACTION_DESCRIPTION =
  'Action: "save" to store context, or "list" to view saved contexts.';

export const CONTEXT_TITLE_DESCRIPTION =
  'Title for the saved context (required for save).';

export const CONTEXT_SUMMARY_DESCRIPTION =
  'Short summary of the findings (required for save).';

export const CONTEXT_CONTENT_DESCRIPTION =
  'Full content / detailed findings to save (required for save).';

export const CONTEXT_TAGS_DESCRIPTION =
  'Optional tags for organizing contexts (e.g., ["react", "auth", "research"]).';
