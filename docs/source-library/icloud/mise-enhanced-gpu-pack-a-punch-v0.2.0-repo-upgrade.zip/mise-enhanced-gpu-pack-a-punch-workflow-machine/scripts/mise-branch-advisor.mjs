import { appendGithubOutput, appendStepSummary, readPolicy, sh, trySh, writeJson } from './mise-utils.mjs';

const policy = readPolicy();
const protectedBranches = new Set(policy.branchAdvisor.protectedBranches);
const current = (process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || trySh('git', ['rev-parse', '--abbrev-ref', 'HEAD'], 'HEAD')).replace('refs/heads/', '');
const defaultBranch = process.env.DEFAULT_BRANCH || 'main';

trySh('git', ['fetch', '--no-tags', '--prune', '--depth=50', 'origin', '+refs/heads/*:refs/remotes/origin/*'], '');

const refs = trySh('git', ['for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin'], '')
  .split('\n')
  .map((branch) => branch.replace(/^origin\//, '').trim())
  .filter(Boolean)
  .filter((branch) => branch !== 'HEAD')
  .filter((branch) => branch !== current)
  .filter((branch) => !protectedBranches.has(branch));

function prefixScore(branch) {
  let score = 0;
  for (const prefix of policy.branchAdvisor.preferBranchPrefixes) {
    if (branch.startsWith(prefix)) score += 20;
  }
  for (const prefix of policy.branchAdvisor.penalizeBranchPrefixes) {
    if (branch.startsWith(prefix)) score -= 25;
  }
  return score;
}

function aheadBehind(branch) {
  const output = trySh('git', ['rev-list', '--left-right', '--count', `origin/${defaultBranch}...origin/${branch}`], '0\t0');
  const [behindRaw, aheadRaw] = output.split(/\s+/).map((v) => Number(v || 0));
  return { behind: behindRaw || 0, ahead: aheadRaw || 0 };
}

const candidates = refs.map((branch) => {
  const ab = aheadBehind(branch);
  const changed = trySh('git', ['diff', '--name-only', `origin/${defaultBranch}...origin/${branch}`], '')
    .split('\n')
    .filter(Boolean);
  const workflowTouches = changed.filter((f) => f.startsWith('.github/workflows/') || f.startsWith('.github/actions/')).length;
  const testTouches = changed.filter((f) => /(^|\/)(test|tests|__tests__)\//.test(f) || /\.(test|spec)\./.test(f)).length;
  const docTouches = changed.filter((f) => /(^docs\/|README|\.md$)/i.test(f)).length;
  const lockTouches = changed.filter((f) => /(package-lock|pnpm-lock|yarn\.lock|poetry\.lock|Pipfile\.lock)/.test(f)).length;

  let score = 50 + prefixScore(branch);
  score += Math.min(20, ab.ahead * 3);
  score += Math.min(10, testTouches * 2);
  score += Math.min(8, docTouches);
  score -= Math.min(25, workflowTouches * 10);
  score -= Math.min(10, lockTouches * 5);
  score -= Math.min(20, ab.behind * 2);
  score = Math.max(0, Math.min(100, score));

  return { branch, score, ahead: ab.ahead, behind: ab.behind, changedFiles: changed.length, workflowTouches, testTouches, docTouches, lockTouches };
}).sort((a, b) => b.score - a.score).slice(0, policy.branchAdvisor.maxCandidates);

const top = candidates[0] || null;
const report = { gate: 'E4 branch-advisor', defaultBranch, current, top, candidates };
writeJson('mise-branch-advisor-report.json', report);
appendGithubOutput({ recommended_branch: top?.branch || '', recommended_score: top?.score || 0 });

const rows = candidates.map((c) => `| \`${c.branch}\` | ${c.score} | ${c.ahead} | ${c.behind} | ${c.changedFiles} | ${c.workflowTouches} |`).join('\n') || '| none | 0 | 0 | 0 | 0 | 0 |';
appendStepSummary(`## E4 Branch Advisor\n\nRecommended next branch: **${top ? `\`${top.branch}\`` : 'none found'}**\n\n| Branch | Fitness | Ahead | Behind | Files | Workflow touches |\n|---|---:|---:|---:|---:|---:|\n${rows}\n\nThis is advisory only. It does not merge branches.\n`);
console.log(JSON.stringify(report, null, 2));
