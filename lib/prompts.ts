// Tool titles, descriptions, and parameter descriptions for the LLM.
// Aligned with the Nia Plugin for Claude Code skill so pi and Claude Code
// give the LLM identical instructions where possible.

export const LIST_SOURCES_TITLE = "List NIA Sources";

export const LIST_SOURCES_DESCRIPTION = `List all sources currently indexed in Nia (repositories, documentation, research papers, HuggingFace datasets, and local folders).

Use this tool FIRST before indexing a new source to check if it already exists. This avoids redundant indexing and saves time. The tool returns each source's ID, display name, type, identifier, and indexing status.

When the user asks about a library, framework, or project, always call this tool first to see if relevant sources are already indexed.`;

export const INDEX_SOURCE_TITLE = "Index Source with NIA";

export const INDEX_SOURCE_DESCRIPTION = `Index a new source with Nia so it becomes searchable.

Supported source types:
- repository: GitHub repo in "owner/repo" format (e.g., "vercel/ai")
- documentation: Documentation URL (e.g., "https://docs.stripe.com")
- research_paper: arXiv ID or URL (e.g., "2312.00752")
- huggingface_dataset: Dataset name (e.g., "squad" or "dair-ai/emotion")

Indexing takes 1-5 minutes. After calling this tool, the result will show the source ID and status (usually "indexing" or "pending"). You do NOT need to wait for indexing to complete before searching - the source will be searchable once its status becomes "ready".

Only call this tool when the user explicitly asks to index something, or when \`nia-list-sources\` shows the source is not yet indexed and the user needs to search it.`;

export const INDEX_SOURCE_TYPE_DESCRIPTION =
  'The type of source to index: "repository", "documentation", "research_paper", or "huggingface_dataset".';

export const INDEX_SOURCE_IDENTIFIER_DESCRIPTION =
  'The source identifier. For repositories: "owner/repo". For documentation: a full URL. For papers: arXiv ID or URL. For datasets: dataset name or owner/dataset.';

export const SEARCH_TITLE = "Search NIA Sources";

export const SEARCH_DESCRIPTION = `Search across indexed Nia sources (repositories, docs, papers, datasets) for a specific question or topic.

You should call \`nia-list-sources\` first to discover what sources are available, then call this tool with the relevant source IDs or names. You can search across ALL indexed sources by omitting repositories and data_sources, or target specific ones for focused results.

This tool is the PRIMARY way to answer questions about specific libraries, frameworks, SDKs, APIs, or codebases. Prefer this over web search or your training data for library-specific questions because Nia returns full, structured source code and documentation rather than truncated summaries.`;

export const SEARCH_QUERY_DESCRIPTION =
  "The question or task you need help with. Be specific. Good: 'How do I configure authentication with JWT in Express.js?' Bad: 'auth'. Do not include API keys, passwords, credentials, personal data, or proprietary code in your query - it is sent to the NIA API.";

export const SEARCH_REPOSITORIES_DESCRIPTION =
  'Optional array of repository identifiers to search (e.g., ["vercel/ai", "facebook/react"]). Omit to search all indexed repos.';

export const SEARCH_DATA_SOURCES_DESCRIPTION =
  'Optional array of data source display names or IDs to search (e.g., ["Vercel AI SDK", "Stripe Docs"]). Omit to search all indexed data sources.';

export const SEARCH_MODE_DESCRIPTION =
  'Optional search scope: "unified" (repos + sources, default), "repositories" (repos only), or "sources" (docs/papers/datasets only).';

export const WEB_SEARCH_TITLE = "NIA Web Search";

export const WEB_SEARCH_DESCRIPTION = `Search the web via Nia. Use this tool when:
1. The user asks about recent events, breaking changes, or topics not in indexed sources
2. You need to discover a documentation URL before indexing it
3. The user explicitly asks for web search results

Prefer \`nia-search\` (indexed sources) over web search whenever possible, because indexed sources provide more accurate, complete context. Web search is best for discovery and recent information.`;

export const WEB_SEARCH_QUERY_DESCRIPTION = SEARCH_QUERY_DESCRIPTION;

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

export const ORACLE_TITLE = "NIA Oracle Research";

export const ORACLE_DESCRIPTION = `Run an autonomous deep research job with Nia Oracle. The Oracle performs multi-step research with extended thinking and tool use.

Use this tool for:
- Complex comparisons (e.g., "Compare React vs Vue state management")
- Deep investigation (e.g., "What are the best practices for RAG evaluation frameworks?")
- Broad research questions that require synthesizing multiple sources

The Oracle runs asynchronously. The tool returns a job ID. You may need to call \`nia-oracle\` again later with follow-up queries to get the full result, or ask the user to wait and check back.`;

export const ORACLE_QUERY_DESCRIPTION =
  "The research question or topic. Be specific and descriptive. Good: 'Compare RAG evaluation frameworks with pros and cons for each.' Bad: 'RAG'.";
