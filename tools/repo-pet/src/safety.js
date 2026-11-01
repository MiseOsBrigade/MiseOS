import path from "node:path";

export const DEFAULT_IGNORED_NAMES = new Set([
  ".git",
  "node_modules",
  ".next",
  ".turbo",
  ".cache",
  "dist",
  "build",
  "coverage",
  "__pycache__",
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

export const SECRETISH_RE = /(^\.env$|\.env\.|secret|token|credential|private[_-]?key|id_rsa|id_dsa|\.pem$|\.p12$|\.key$|kubeconfig|password|vault)/i;

export const CODE_EXTENSIONS = new Set([
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
  ".css"
]);

export function isHiddenName(name) {
  return name.startsWith(".");
}

export function isSecretish(nameOrPath) {
  return SECRETISH_RE.test(nameOrPath);
}

export function isIgnoredEntry(absPath, name) {
  if (DEFAULT_IGNORED_NAMES.has(name)) return true;
  const normalized = absPath.split(path.sep).join("/");
  return [...DEFAULT_IGNORED_NAMES].some(ignored => normalized.endsWith(`/${ignored}`));
}

export function relativeDepth(root, target) {
  const rel = path.relative(root, target);
  if (!rel || rel === ".") return 0;
  return rel.split(path.sep).filter(Boolean).length;
}

export function truncate(value, max = 90) {
  const text = String(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function maskPath(value) {
  const text = String(value);
  if (!isSecretish(text)) return text;
  const base = path.basename(text);
  return text.replace(base, "[masked-secret-like-path]");
}
