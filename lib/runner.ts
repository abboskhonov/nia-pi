import { execSync, spawn } from "node:child_process";

const NIA_PACKAGE = "@nozomioai/nia";
const DEFAULT_TIMEOUT = 60000;
const ORACLE_TIMEOUT = 300000;

export function getTimeout(command: string[]): number {
  const cmd = command.join(" ");
  if (cmd.includes("oracle")) return ORACLE_TIMEOUT;
  if (cmd.includes("index")) return 120000;
  return DEFAULT_TIMEOUT;
}

export async function runNia(args: string[], input?: string): Promise<string> {
  const cmd = ["npx", "-y", NIA_PACKAGE, ...args];
  const timeout = getTimeout(args);

  try {
    const result = execSync(cmd.join(" "), {
      encoding: "utf-8",
      timeout,
      maxBuffer: 50 * 1024 * 1024, // 50MB
      env: { ...process.env },
      stdio: input ? ["pipe", "pipe", "pipe"] : undefined,
      input,
    });
    return result.trim();
  } catch (error: unknown) {
    if (error instanceof Error && "stdout" in error && "stderr" in error) {
      const e = error as { stdout?: Buffer; stderr?: Buffer; status?: number };
      const stdout = e.stdout?.toString("utf-8")?.trim() ?? "";
      const stderr = e.stderr?.toString("utf-8")?.trim() ?? "";

      if (stderr.includes("ENOTFOUND") || stderr.includes("ECONNREFUSED")) {
        return "Network error: Could not reach Nia servers. Check your internet connection.";
      }
      if (stderr.includes("auth") || stderr.includes("API key") || stderr.includes("unauthorized") || stdout.includes("auth")) {
        return `Authentication error. Run \`npx -y ${NIA_PACKAGE} auth login --api-key YOUR_KEY\` or set NIA_API_KEY. Get a key at https://app.trynia.ai`;
      }
      if (stderr.includes("rate limit") || stdout.includes("rate limit")) {
        return "Rate limited. Wait a moment and try again, or check your plan at https://app.trynia.ai";
      }

      if (stdout) return stdout;
      if (stderr) return stderr;
      return `Nia CLI exited with code ${e.status ?? "unknown"}.`;
    }
    return `Unexpected error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function runNiaJson<T>(args: string[]): Promise<T | { error: string }> {
  const text = await runNia([...args, "--json"]);
  try {
    return JSON.parse(text) as T;
  } catch {
    return { error: text };
  }
}
