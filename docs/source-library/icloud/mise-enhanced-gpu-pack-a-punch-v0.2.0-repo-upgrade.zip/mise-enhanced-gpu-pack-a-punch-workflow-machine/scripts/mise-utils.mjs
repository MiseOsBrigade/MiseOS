import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function readPolicy() {
  const path = '.github/mise/mise-policy.json';
  if (!existsSync(path)) {
    throw new Error(`Missing policy file: ${path}`);
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function sh(command, args = [], options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  }).trim();
}

export function trySh(command, args = [], fallback = '') {
  try {
    return sh(command, args);
  } catch {
    return fallback;
  }
}

export function runCommand(command, options = {}) {
  const result = spawnSync(command, {
    shell: true,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  });
  return {
    command,
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: result.stdout?.trim() ?? '',
    stderr: result.stderr?.trim() ?? ''
  };
}

export function changedFiles(baseSha, headSha) {
  const candidates = [
    ['diff', '--name-only', `${baseSha}...${headSha}`],
    ['diff', '--name-only', `${baseSha}`, `${headSha}`],
    ['diff', '--name-only', 'HEAD~1', 'HEAD'],
    ['ls-files']
  ];

  for (const args of candidates) {
    const output = trySh('git', args, '');
    const files = output.split('\n').map((s) => s.trim()).filter(Boolean);
    if (files.length > 0) return [...new Set(files)];
  }
  return [];
}

export function changedStats(baseSha, headSha) {
  const output = trySh('git', ['diff', '--numstat', `${baseSha}...${headSha}`], '');
  let added = 0;
  let deleted = 0;
  for (const line of output.split('\n').filter(Boolean)) {
    const [a, d] = line.split(/\s+/);
    added += Number.isFinite(Number(a)) ? Number(a) : 0;
    deleted += Number.isFinite(Number(d)) ? Number(d) : 0;
  }
  return { added, deleted, changed: added + deleted };
}

export function fileText(path, maxBytes = 2_000_000) {
  try {
    if (!existsSync(path)) return '';
    const size = statSync(path).size;
    if (size > maxBytes) return '';
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

export function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function appendGithubOutput(values) {
  const output = process.env.GITHUB_OUTPUT;
  if (!output) return;
  const lines = Object.entries(values).map(([key, value]) => `${key}=${String(value).replace(/\n/g, '%0A')}`);
  writeFileSync(output, `${lines.join('\n')}\n`, { flag: 'a' });
}

export function appendStepSummary(markdown) {
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (!summary) return;
  writeFileSync(summary, `${markdown}\n`, { flag: 'a' });
}

export function hasAny(files, predicates) {
  return files.some((file) => predicates.some((predicate) => predicate(file)));
}

export function repoRootFile(path) {
  return join(process.cwd(), path);
}
