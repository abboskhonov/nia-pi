---
description: Search NIA indexed sources for a library or topic
argument-hint: <question> [repo1,repo2,...]
---

Search NIA for "$1".

1. Call `nia-list-sources` to see what sources are indexed.
2. Call `nia-search` with `query="$1"` and relevant repositories/data sources from step 1.
3. Summarize the answer for the user with code examples from the returned snippets. Cite the source names you used.

If arguments after `$1` look like repo identifiers (e.g., `vercel/ai`), pass them as the `repositories` parameter. If they look like doc names, pass them as `dataSources`.
