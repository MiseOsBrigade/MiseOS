export type FileOpsProvider = "xai" | "collections" | "fal" | "catalyst";
export type FileOpsStage = "prepare" | "cook" | "orchestrate" | "deploy" | "observe";

export interface FileOpsRecord {
  id: string;
  filename: string;
  provider: FileOpsProvider;
  purpose: "assistants" | "rag" | "media" | "audit" | "temporary";
  status: "prepared" | "validated" | "routed" | "deployed" | "observed";
  createdAt: string;
}

export const MISEOS_FILEOPS_STATIONS: Record<FileOpsStage, string> = {
  prepare: "Collect source files, public URLs, uploaded file IDs, and repo artifacts.",
  cook: "Validate MIME type, TTL, file size, and secret-like filenames.",
  orchestrate: "Route files to xAI Files, Collections, Fal, or Catalyst.",
  deploy: "Build chat-with-files, repo-manager, and function-calling payloads.",
  observe: "Persist registry records, citations, cleanup state, and audit events."
};

export function routeFileProvider(input: { mimeType?: string; needsMedia?: boolean; needsDurableSearch?: boolean; isPrivate?: boolean }): FileOpsProvider {
  if (input.needsMedia) return "fal";
  if (input.needsDurableSearch) return "collections";
  if (input.isPrivate) return "xai";
  return "catalyst";
}

export function buildResponsesPayload(prompt: string, fileIds: string[], tools: string[] = []) {
  return { model: "grok-4.3", stream: true, input: [{ role: "user", content: [{ type: "input_text", text: prompt }, ...fileIds.map((file_id) => ({ type: "input_file", file_id }))] }], tools: tools.map((type) => ({ type })) };
}
