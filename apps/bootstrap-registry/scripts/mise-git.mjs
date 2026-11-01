#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const args = process.argv.slice(2);
const protectedBranches = new Set(['main', 'master', 'production', 'release']);

function help() {
  console.log(`MiseOS Git Command Layer

Usage:
  miseos repo init
  miseos repo clone <url> [dir]
  miseos repo status
  miseos prep stage [paths...]
  miseos prep commit -m "message"
  miseos sync pull [remote] [branch] [--rebase]
  miseos dispatch push [remote] [branch]
  miseos dispatch force-push [remote] [branch] --confirm-force [--allow-protected]
  miseos hold stash [message]
  miseos hold list
  miseos hold pop
  miseos pick commit <hash>
  miseos undo commit <hash|HEAD>
  miseos rewind soft <ref>
  miseos rewind mixed <ref>
  miseos rewind hard <ref> --confirm-hard
  miseos align rebase <branch> --confirm-rewrite
  miseos trace log
  miseos trace reflog
  miseos release tag <version> [-m "message"]
  miseos release push-tag <version>

Safety:
  - pull uses --ff-only by default
  - hard reset requires --confirm-hard
  - force push requires --confirm-force
  - protected branch force push also requires --allow-protected
`);
}

function runGit(gitArgs, opts = {}) {
  if (opts.dryRun || args.includes('--dry-run')) {
    console.log(`git ${gitArgs.join(' ')}`);
    return;
  }
  const result = spawnSync('git', gitArgs, { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

function requireArg(value, name) {
  if (!value || value.startsWith('--')) {
    console.error(`Missing required argument: ${name}`);
    process.exit(2);
  }
  return value;
}

function currentBranch() {
  const result = spawnSync('git', ['branch', '--show-current'], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : '';
}

function hasFlag(flag) {
  return args.includes(flag);
}

if (args.length === 0 || hasFlag('--help') || hasFlag('-h')) {
  help();
  process.exit(0);
}

const [area, verb, ...rest] = args.filter((arg) => arg !== '--dry-run');

if (area === 'repo' && verb === 'init') runGit(['init']);
else if (area === 'repo' && verb === 'clone') {
  const url = requireArg(rest[0], 'repository url');
  runGit(['clone', ...rest]);
}
else if (area === 'repo' && verb === 'status') runGit(['status', '--short', '--branch']);
else if (area === 'prep' && verb === 'stage') runGit(['add', ...(rest.length ? rest : ['.'])]);
else if (area === 'prep' && verb === 'commit') {
  const messageIndex = rest.findIndex((arg) => arg === '-m' || arg === '--message');
  if (messageIndex === -1 || !rest[messageIndex + 1]) {
    console.error('Commit requires -m "message".');
    process.exit(2);
  }
  runGit(['commit', ...rest]);
}
else if (area === 'sync' && verb === 'pull') {
  const filtered = rest.filter((arg) => arg !== '--rebase');
  const mode = rest.includes('--rebase') ? ['pull', '--rebase'] : ['pull', '--ff-only'];
  runGit([...mode, ...filtered]);
}
else if (area === 'dispatch' && verb === 'push') runGit(['push', ...rest]);
else if (area === 'dispatch' && verb === 'force-push') {
  if (!hasFlag('--confirm-force')) {
    console.error('Force push blocked. Add --confirm-force to continue.');
    process.exit(3);
  }
  const branch = rest.filter((x) => !x.startsWith('--')).at(-1) || currentBranch();
  if (protectedBranches.has(branch) && !hasFlag('--allow-protected')) {
    console.error(`Force push to protected branch "${branch}" blocked. Add --allow-protected only if you intentionally accept the risk.`);
    process.exit(3);
  }
  runGit(['push', '--force-with-lease', ...rest.filter((arg) => arg !== '--confirm-force' && arg !== '--allow-protected')]);
}
else if (area === 'hold' && verb === 'stash') runGit(['stash', 'push', '-m', rest.join(' ') || 'MiseOS hold']);
else if (area === 'hold' && verb === 'list') runGit(['stash', 'list']);
else if (area === 'hold' && verb === 'pop') runGit(['stash', 'pop']);
else if (area === 'pick' && verb === 'commit') runGit(['cherry-pick', requireArg(rest[0], 'commit hash')]);
else if (area === 'undo' && verb === 'commit') runGit(['revert', requireArg(rest[0] ?? 'HEAD', 'commit hash')]);
else if (area === 'rewind' && ['soft', 'mixed'].includes(verb)) runGit(['reset', `--${verb}`, requireArg(rest[0], 'ref')]);
else if (area === 'rewind' && verb === 'hard') {
  if (!hasFlag('--confirm-hard')) {
    console.error('Hard reset blocked. Add --confirm-hard to continue.');
    process.exit(3);
  }
  runGit(['reset', '--hard', requireArg(rest[0], 'ref')]);
}
else if (area === 'align' && verb === 'rebase') {
  if (!hasFlag('--confirm-rewrite')) {
    console.error('Rebase rewrites local commit identity. Add --confirm-rewrite to continue.');
    process.exit(3);
  }
  runGit(['rebase', requireArg(rest[0], 'branch')]);
}
else if (area === 'trace' && verb === 'log') runGit(['log', '--graph', '--oneline', '--decorate', '--all']);
else if (area === 'trace' && verb === 'reflog') runGit(['reflog']);
else if (area === 'release' && verb === 'tag') {
  const version = requireArg(rest[0], 'version');
  const messageIndex = rest.findIndex((arg) => arg === '-m' || arg === '--message');
  const message = messageIndex >= 0 ? rest[messageIndex + 1] : `Release ${version}`;
  runGit(['tag', '-a', version, '-m', message]);
}
else if (area === 'release' && verb === 'push-tag') runGit(['push', 'origin', requireArg(rest[0], 'version')]);
else {
  console.error(`Unknown MiseOS git command: ${args.join(' ')}`);
  help();
  process.exit(2);
}
