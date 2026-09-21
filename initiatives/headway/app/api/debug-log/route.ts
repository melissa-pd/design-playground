import { appendFile } from "node:fs/promises";

export const runtime = "nodejs";

const DEBUG_LOG_PATH = "/opt/cursor/logs/debug.log";

type DebugEntry = {
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
  timestamp: number;
};

function isDebugEntry(value: unknown): value is DebugEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<DebugEntry>;
  return (
    typeof entry.hypothesisId === "string" &&
    typeof entry.location === "string" &&
    typeof entry.message === "string" &&
    typeof entry.data === "object" &&
    entry.data !== null &&
    typeof entry.timestamp === "number"
  );
}

export async function POST(request: Request) {
  const entry: unknown = await request.json();

  if (!isDebugEntry(entry)) {
    return Response.json({ error: "Invalid debug entry" }, { status: 400 });
  }

  // #region agent log
  await appendFile(DEBUG_LOG_PATH, `${JSON.stringify(entry)}\n`, "utf8");
  // #endregion

  return new Response(null, { status: 204 });
}
