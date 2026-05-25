// NIA REST API client — aligned with https://docs.trynia.ai/api-guide
// Kept minimal for pi: no proxy/CA-cert handling (pi controls HTTP runtime).

import type {
  SourcesResponse,
  IndexSourceRequest,
  IndexSourceResponse,
  SearchRequest,
  SearchResponse,
  PackageSearchRequest,
  PackageSearchResponse,
  OracleJobRequest,
  OracleJobResponse,
} from "./types";

const BASE_URL = "https://apigcp.trynia.ai/v2";

function authHeaders(): Record<string, string> {
  const apiKey = process.env.NIA_API_KEY;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  return headers;
}

async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const json = (await response.json()) as { error?: string; message?: string };
    if (json.error) return json.error;
    if (json.message) return json.message;
  } catch {
    // JSON parsing failed, fall through to status-based message
  }

  const hasKey = Boolean(process.env.NIA_API_KEY);
  if (response.status === 429) {
    return hasKey
      ? "Rate limited or quota exceeded. Check your usage at https://app.trynia.ai or upgrade your plan."
      : "Rate limited or quota exceeded. Set a NIA_API_KEY for higher limits. Get one at https://app.trynia.ai";
  }
  if (response.status === 401) {
    return "Invalid or missing API key. Set NIA_API_KEY environment variable. Get a key at https://app.trynia.ai";
  }
  if (response.status === 404) {
    return "Resource not found. Check the identifier and try again.";
  }
  return `Request failed with status ${response.status}. Please try again later.`;
}

export async function listSources(): Promise<SourcesResponse> {
  const response = await fetch(`${BASE_URL}/sources`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    return { error: await parseErrorResponse(response) };
  }
  return (await response.json()) as SourcesResponse;
}

export async function indexSource(body: IndexSourceRequest): Promise<IndexSourceResponse> {
  const response = await fetch(`${BASE_URL}/sources`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    return { error: await parseErrorResponse(response) };
  }
  return (await response.json()) as IndexSourceResponse;
}

export async function search(body: SearchRequest): Promise<SearchResponse> {
  const response = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    return { error: await parseErrorResponse(response) };
  }
  return (await response.json()) as SearchResponse;
}

export async function packageSearch(body: PackageSearchRequest): Promise<PackageSearchResponse> {
  const endpoint = body.semantic_queries ? "packages/search" : "packages/grep";
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    return { error: await parseErrorResponse(response) };
  }
  return (await response.json()) as PackageSearchResponse;
}

export async function createOracleJob(body: OracleJobRequest): Promise<OracleJobResponse> {
  const response = await fetch(`${BASE_URL}/oracle/jobs`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    return { error: await parseErrorResponse(response) };
  }
  return (await response.json()) as OracleJobResponse;
}

export async function getOracleJob(jobId: string): Promise<OracleJobResponse> {
  const response = await fetch(`${BASE_URL}/oracle/jobs/${encodeURIComponent(jobId)}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    return { error: await parseErrorResponse(response) };
  }
  return (await response.json()) as OracleJobResponse;
}
