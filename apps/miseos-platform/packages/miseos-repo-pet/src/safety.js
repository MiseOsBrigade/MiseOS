import fs from "node:fs/promises";
import path from "node:path";

export const DEFAULT_IGNORED_NAMES = new Set([
  ".git",
  "node_modules",
  ".next",
  ".nuxt",
  ".turbo",
  ".cache",
  ".parcel-cache",
  "dist",
  "build",
  "coverage",
  "target",
  "vendor",
  "__pycache__",
  ".pytest_cache",
  ".ruff_cache",
  ".venv",
  "venv",
  "proc",
  "sys",
  "dev",
  "run",
  "tmp",
  "var/lib",
  "var/cache",
  "var/log"
]);

export const SAFE_PEEK_EXTENSIONS = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".cs",
  ".php",
  ".rb",
  ".md",
  ".mdx",
  ".json",
  ".yaml",
  ".yml",
  ".toml",
  ".html",
  ".css",
  ".scss",
  ".sh"
]);

const SECRETISH_RE =
  /(^\.env$|\.env\.|secret|token|credential|private[_-]?key|id_rsa|id_dsa|\.pem$|\.p12$|\.pfx$|\.key$|kubeconfig|password|passwd|vault|\.npmrc$|\.pypirc$)/i;

export function isHiddenName(name) {
  return name.startsWith(".");
}

export function isSecretish(nameOrPath) {
  return SECRETISH_RE.test(nameOrPath);
}

export function normalizeForMatch(absPath) {
  return absPath.split(path.sep).join("/");
}

export function isIgnoredEntry(absPath, name) {
  if (DEFAULT_IGNORED_NAMES.has(name)) return true;
  const normalized = normalizeForMatch(absPath);
  return [...DEFAULT_IGNORED_NAMES].some(ignored => normalized.endsWith(`/${ignored}`));
}

export function shouldSkipEntry({ absPath, name, showHidden = false }) {
  if (!showHidden && isHiddenName(name)) return true;
  return isIgnoredEntry(absPath, name);
}

export async function safeLstat(absPath) {
  try {
    return await fs.lstat(absPath);
  } catch {
    return null;
  }
}

export async function safeReadDir(absPath) {
  try {
    return { entries: await fs.readdir(absPath, { withFileTypes: true }), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { entries: [], error: message };
  }
}

export function isSafePeekTarget(absPath, sizeBytes) {
  if (isSecretish(absPath)) return false;
  if (sizeBytes > 80_000) return false;
  const basename = path.basename(absPath);
  const ext = path.extname(absPath).toLowerCase();
  return basename === "Dockerfile" || SAFE_PEEK_EXTENSIONS.has(ext);
}
