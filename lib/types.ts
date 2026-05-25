// NIA API response types — aligned with https://docs.trynia.ai/api-guide

export interface Source {
  id: string;
  type: "repository" | "documentation" | "research_paper" | "huggingface_dataset" | "local_folder";
  display_name: string;
  identifier: string;
  status: "indexing" | "ready" | "error" | "pending";
  url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SourcesResponse {
  sources?: Source[];
  error?: string;
}

export interface IndexSourceRequest {
  type: "repository" | "documentation" | "research_paper" | "huggingface_dataset";
  repository?: string;
  url?: string;
  paper?: string;
  dataset?: string;
}

export interface IndexSourceResponse {
  source?: Source;
  error?: string;
}

export interface SearchRequest {
  mode: "query" | "universal" | "web" | "deep";
  query?: string;
  messages?: Array<{ role: string; content: string }>;
  repositories?: string[];
  data_sources?: string[];
  search_mode?: "unified" | "repositories" | "sources";
}

export interface SearchResult {
  content: string;
  sources?: Array<{
    id: string;
    display_name: string;
    type: string;
    identifier: string;
  }>;
}

export interface SearchResponse {
  results?: SearchResult;
  error?: string;
}

export interface PackageSearchRequest {
  registry: "npm" | "py_pi" | "crates_io" | "golang_proxy";
  package_name: string;
  pattern?: string;
  semantic_queries?: string[];
  file_path?: string;
}

export interface PackageSearchResponse {
  results?: Array<{
    file_path: string;
    line_number?: number;
    snippet: string;
    score?: number;
  }>;
  error?: string;
}

export interface OracleJobRequest {
  query: string;
}

export interface OracleJobResponse {
  job_id?: string;
  status?: "queued" | "running" | "completed" | "failed";
  result?: string;
  error?: string;
}
