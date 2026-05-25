import type { Source, PackageSearchResponse } from "./types";

export function formatSources(sources: Source[]): string {
  if (sources.length === 0) {
    return "No indexed sources found. Use `nia-index-source` to index a repository, documentation URL, paper, or dataset.";
  }

  const lines = sources.map((s) => {
    const parts = [
      `- **${s.display_name}**`,
      `  - ID: \`${s.id}\``,
      `  - Type: ${s.type}`,
      `  - Identifier: ${s.identifier}`,
      `  - Status: ${s.status}`,
    ];
    if (s.url) parts.push(`  - URL: ${s.url}`);
    return parts.join("\n");
  });

  return `Indexed Sources (${sources.length}):\n\n${lines.join("\n\n")}`;
}

export function formatSource(source: Source): string {
  const parts = [
    `Indexed: **${source.display_name}**`,
    `- ID: \`${source.id}\``,
    `- Type: ${source.type}`,
    `- Identifier: ${source.identifier}`,
    `- Status: ${source.status}`,
  ];
  if (source.url) parts.push(`- URL: ${source.url}`);
  return parts.join("\n");
}

export function formatPackageResults(response: PackageSearchResponse): string {
  if (!response.results || response.results.length === 0) {
    return response.error ?? "No results found.";
  }

  const lines = response.results.map((r) => {
    const score = r.score !== undefined ? ` (score: ${r.score.toFixed(2)})` : "";
    const loc = r.line_number !== undefined ? `:${r.line_number}` : "";
    return `**${r.file_path}${loc}**${score}\n\n\`\`\`\n${r.snippet}\n\`\`\``;
  });

  return `Package Search Results (${response.results.length}):\n\n${lines.join("\n\n---\n\n")}`;
}
