import { appendGithubOutput, appendStepSummary, changedFiles, changedStats, fileText, readPolicy, writeJson } from './mise-utils.mjs';

const policy = readPolicy();
const risk = policy.risk;
const baseSha = process.env.BASE_SHA || 'HEAD~1';
const headSha = process.env.HEAD_SHA || 'HEAD';
const failOnHighRisk = (process.env.FAIL_ON_HIGH_RISK || 'true').toLowerCase() === 'true';
const isFork = (process.env.IS_FORK || 'false').toLowerCase() === 'true';
const files = changedFiles(baseSha, headSha);
const stats = changedStats(baseSha, headSha);

const criticalFiles = files.filter((file) => risk.criticalPaths.some((prefix) => file.startsWith(prefix) || file.includes(prefix)));
const workflowFiles = files.filter((file) => file.startsWith('.github/workflows/') || file.startsWith('.github/actions/'));
const secretFindings = [];
const dangerousFindings = [];

const secretRegexes = risk.secretPatterns.map((pattern) => new RegExp(pattern, 'g'));
const dangerousRegexes = risk.dangerousWorkflowPatterns.map((pattern) => new RegExp(pattern, 'gi'));

for (const file of files) {
  const text = fileText(file);
  if (!text) continue;

  for (const regex of secretRegexes) {
    const matches = text.match(regex) || [];
    if (matches.length > 0) {
      secretFindings.push({ file, pattern: regex.source, count: matches.length });
    }
  }

  if (file.startsWith('.github/workflows/') || file.startsWith('.github/actions/') || file.startsWith('scripts/')) {
    for (const regex of dangerousRegexes) {
      const matches = text.match(regex) || [];
      if (matches.length > 0) {
        dangerousFindings.push({ file, pattern: regex.source, count: matches.length });
      }
    }
  }
}

let score = 0;
score += Math.min(25, Math.floor(files.length / Math.max(1, risk.maxFilesForLowRisk) * 25));
score += Math.min(25, Math.floor(stats.changed / Math.max(1, risk.maxLinesForLowRisk) * 25));
score += Math.min(25, criticalFiles.length * 8);
score += Math.min(15, dangerousFindings.length * 5);
score += Math.min(40, secretFindings.length * 20);
if (isFork && workflowFiles.length > 0) score += 30;
score = Math.min(100, score);

const blocks = [];
if (risk.failOnSecretFindings && secretFindings.length > 0) blocks.push('Secret-like material detected in changed files.');
if (risk.failOnWorkflowChangesFromForks && isFork && workflowFiles.length > 0) blocks.push('Fork PR attempts to change workflow/action files.');
if (score >= risk.highRiskThreshold) blocks.push(`Risk score ${score} reached high-risk threshold ${risk.highRiskThreshold}.`);

const level = blocks.length > 0 ? 'blocked' : score >= risk.reviewThreshold ? 'review' : 'pass';
const report = {
  gate: 'B1 risk-gate',
  level,
  score,
  failOnHighRisk,
  isFork,
  stats,
  changedFiles: files,
  criticalFiles,
  workflowFiles,
  secretFindings,
  dangerousFindings,
  blocks
};

writeJson('mise-risk-report.json', report);
appendGithubOutput({ risk_level: level, risk_score: score, blocked: blocks.length > 0 ? 'true' : 'false' });

const md = [
  '## B1 Risk Gate',
  '',
  `- Level: **${level}**`,
  `- Score: **${score}/100**`,
  `- Critical files: **${criticalFiles.length}**`,
  `- Secret-like findings: **${secretFindings.length}**`,
  `- Dangerous workflow patterns: **${dangerousFindings.length}**`,
  blocks.length ? `- Blocks: ${blocks.map((b) => `\`${b}\``).join(', ')}` : '- Blocks: none',
  ''
].join('\n');
appendStepSummary(md);
console.log(JSON.stringify(report, null, 2));

if (blocks.length > 0 && failOnHighRisk) {
  console.error(`Mise risk gate blocked this run: ${blocks.join(' | ')}`);
  process.exit(1);
}
