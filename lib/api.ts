// NIA / AgentSearch REST API client — aligned with https://docs.trynia.ai/api-guide
// Kept minimal for pi: no proxy/CA-cert handling (pi controls HTTP runtime).

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type {
  SourcesResponse,
  SourceResponse,
  IndexSourceRequest,
  IndexSourceResponse,
  SearchRequest,
  SearchResponse,
  PackageSearchRequest,
  PackageSearchResponse,
  OracleJobRequest,
  OracleJobResponse,
  SourceContentResponse,
  SourceGrepRequest,
  SourceGrepResponse,
  SourceTreeResponse,
  SaveContextRequest,
  SaveContextResponse,
  ListContextsResponse,
} from "./types";

const BASE_URL = "https://apigcp.trynia.ai/v2";

function resolveApiKey(): string | undefined {
  if (process.env.NIA_API_KEY) {
    return process.env.NIA_API_KEY;
  }
  try {
    const home = process.env.HOME || process.env.USERPROFILE || "/";
    const configPath = join(home, ".config", "nia", "config.json");
    if (existsSync(configPath)) {
      const raw = readFileSync(configPath, "utf-8");
      const parsed = JSON.parse(raw) as { apiKey?: string };
      if (parsed.apiKey) return parsed.apiKey;
    }
  } catch { /* ignore */ }
  try {
    const home = process.env.HOME || process.env.USERPROFILE || "/";
    const keyPath = join(home, ".config", "nia", "api_key");
    if (existsSync(keyPath)) {
      const raw = readFileSync(keyPath, "utf-8").trim();
      if (raw) return raw;
    }
  } catch { /* ignore */ }
  return undefined;
}

function authHeaders(): Record<string, string> {
  const apiKey = resolveApiKey();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
}

async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const json = (await response.json()) as { error?: string; message?: string };
    if (json.error) return json.error;
    if (json.message) return json.message;
  } catch { /* fall through */ }

  const hasKey = Boolean(resolveApiKey());
  if (response.status === 429) {
    return hasKey
      ? "Rate limited or quota exceeded. Check your usage at https://app.trynia.ai or upgrade your plan."
      : "Rate limited or quota exceeded. Set a NIA_API_KEY for higher limits. Get one at https://app.trynia.ai";
  }
  if (response.status === 401) {
    return "Invalid or missing API key. Set NIA_API_KEY environment variable, run `nia auth login`, or place your key in ~/.config/nia/config.json. Get a key at https://app.trynia.ai";
  }
  if (response.status === 404) {
    return "Resource not found. Check the identifier and try again.";
  }
  return `Request failed with status ${response.status}. Please try again later.`;
}

// ── Sources ──

export async function listSources(): Promise<SourcesResponse> {
  const response = await fetch(`${BASE_URL}/sources`, { headers: authHeaders() });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as SourcesResponse;
}

export async function getSource(sourceId: string): Promise<SourceResponse> {
  const response = await fetch(`${BASE_URL}/sources/${encodeURIComponent(sourceId)}`, {
    headers: authHeaders(),
  });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as SourceResponse;
}

export async function indexSource(body: IndexSourceRequest): Promise<IndexSourceResponse> {
  const response = await fetch(`${BASE_URL}/sources`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as IndexSourceResponse;
}

export async function syncSource(sourceId: string): Promise<SourceResponse> {
  const response = await fetch(`${BASE_URL}/sources/${encodeURIComponent(sourceId)}/sync`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as SourceResponse;
}

export async function deleteSource(sourceId: string): Promise<{ success?: boolean; error?: string }> {
  const response = await fetch(`${BASE_URL}/sources/${encodeURIComponent(sourceId)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return { success: true };
}

// ── Source exploration ──

export async function getSourceContent(sourceId: string, path?: string): Promise<SourceContentResponse> {
  const url = new URL(`${BASE_URL}/sources/${encodeURIComponent(sourceId)}/content`);
  if (path) url.searchParams.set("path", path);
  const response = await fetch(url, { headers: authHeaders() });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  const text = await response.text();
  return { content: text };
}

export async function grepSource(sourceId: string, body: SourceGrepRequest): Promise<SourceGrepResponse> {
  const response = await fetch(`${BASE_URL}/sources/${encodeURIComponent(sourceId)}/grep`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as SourceGrepResponse;
}

export async function getSourceTree(sourceId: string, path?: string): Promise<SourceTreeResponse> {
  const url = new URL(`${BASE_URL}/sources/${encodeURIComponent(sourceId)}/tree`);
  if (path) url.searchParams.set("path", path);
  const response = await fetch(url, { headers: authHeaders() });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as SourceTreeResponse;
}

// ── Search ──

export async function search(body: SearchRequest): Promise<SearchResponse> {
  const response = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as SearchResponse;
}

// ── Packages ──

export async function packageSearch(body: PackageSearchRequest): Promise<PackageSearchResponse> {
  const endpoint = body.semantic_queries ? "packages/search" : "packages/grep";
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as PackageSearchResponse;
}

// ── Oracle ──

export async function createOracleJob(body: OracleJobRequest): Promise<OracleJobResponse> {
  const response = await fetch(`${BASE_URL}/oracle/jobs`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as OracleJobResponse;
}

export async function getOracleJob(jobId: string): Promise<OracleJobResponse> {
  const response = await fetch(`${BASE_URL}/oracle/jobs/${encodeURIComponent(jobId)}`, {
    headers: authHeaders(),
  });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as OracleJobResponse;
}

// ── Context sharing ──

export async function saveContext(body: SaveContextRequest): Promise<SaveContextResponse> {
  const response = await fetch(`${BASE_URL}/contexts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as SaveContextResponse;
}

export async function listContexts(): Promise<ListContextsResponse> {
  const response = await fetch(`${BASE_URL}/contexts`, { headers: authHeaders() });
  if (!response.ok) return { error: await parseErrorResponse(response) };
  return (await response.json()) as ListContextsResponse;
}
